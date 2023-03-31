const withImages = require("next-images");
const dotEnv = require("dotenv");

const prod = process.env.NODE_ENV === "production";

if (!prod) {
  dotEnv.config();
}

module.exports = withImages({
  env: {
    BASE_URL: process.env.BASE_URL,
    MONGO_DB: process.env.MONGO_DB,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  build: {
    env: {
      BASE_URL: process.env.BASE_URL,
      MONGO_DB: process.env.MONGO_DB,
      JWT_SECRET: process.env.JWT_SECRET,
    },
  },
  webpack(config) {
    config.experiments = { topLevelAwait: true, layers: true };
    return config;
  },
});
