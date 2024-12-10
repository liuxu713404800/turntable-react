import React , {useState} from 'react';
import { Button, Table, Modal, Input } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, AccountBookOutlined } from '@ant-design/icons';
import { prizeSett } from './request';
import './App2.css';

function App2() {

  var columns = [{
    title: 'Data',
    dataIndex: 'name',
    align: 'center',
  }, {
    title: 'Age',
    dataIndex: 'age',
    align: 'center',
  }, {
    title: 'Address',
    dataIndex: 'address',
    align: 'center',
  }, {
    title: 'Deposit/withdraw',
    dataIndex: '',
    align: 'center',
    render: function(record) {
      return <Button type="primary" className='ant-btn-sm' onClick={() => showModal(record)}>Withdrawal</Button>;
    }
  }];

  var data: any = [];
  for (let i=0; i<50; i++) {
    data.push({
      key: i.toString(),
      name: '李大嘴' + i,
      age: 32,
      address: '西湖区湖底公园' + i + '号'
    });
  }

  const [currentPage, setCurrentPage] = useState(1);

  var pagination = {
    total: data.length,
    hideOnSinglePage: true,
    pageSize: 4,
    current: currentPage,
    showSizeChanger: true
  };

  const handlePageChange = (value) => {
    setCurrentPage(parseInt(value.current));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  let recordId;
  let validatorFlag = false;
  let errMsg = '';

  const showModal = (record) => {
    recordId = record.id;
    setIsModalOpen(true);
  };

  const validatePhone = (phone) => {
    const regex = /^\+?([0-9]{1,3})?[-. ]?(\(?[0-9]{1,4}\)?)?[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,9})$/;
    return regex.test(phone);
  }

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };


  const handleOk = () => {
    const params = {
      recordId: recordId,
      username: username,
      phone: phone,
      email: email,
      account: account
    };
    if (!validatePhone(phone)) {
      validatorFlag = false;
      errMsg = 'Please check your phone';
      return;
    }
    if (!validateEmail(email)) {
      validatorFlag = false;
      errMsg = 'Please check your email';
      return;
    }
    prizeSett(params).then((res) => {
      if (res.code == 200) {

      }
      validatorFlag = false;
      errMsg = "";
    });

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const clearUserinfo = () => {
    validatorFlag = true;
    errMsg = "";
    recordId = '';
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


  return (
    <div>
      <div className="main-body">
        <div className="center-line">
          Winners List
        </div>
        <div className="table-warpper">
          <Table columns={columns} dataSource={data} pagination={pagination} size="small" onChange={handleChange} />
        </div>
      </div>
      <Modal title="Withdrawal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input placeholder="please input your username" value={username} onChange={handleUsername} prefix={<UserOutlined />} />
        {/* <Input placeholder="please input your email" value={email} onChange={(e) => {if (validateEmail(e.target.value)) { setEmail(e.target.value);}}} prefix={<MailOutlined />} /> {!validateEmail(email) && <span>Invalid email address</span>} */}
        <Input placeholder="please input your email" value={email} onChange={handleEmail} prefix={<MailOutlined />} />
        <Input placeholder="please input your phone" value={phone} onChange={handlePhone} prefix={<PhoneOutlined />} />
        <Input placeholder="please input your bkash id" value={account} onChange={handleAccount} prefix={<AccountBookOutlined />} />
        {!validatorFlag && <span className='err-msg'>{111}</span>}
      </Modal>
    </div>
  );
}

export default App2;