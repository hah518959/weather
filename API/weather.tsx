import React, { useState, useEffect } from 'react';
import axios from 'axios';

export interface WeatherItem {
  tm: string;
  stn: string;
  wd: string;
  ws: string;
  pa: string;
  ps: string;
  ta: string;
  td: string;
  hm: string;
  vs: string;
}

export const Weather: React.FC = () => {
  const [weatherList, setWeatherList] = useState<WeatherItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<WeatherItem[]>('http://localhost:5000/api/weather')
      .then((res) => {
        console.log('백엔드 수신 데이터:', res.data);
        setWeatherList(res.data);
      })
      .catch((err) => {
        console.error('API 연동 실패:', err);
        setError('백엔드 서버(http://localhost:5000)와 통신에 실패했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>데이터를 불러오는 중...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (weatherList.length === 0) return <div style={{ padding: '20px' }}>데이터가 비어 있습니다.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>지상기상관측 현황 ({weatherList[0]?.tm})</h2>
      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>지점 ID</th>
            <th>기온 (℃)</th>
            <th>습도 (%)</th>
            <th>풍속 (m/s)</th>
            <th>해면기압 (hPa)</th>
          </tr>
        </thead>
        <tbody>
          {weatherList.map((item) => (
            <tr key={item.stn} style={{ textAlign: 'center' }}>
              <td>{item.stn} 번</td>
              <td>{item.ta === '-9' ? '-' : item.ta} ℃</td>
              <td>{item.hm === '-9' ? '-' : item.hm} %</td>
              <td>{item.ws === '-9' ? '-' : item.ws} m/s</td>
              <td>{item.ps === '-9' ? '-' : item.ps} hPa</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Weather;
