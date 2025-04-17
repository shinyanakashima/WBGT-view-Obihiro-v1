import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [bgcolor, setBgColor] = useState('#ffffff');
  const [maxKey, setMaxKey] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [wgbtLevel, setWgbtLevel] = useState("Loading...");
  const dateKey = new Date().toLocaleDateString("ja-JP", {
    year: "numeric", month: "2-digit",
    day: "2-digit"
  }).replaceAll('/', '');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("https://6ealbffjxfgzo4r3kuiac7txry0bnwbm.lambda-url.us-east-1.on.aws/");
        const respData = resp.data;
        const todayData = respData[dateKey];
        console.log(todayData);

        // 最大値とそのキーを取得する
        const { maxKey, maxValue } = Object.entries(todayData).reduce((acc, [key, value]) => {
          if (value > acc.maxValue) {
            return { maxKey: key, maxValue: value };
          }
          return acc;
        }, { maxKey: null, maxValue: -Infinity });

        console.log(`最大WGBT: ${maxValue}`);
        console.log(`最大値の時間キー: ${maxKey}`);
        // 状態を更新する
        setMaxKey(maxKey);
        setMaxValue(maxValue);

        if (maxValue >= 31) {
          setBgColor('#ff2800');
          setWgbtLevel("危険");
        } else if (maxValue >= 28) {
          setBgColor('#ff9600');
          setWgbtLevel("厳重警戒");
        } else if (maxValue >= 25) {
          setBgColor('#faf500');
          setWgbtLevel("警戒");
        } else if (maxValue >= 21) {
          setBgColor('#a0d2ff');
          setWgbtLevel("注意");
        } else {
          setBgColor('#218cff');
          setWgbtLevel("ほぼ安全");
        }
      } catch (err) {
        console.error('Error: ', err);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="App" style={{ backgroundColor: bgcolor }}>
      <header className="App-header">
        <section>熱中症予測@十勝　今日これからの最高WGBT</section>
      </header>
      <main className="App-main">
        {maxValue !== null && maxKey !== null && (
          <section>
            <div classNmae="App-main-example">{maxKey}時頃に</div>
            <div className="App-main-caution">
              <p> {wgbtLevel} : {maxValue} ℃</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
