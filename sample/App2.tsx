import React , {useState} from 'react';
import { Button, Table } from 'antd';
import axios from 'axios';
import './App2.css';

function App2() {
  function withdrawal(record) {
    console.log(record);
  }

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
      return <Button type="primary" className='ant-btn-sm' onClick={() => withdrawal(record)}>Withdrawal</Button>;
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
    // hideOnSinglePage: true,
    pageSize: 4,
    current: currentPage,
    showSizeChanger: true,
  };

  const handleChange = (value) => {
    setCurrentPage(parseInt(value.current, 10));
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
    </div>
  );
}

export default App2;