import React , { useState, useEffect } from 'react';
import {Button, Table, Modal, Input, message} from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, AccountBookOutlined } from '@ant-design/icons';
import Turntable from '../lib/turntable';
import { showToast } from './toast';
import { getTgUser, fetchPrizes, getPrize, getPrizeRecords, prizeSett, getPrizeTimes, getCopyLink } from './request';
import './App.css';

// let canStart = false;

const tgUser = getTgUser();
// let tgUser = {
//   userId: 7492382861,
//   username: "LiuXu1992"
// }

// if (!tgUser.userId || !tgUser.username) {
//   canStart = false;
//   // showToast("userId not found");
// } else {
//   canStart = true;
// }

async function getPrizes() {
  const resp = await fetchPrizes();
  if (resp.code !== 200) {
    showToast("feath prizes fail");
    return;
  }
  return resp.data;
}

const prizes = await getPrizes();
let prizeNameMap = {};
for (let i = 0; i < prizes.length; i++) {
  prizeNameMap[prizes[i].id] = prizes[i].name;
}

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

const resp2 = await getPrizeRecords(tgUser.userId);
let records = [];
if (resp2.code == 200) {
  for (let i = 0; i < resp2.data.length; i++) {
    resp2.data[i].key = resp2.data[i].id;
  }
  records = resp2.data.reverse();
}

let prizeTimes = 0;
let inviterNum = 0;
const resp3 = await getPrizeTimes(tgUser.userId);
if (resp3.code == 200) {
  prizeTimes = resp3.data.times;
  inviterNum = resp3.data.inviterCount;
}

let link = '';
const resp4 = await getCopyLink(tgUser.userId);
if (resp4.code == 200) {
  link = resp4.data;  
}

function formatTime(dateString) {
  var str = new Date(dateString).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
  return str.replaceAll("/", "-");
}

function App() {

  let [leftNum, setLeftNum] = useState(prizeTimes);
  let [inviterCount, setInviterCount] = useState(inviterNum);
  let [recordList, setRecordList] = useState(records);
  
  const fetchPrizeResult = (abort: () => void) => {

    if (leftNum <= 0) { // 未达条件不启动抽奖
      showToast('no times! you can win the lottery by inviting others');
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
    getPrizeRecords(tgUser.userId).then(res => {
      if (res.code == 200) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].key = res.data[i].id;
        }
        setRecordList(res.data.reverse());
      }
    });
    getPrizeTimes(tgUser.userId).then(res => {
      if (res.code == 200) {
        setLeftNum(res.data.times);
        setInviterCount(res.data.inviterCount);
      }
    });
  };

  const timeout = () => {
    showToast("sorry, you did not win any prize");
  };

  const stateChange = (drawing: boolean) => {
    console.log(drawing ? 'begin' : 'end');
  };

  var columns = [{
    title: 'Time',
    key: 'createTime',
    dataIndex: 'createTime',
    render: function(record) {
      let time = formatTime(record);
      return <span> {time} </span>;
    }
  }, {
    title: 'Prize',
    key: 'prizeId',
    dataIndex: '',
    render: function(record) {
      return <span> {prizeNameMap[record.prizeId]} </span>;
    }
  }, {
    title: 'Withdrawal',
    key: 'withdrawal',
    dataIndex: '',
    render: function(record) {
      if (record.status == 1) {
        return <Button type="primary" className='ant-btn-sm' onClick={() => showModal(record)}>Withdrawal</Button>;
      } else {
        return <Button type="primary" className='ant-btn-sm' onClick={() => showModal(record)} disabled={true}>Withdrawal</Button>;
      }
    }
  }];

  const [currentPage, setCurrentPage] = useState(1);

  var pagination = {
    total: recordList.length,
    hideOnSinglePage: true,
    pageSize: 4,
    current: currentPage,
    showSizeChanger: true
  };

  const handlePageChange = (value) => {
    setCurrentPage(parseInt(value.current));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordId, setRecordId] = useState(0);
  const [validatorFlag, setValidatorFlag] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  const showModal = (record) => {
    setIsModalOpen(true);
    setRecordId(record.id);
  };

  const validatePhone = (phone) => {
    if (!phone) {
      return false;
    }
    const regex = /^([+]?0?\d{2,3}-?|\([+]?0?\d{2,3}\)|\([+]?0?\d{2,3}\))?\d+$|^([+]?0?\d{2,3}-?|\([+]?0?\d{2,3}\)|\([+]?0?\d{2,3}\))?[1-9]\d{4,10}(-\d{1,10})?$/
    return regex.test(phone);
  }

  const validateEmail = (email) => {
    if (!email) {
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const handleOk = () => {
    if (!validatePhone(phone)) {
      setValidatorFlag(false);
      setErrMsg('Invalid phone number');
      return;
    }
    if (!validateEmail(email)) {
      setValidatorFlag(false);
      setErrMsg('Invalid email');
      return;
    }
    const params = {
      recordId: recordId,
      username: username,
      phone: phone,
      email: email,
      account: account
    };
    prizeSett(params).then((res) => {
      if (res.code == 200) {
        showToast("submitted successfully, payment will be made later");
        getPrizeRecords(tgUser.userId).then(res => {
          if (res.code == 200) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].key = res.data[i].id;
            }
            setRecordList(res.data.reverse());
          }
        });
      } else {
        showToast("error");
      }
    });

    setIsModalOpen(false);
    clearUserinfo();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    clearUserinfo();
  };

  const clearUserinfo = () => {
    setValidatorFlag(true);
    setErrMsg("");
    setRecordId(0)
    setUsername("");
    setEmail("");
    setPhone("");
    setAccount("");
  }

  const [username, setUsername] = useState('');
  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const [email, setEmail] = useState('');
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const [phone, setPhone] = useState('');
  const handlePhone = (event) => {
    setPhone(event.target.value);
  };

  const [account, setAccount] = useState('');
  const handleAccount = (event) => {
    setAccount(event.target.value);
  };

  const [copyLink, setLink] = useState(link);
  const handleCopyLink= (event) => {
    showToast("your invite link is copied");
    navigator.clipboard.writeText(copyLink);
  };
  const leavePage= (event) => {
    console.log("leavePage");
    window.close();
  };

  return (
    <div className="main-body">
      <div className="header">
        <Button type="primary" className="share-btn" onClick={leavePage}>&#10006;</Button>
        <Button type="primary" className="share-btn" onClick={handleCopyLink}>&#x1F517;</Button>
      </div>
      <div className='invite-line'>
          You have invited <span className='yellow-msg'> {inviterCount} </span>friends
      </div>
      <div className="turntable">
        <Turntable
            size={275}
            prizes={prizeList}
            onStart={fetchPrizeResult}
            onComplete={complete}
            onTimeout={timeout}
            onStateChange={stateChange}
            duration={3000}
            timeout={5000}
            auto={false}
        >
          {/* 转盘指针 点击按钮 */}
          <div className="turntable-pointer">
            <img className="pointer-img" src={require('./pointer.png')} alt="" />
          </div>
        </Turntable>
      </div>
      <div className='bonus-line'>
          You still have <span className='red-msg'> {leftNum} </span> lucky draws left
      </div>
      <div className="center-line">Winners List</div>
      <div className="table-warpper">
          <Table columns={columns} dataSource={recordList}  pagination={pagination} size="small" onChange={handlePageChange} />
      </div>
      <Modal title="Withdrawal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input placeholder="please input your username" value={username} onChange={handleUsername} prefix={<UserOutlined />} />
        {/* <Input placeholder="please input your email" value={email} onChange={(e) => {if (validateEmail(e.target.value)) { setEmail(e.target.value);}}} prefix={<MailOutlined />} /> {!validateEmail(email) && <span>Invalid email address</span>} */}
        <Input placeholder="please input your email" value={email} onChange={handleEmail} prefix={<MailOutlined />} />
        <Input placeholder="please input your phone" value={phone} onChange={handlePhone} prefix={<PhoneOutlined />} />
        <Input placeholder="please input your bkash id" value={account} onChange={handleAccount} prefix={<AccountBookOutlined />} />
        {!validatorFlag && <span className='red-msg'>{errMsg}</span>}
      </Modal>
    </div>
  );
}

export default App;