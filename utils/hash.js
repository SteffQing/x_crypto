const { createHmac } = require('node:crypto');
const { config } = require('dotenv');

config();

const key = process.env.SALT;

function encrypt(text) {
  const iv = crypto.randomBytes(12).toString('base64');
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'base64'),
    Buffer.from(iv, 'base64')
  );
  let ciphertext = cipher.update(text, 'utf8', 'base64');
  ciphertext += cipher.final('base64');
  const tag = cipher.getAuthTag();

  return { ciphertext, iv, tag };
}

function decrypt(ciphertext, iv, tag) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'base64'),
    Buffer.from(iv, 'base64')
  );

  decipher.setAuthTag(Buffer.from(tag, 'base64'));

  let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
  plaintext += decipher.final('utf8');

  return plaintext;
}

export { encrypt, decrypt };
