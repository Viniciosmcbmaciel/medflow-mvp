import crypto from 'crypto';

export function buildSignatureHash(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}
