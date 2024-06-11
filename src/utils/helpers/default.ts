import { GenreService } from "../../services/genre.service";
import newData from '../data/new/keysdata.json';
import { arrayToObjectByField } from "@neoncoder/validator-utils";

export const newUpdateData = async () => {
  const gss = new GenreService()
  const { songCount, genreCount, songGenreCount } = (await gss.countAll())!;
  console.log({songCount, genreCount, songGenreCount});
  const genreData = newData['GenreLog']
  const songData = newData['Sheet1']
  const songSample = songData[0]
  const genresToStore = genreData.filter((_, i) => i > 9).map(x => ({genre: x['New Version'], genreName: x['Old Version']}));
  if(genreCount !== genresToStore.length){
    await gss.batchCreateGenres(genresToStore);
  }
  const songGenres = Object.keys(songSample).filter((_, i) => i > 8)
  const songsToStore = songData.map(x => {
    const { VideoNo: videoNo, UUID: id, TikTokVideoLink: tiktokVideoLink, SongName: songName, ArtistName: artistName, ID: spotifyId, AlbumName: albumName, VideoLength: videoLength, YesNo } = x
    return {
      id,
      videoNo,
      tiktokVideoLink,
      songName: String(songName),
      artistName: String(artistName),
      spotifyId,
      albumName: String(albumName),
      videoLength: String(videoLength),
      YesNo: YesNo === 'Yes'
    }
  })
  if(songCount !== songData.length) {
    await gss.batchCreateSongs(songsToStore);
  }
  const songsObject = arrayToObjectByField(songData, 'UUID')
  if(songGenreCount <= songData.length){
    songsToStore.forEach(async (sts) => {
      if(songsObject[sts.id]){
        const songGenreData: {songId: string; genreId: string}[] = []
        const rawSong = songsObject[sts.id]
        songGenres.forEach(g => {
          if(rawSong[g as keyof typeof rawSong]){
            songGenreData.push({songId: sts.id, genreId: g})
          }
        })
        await gss.batchLinkSongGenre(songGenreData)
      }
    })
  }
}