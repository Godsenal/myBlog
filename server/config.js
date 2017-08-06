const env = process.env;
const localDB = 'mongodb://localhost:27017/blogDB';
export const nodeEnv = env.NODE_ENV || 'development';


export default {
  port: env.PORT || 8080,
  portHttps: env.PORT || 8443,
  host: env.HOST || 'localhost',
  domain: env.DOMAIN || 'localhost',
  get serverUrl() {
    return `https://${this.host}:${this.port}`;
  },
  nodeEnv,
  //dbUrl : 'mongodb://localhost:27017/chatDB',
  dbUrl : localDB,
  jwtSecret: 'Godsenal!3737',
  pathToCert: __dirname + '/ssl/server.crt',
  pathToKey: __dirname + '/ssl/server.key',
  //sessionSecret: 'Godsenal!3737',
};
