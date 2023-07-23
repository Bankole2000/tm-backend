import { object, string } from 'zod';
import { isNotEmpty, isNumbersOnly } from '../helpers/validators';

export const songRequestFields = ['title', 'artist', 'requestedBy'];

export const createRequestSchema = object({
  body: object({
    title: string({
      invalid_type_error: 'Song title must be a string',
      required_error: 'Song title is required',
    }).min(1, 'Song title must be at least 1 character long')
    .refine((data) => isNotEmpty(data), 'Song title cannot be empty'),
    artist: string({
      invalid_type_error: 'Song artist must be a string',
      required_error: 'Song artist is required', 
    }).min(1, 'Song artist must be at least 1 character long')
    .refine((data) => isNotEmpty(data), 'Song artist cannot be empty'),
  })
})