// Links songs that have no SongGenre rows to genres, using the genre text stored on
// their matching Performance row (same TikTok link + song name).
//
// Dry run (default, read-only):  DATABASE_URL=... npx ts-node scripts/backfill-song-genres.ts
// Write the links:               DATABASE_URL=... npx ts-node scripts/backfill-song-genres.ts --apply
//
// Genre names that don't exist yet are created with the same slug rule the admin uses,
// except for the obvious typos in TYPO_FIXES, which point at the intended existing genre.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apply = process.argv.includes('--apply');

const TYPO_FIXES: Record<string, string> = {
  'urban contempoary': 'urbancontemporary',
  'atl hip pop': 'atlhiphop',
  'southern hip pop': 'southernhiphop',
};

// Songs with no Performance genres to copy from, keyed by "videoNo|song name".
// Unreleased ones follow the existing convention ("unreleased" plus a main genre);
// Moon reuses the genres from video 466.
const MANUAL_GENRES: Record<string, string[]> = {
  '275|stars': ['unreleased', 'hip hop'],
  '276|talking/ once again': ['unreleased', 'hip hop'],
  '277|back to me': ['unreleased', 'hip hop'],
  '300|taylor made freestyle': ['unreleased', 'hip hop'],
  '172|songs for women': ['unreleased', 'neo soul'],
  '66|i miss you': ['unreleased'],
  '456|moon': ['r&b', 'alternative r&b', 'canadian contemporary r&b'],
  '529|nights': ['neo soul', 'alternative r&b'],
};

const slugify = (s: string) => TYPO_FIXES[s.trim().toLowerCase()] || s.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
const songKey = (link: string | null, name: string | null) => `${link || ''}|${String(name || '').trim().toLowerCase()}`;

async function main() {
  const [songs, performances, genres] = await Promise.all([
    prisma.song.findMany({ where: { songGenres: { none: {} } }, select: { id: true, videoNo: true, songName: true, artistName: true, tiktokVideoLink: true } }),
    prisma.performance.findMany({ select: { videoURL: true, songName: true, mainGenre: true, subGenre: true, otherGenres: true } }),
    prisma.genre.findMany({ select: { genre: true } }),
  ]);
  const knownGenres = new Set(genres.map(g => g.genre));

  // A song can have several Performance rows (duplicates); use every genre on any of them
  const genresBySong = new Map<string, string[]>();
  performances.forEach(p => {
    const key = songKey(p.videoURL, p.songName);
    const names = [p.mainGenre, p.subGenre, ...(p.otherGenres || [])].filter((g): g is string => !!g && !!g.trim());
    genresBySong.set(key, [...(genresBySong.get(key) || []), ...names]);
  });

  const links: { songId: string; genreId: string }[] = [];
  const unmatchedSongs: typeof songs = [];
  const newGenres = new Map<string, { genreName: string; uses: number }>();
  let linkedSongs = 0;

  songs.forEach(song => {
    const manual = MANUAL_GENRES[`${song.videoNo}|${String(song.songName).trim().toLowerCase()}`];
    const fromPerformance = genresBySong.get(songKey(song.tiktokVideoLink, song.songName));
    const names = fromPerformance?.length ? fromPerformance : manual;
    if (!names) return unmatchedSongs.push(song);
    const slugs = new Set<string>();
    names.forEach(name => {
      const slug = slugify(name);
      if (!slug) return;
      if (!knownGenres.has(slug)) {
        const entry = newGenres.get(slug) || { genreName: name.trim().toLowerCase(), uses: 0 };
        entry.uses++;
        newGenres.set(slug, entry);
      }
      slugs.add(slug);
    });
    if (!slugs.size) return unmatchedSongs.push(song);
    linkedSongs++;
    slugs.forEach(genreId => links.push({ songId: song.id, genreId }));
  });

  console.log(`Mode: ${apply ? 'APPLY' : 'DRY RUN (nothing written)'}`);
  console.log(`Songs with no genre links:       ${songs.length}`);
  console.log(`  would be linked:               ${linkedSongs} songs, ${links.length} links`);
  console.log(`  left unlinked (no Performance genres): ${unmatchedSongs.length}`);
  console.log(`New genres to create:            ${newGenres.size}`);
  console.log('\nTypo fixes applied:');
  Object.entries(TYPO_FIXES).forEach(([from, to]) => console.log(`  "${from}" -> ${to}`));
  console.log('\nNew genres (songs using it):');
  [...newGenres.entries()].sort((a, b) => b[1].uses - a[1].uses).forEach(([slug, g]) => console.log(`  ${String(g.uses).padStart(4)}  ${g.genreName} (${slug})`));
  console.log('\nLeft unlinked, need genres by hand:');
  unmatchedSongs.forEach(s => console.log(`  v${s.videoNo}  ${s.songName} - ${s.artistName}`));

  if (apply) {
    const genreData = [...newGenres.entries()].map(([genre, g]) => ({ genre, genreName: g.genreName }));
    const [createdGenres, createdLinks] = await prisma.$transaction([
      prisma.genre.createMany({ data: genreData, skipDuplicates: true }),
      prisma.songGenre.createMany({ data: links, skipDuplicates: true }),
    ]);
    console.log(`\nCreated ${createdGenres.count} genres and ${createdLinks.count} SongGenre links.`);
  }
}

main().finally(() => prisma.$disconnect());
