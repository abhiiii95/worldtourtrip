const config = {
    MONGO_URI: process.env?.MONGO_URI,
    JWT_SECRET: process.env?.JWT_SECRET || 'JWT_SECRET',
    REFRESH_TOKEN_SECRET: process.env?.JWT_SECRET || 'REFRESH_TOKEN_SECRET',
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
  
  export default config;
  