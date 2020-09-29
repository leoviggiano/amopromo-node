require('dotenv/config');

// Basic Auth
const auth = {
  username: process.env.API_USER,
  password: process.env.API_PASS,
  key: process.env.API_KEY,
};

export default auth;
