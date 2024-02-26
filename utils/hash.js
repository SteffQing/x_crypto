const { createHmac } = require('node:crypto');
const { config } = require('dotenv');

config();

const secret = process.env.SALT;

// function hash(input, action = 'encrypt') {
//   try {
//   } catch (error) {
//     throw new Error(error);
//   }
// }

function encrypt(text) {
  const hash = createHmac('sha256', secret).update(text).digest('hex');
  return hash;
}

function decrypt(hash) {
  const text = createHmac('sha256', secret).update(hash).digest('hex');
  return text;
}
