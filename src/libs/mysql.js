import mysql from 'serverless-mysql';

export const conn = mysql({
  config: {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'admin',
    password: process.env.MYSQL_PASSWORD || 'admin',
    port: process.env.MYSQL_PORT || 3306,
    database: process.env.MYSQL_DATABASE || 'conjunta_web_av',
    ssl: {
      rejectUnauthorized: false
    }
  }
});

export async function query(sql, values) {
  try {
    const results = await conn.query(sql, values);
    await conn.end();
    return results;
  } catch (error) {
    throw Error(error.message);
  }
}
