const mysql = require('mysql2/promise');

const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'Xjh1293897103', 
  database: 'charityevents_db', 
  port: 3306,           
  waitForConnections: true,
  connectionLimit: 10,  
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

async function testDbConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('数据库连接成功！测试计算结果：', rows[0].solution);
  } catch (err) {
    console.error('数据库连接失败：', err.message);
  }
}

async function executeQuery(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results; 
  } catch (err) {
    console.error('SQL 查询错误：', err.message);
    throw err; 
  }
}

module.exports = {
  pool,
  testDbConnection,
  executeQuery
};

testDbConnection();
