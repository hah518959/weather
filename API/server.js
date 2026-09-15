import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv'; // 1. dotenv 추가

dotenv.config(); // 2. .env 파일 로드

const app = express();
app.use(cors());

function parseWeatherText(rawText) {
  const lines = rawText.split('\n');
  const parsedData = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const cols = trimmed.split(/\s+/);

    parsedData.push({
      tm: cols[0],   // 관측시간
      stn: cols[1],  // 지점 ID
      wd: cols[2],   // 풍향
      ws: cols[3],   // 풍속
      pa: cols[7],   // 현지기압
      ps: cols[8],   // 해면기압
      ta: cols[11],  // 기온
      td: cols[12],  // 이슬점온도
      hm: cols[13],  // 습도
      vs: cols[29]   // 시정
    });
  }

  return parsedData;
}

const date:String = '';

app.get('/api/weather', async (req, res) => {
  try {
    const url = 'https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php?tm=202609150900&authKey={APIKEY}&dataType=JSON'; 

    const response = await axios.get(url, {
      params: {
        authKey: process.env.WEATHER_API_KEY, // .env 파일의 WEATHER_API_KEY 사용
        tm: req.query.tm || '202609150900',   // 관측시간 (없으면 기본값)
        stn: req.query.stn || '0',             // 0: 전체지점, 108: 서울 등
        help: '0'                              // 0: 도움말 미포함
      },
      responseType: 'text'
    });

    // 백엔드 터미널 창에서 기상청이 실제로 보낸 응답 앞부분 출력
    console.log('--- 기상청 응답 시작 ---');
    console.log(response.data.slice(0, 300));
    console.log('--- 기상청 응답 끝 ---');

    // 응답이 에러 문구인지 확인
    if (response.data.includes('AUTH ERROR') || response.data.includes('INVALID')) {
      return res.status(400).json({ message: 'API 키 또는 인증 오류 발생', raw: response.data });
    }

    const parsedData = parseWeatherText(response.data);
    res.json(parsedData);
  } catch (error) {
    console.error('서버 내부 에러:', error.message);
    res.status(500).json({ message: '데이터를 가져오지 못했습니다ㅠㅠㅠㅠㅠㅠㅠ.', error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
