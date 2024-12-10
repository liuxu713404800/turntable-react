import React , {useState} from 'react';
import { Button, Table } from 'antd';
import './App2.css';

function App2() {

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
  render: function(text, record) {
    return <span>
      <a>
        提现
      </a>
    </span>;
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
  showSizeChanger: true
};

const handleChange = (value) => {
  setCurrentPage(parseInt(value.current));
};

  return (
    <div>
      <div className='main-body'>
        <div className='center-line'>
          中奖记录
        </div>
        <div className='table-warpper'>
          <Table columns={columns} dataSource={data} pagination={pagination} size="small" onChange={handleChange}/>
        </div>
      </div>
    </div>
  );
}

export default App2;