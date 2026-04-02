require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.static(path.join(__dirname)));

app.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT name FROM test LIMIT 1');
    client.release();

    if (result.rows.length > 0) {
      const name = result.rows[0].name;
      res.send(`<h1>Rocket Lab 서버 작동 중!</h1><p>DB 연결 확인: HELLO ${name}</p><p><a href="/nozzle.html">노즐 설계 도구 바로가기</a></p>`);
    } else {
      res.send('<h1>Rocket Lab 서버 작동 중!</h1><p>HELLO (테이블에 데이터가 없습니다)</p><p><a href="/nozzle.html">노즐 설계 도구 바로가기</a></p>');
    }
  } catch (error) {
    res.status(500).send('<h1>서버 작동 중</h1><p>DB 연결에 실패했습니다. <a href="/nozzle.html">설계 도구로 이동</a></p>');
  }
});

app.get('/nozzle.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'nozzle.html'));
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
