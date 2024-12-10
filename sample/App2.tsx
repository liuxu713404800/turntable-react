import React , {useState} from 'react';
import { Button, Table, Modal, Input } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, AccountBookOutlined } from '@ant-design/icons';
import './App2.css';

function App2() {

  function withdrawal(record) {
    console.log(record);
  }


  var columns = [{
    title: '日期',
    dataIndex: 'name'
  }, {
    title: '年龄',
    dataIndex: 'age'
  }, {
    title: '住址',
    dataIndex: 'address'
  }, {
    title: '操作',
    dataIndex: '',
    render: function(record) {
      return <Button type="primary" className='ant-btn-sm' onClick={() => showModal(record)}>Withdrawal</Button>
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

  const showModal = (record) => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className='main-body'>
        <div className='center-line'>
          中奖记录
        </div>
        <div className='table-warpper'>
          <Table columns={columns} dataSource={data} pagination={pagination} size="small" onChange={handlePageChange}/>
        </div>
      </div>
      <Modal title="Withdrawal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input placeholder="please input your username" prefix={<UserOutlined />} />
        <Input placeholder="please input your email" prefix={<MailOutlined />} />
        <Input placeholder="please input your phone" prefix={<PhoneOutlined />} />
        <Input placeholder="please input your account" prefix={<AccountBookOutlined />} />
      </Modal>
    </div>
  );
}

export default App2;