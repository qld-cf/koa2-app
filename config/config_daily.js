module.exports = {
  mysql: {
    client: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '123',
      database: 'koa',
    },
  },
  redis: {
    standalone: {
      host: '127.0.0.1',
    },
  },
};