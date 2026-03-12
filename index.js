// 로컬 환경에서 .env 파일을 사용하기 위함 (Render 배포 시에는 Render의 환경변수를 자동으로 사용함)
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');

const app = express();
// Render는 process.env.PORT 환경변수를 주입하므로 이를 우선적으로 사용해야 합니다.
const port = process.env.PORT || 3000;

// PostgreSQL(Neon) 커넥션 풀 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon DB 연결 시 필수적인 SSL 설정입니다.
  }
});

app.get('/', async (req, res) => {
  try {
    // 1. DB 연결
    const client = await pool.connect();
    
    // 2. test 테이블에서 name 레코드 1개 조회
    const result = await client.query('SELECT name FROM test LIMIT 1');
    client.release(); // 연결 반환

    // 3. 데이터가 있을 경우와 없을 경우 분기 처리
    if (result.rows.length > 0) {
      const name = result.rows[0].name;
      res.send(`HELLO ${name}`);
    } else {
      res.send('HELLO (테이블에 데이터가 없습니다)');
    }
    
  } catch (error) {
    console.error('DB 연결 또는 쿼리 에러:', error);
    res.status(500).send('서버에서 데이터베이스를 조회하는 중 오류가 발생했습니다.');
  }
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
