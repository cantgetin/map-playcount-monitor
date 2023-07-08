require('dotenv').config();

module.exports = {
    // Other Next.js config options...

    env: {
        CLIENT_ID: process.env.CLIENT_ID,
        REDIRECT_URI: process.env.REDIRECT_URI,
        CLIENT_SECRET: process.env.CLIENT_SECRET
    },
};
