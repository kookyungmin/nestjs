import * as crypto from 'crypto';

export const getSha512Hash= (value: string): string => {
  return crypto.createHash('sha512')
      .update(value)
      .digest('hex');
}