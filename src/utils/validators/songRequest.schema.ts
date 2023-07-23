import { object, string } from 'zod';
import { isNotEmpty, isNumbersOnly } from '../helpers/validators';

export const createRequestSchema = object({
  body: object({
    title: string({
      invalid_type_error: 'Song title must be a string'
    }).min(1, 'Firstname must be at least 1 character long')
    .refine((data) => isNotEmpty(data), 'Firstname cannot be empty')
  })
})