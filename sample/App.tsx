import React from 'react';
import Turntable from '../lib/turntable';
import { Button } from 'antd';
import './App.css';
import axios from 'axios';


// const tgApp = window.Telegram.WebApp;
// const userInfo = tgApp.initDataUnsafe.user;
// const userId = userInfo.id;
// const username = userInfo.name;

// const params = {
//   userId: userId,
//   username: username, 
//   inviterId: ''
// };
// const bondUrl = "" + "/api/bind/user";
// const bindRes = await axios.post(bondUrl, params, {headers: {"Content-Type": "application/json"}});


const bondUrl = " http://192.168.245.1:20385/apiV1/user/getUserInfo?token=123";
const bindRes = await axios.get(bondUrl);
const prizeBackgrounds: string[] = [
  '#62CDD8', '#FFFFFF', '#FEB446', '#FFFFFF', '#62CDD8', '#FFFFFF', '#FEB446', '#FFFFFF'
];

Toastify({
  text: "This is a toast",
  duration: 3000,
  className: "info",
  gravity: "top", // `top` or `bottom`
  position: "center", 
  style: {
    background: "#afa8a7",
  }
}).showToast();

const prizeList = Array(8).fill(0).map((_, index) => ({
  texts: index === 0 ? [
    {
      text: 'Thanks', fontStyle: '13px Arial', fontColor: 'rgba(70, 47, 47, 1)', fromCenter: 0.8,
    },
    {
      text: 'Join', fontStyle: '13px Arial', fontColor: 'rgba(70, 47, 47, 1)', fromCenter: 0.68,
    },
  ] : [
    {
      text: 'Prize Value', fontStyle: '13px Arial', fontColor: 'rgba(70, 47, 47, 1)', fromCenter: 0.8,
    },
    {
      text: `${index * 1000}Ton`, fontStyle: '13px Arial', fontColor: 'rgba(255, 40, 40, 1)', fromCenter: 0.68,
    },
  ],
  background: prizeBackgrounds[index],
  images: index === 0 ? undefined : [
    {
      src: '../sample/gift.png',
      width: 25,
      height: 25,
      fromCenter: 0.65,
    },
  ],
}));


function App() {

  const canStart = true;
  
  const toast = (msg: string) => {
    console.log(msg);
  };

  const fetchPrizeResult = (abort: () => void) => {
    if (!canStart) { // 未达条件不启动抽奖
      toast('no times!');
      return false;
    }
    return new Promise<number>((resolve, reject) => {
      // setTimeout 模拟接口请求抽奖结果
      setTimeout(() => {
        const resultPrizeIndex = 3;
        if (resultPrizeIndex < 0) { // 未达条件不启动抽奖
          reject();
          toast('something is wrong!');
        } else {
          resolve(resultPrizeIndex);
        }
      }, 90);
    });
  };

  const complete = (index: number) => {
    console.log(`Congratulations - ${[index]} `, prizeList[index]);
  };

  const timeout = () => {
    console.log('Timeout');
  };

  const stateChange = (drawing: boolean) => {
    console.log(drawing ? 'In' : 'Out');
  };

  return (
    <div className='main-body'>
      <div className='header'>
        <Button type="primary" className='share-btn'>Share</Button>
      </div>
      <div className="turntable">
        <Turntable
          size={400}
          prizes={prizeList}
          onStart={fetchPrizeResult}
          onComplete={complete}
          onTimeout={timeout}
          onStateChange={stateChange}
        >
          {/* 转盘指针 点击按钮 */}
          <div className="turntable-pointer">
            <img className="pointer-img" src={require('./pointer.png')} alt="" />
          </div>
        </Turntable>
      </div>
    </div>
  );
}

export default App;
