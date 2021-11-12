//Update with your config settings.

export default {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 8889,
      user: 'root',
      password: 'root',
      database: 'ecommerce',
    },
    migrations: {
      directory: __dirname + '/db/migrations',
    },
    seeds: {
      directory: __dirname + '/db/seeds',
    },
    pool: { min: 0, max: 7 },
  },

  development2: {
    client: 'sqlite3',
    connection: { filename: './ecommerce.sqlite' },
    useNullAsDefault: true,
  },
};