import pg from 'pg';

const {Client} = pg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'HelpDeskPro',
  password: '123',
  port: 5433,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

export default client;
