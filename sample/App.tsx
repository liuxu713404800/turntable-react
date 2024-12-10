import React from 'react';
import { Button } from 'antd';
import Turntable from '../lib/turntable';
import { showToast } from './toast';
import { getTgUser, fetchPrizes, getPrize } from './request';
import './App.css';

let canStart = false;

// const tgUser = getTgUser();
const tgUser = {
  userId: 7492382861,
  username: 'LiuXu1992'
}
if (!tgUser.userId || !tgUser.username) {
  canStart = false;
  showToast("userId not found");
} else {
  canStart = true;
}

async function getPrizes() {
  const resp = await fetchPrizes();
  if (resp.code !== 200) {
    showToast("feath prizes fail");
    return;
  }
  return resp.data;
}

const prizes = await getPrizes();

function getPrizeIndex(prizeId) {
  for (let i = 0; i < prizes.length; i++) {
    if (i == prizeId) {
      return i - 1;
    }
  }
  return 0;
}

// 生成背景图片
const prizeSize = prizes.length;
function getPrizeBackgrounds() {
  let prizeBackgrounds: string[] = [];
  const backgroundUnit = ['#62CDD8', '#FFFFFF', '#FEB446'];
  const unitSize = backgroundUnit.length;
  const times = Math.floor(prizeSize / unitSize);
  for (let i = 0; i < times; i++) {
    prizeBackgrounds = prizeBackgrounds.concat(backgroundUnit);
  }
  // 下面的含义是，不要让两个相同块的背景颜色拼在一起
  const rest = prizeSize - times * unitSize;
  if (rest == 0) {
    return prizeBackgrounds;
  }
  for (let i = 1; i <= rest; i++) {
    prizeBackgrounds.push(backgroundUnit[i]);
  }
  return prizeBackgrounds;
}

const prizeBackgrounds = getPrizeBackgrounds();

// 生成奖品列表

function getPrizeList() {
  let prizeList: any[] = [];
  for (let i = 0; i < prizeSize; i++) {
    prizeList.push({ 
      texts: [
        {text: prizes[i].name , fontStyle: '13px Arial', fontColor: 'rgba(70, 47, 47, 1)', fromCenter: 0.8},
        {text: `${prizes[i].amount} BDT`, fontStyle: '13px Arial', fontColor: 'rgba(255, 40, 40, 1)', fromCenter: 0.68}],
      background: prizeBackgrounds[i],
      images: [{
          src: '../sample/gift.png',
          width: 25,
          height: 25,
          fromCenter: 0.65,
        }
      ]
    });
  }
  return prizeList;
}

const prizeList = getPrizeList();


function App() {
  const fetchPrizeResult = (abort: () => void) => {
    if (!canStart) { // 未达条件不启动抽奖
      showToast('no times!');
      return false;
    }

    return new Promise<number>((resolve, reject) => {
      getPrize(tgUser.userId).then((res) => {
        if (res.code == 200) {
          const prize = res.data;
          const prizeId = getPrizeIndex(prize.id);
          resolve(prizeId);
        } else {
          reject();
          showToast('sorry, you did not win any prize');
        }
      });
    });
  };

  const complete = (index: number) => {
    showToast('congratulations, you have got ' + prizes[index].name);
  };

  const timeout = () => {
    console.log('Timeout');
    showToast("sorry, you did not win any prize");
  };

  const stateChange = (drawing: boolean) => {
    console.log(drawing ? 'begin' : 'end');
  };

  return (
    <div className='main-body'>
      <div className='header'>
        <Button type="primary" className='share-btn'>&#9776;</Button>
        <Button type="primary" className='share-btn'>&#x1F517;</Button>
      </div>
      <div className="turntable">
        <Turntable
          size={275}
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
