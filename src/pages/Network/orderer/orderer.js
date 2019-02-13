import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Tabs,
  Table,
  Radio,
  Select,
  Menu,
  Dropdown,
  Button,
  Form,
  message,
  Upload,
} from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import TabPaneCon from '@/components/TabPaneCon';
import WrapGenerateCert from '../generateCert';
import WrapOrdererDeploy from './ordererDeploy';
import styles from '../index.less';

import peer from '@/assets/节点.png';

const { TabPane } = Tabs;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const host = window.hostIp;
@connect(({ network, loading }) => {
  return {
    network,
    loading: loading.effects['network/getConfigOrderer'],
  };
})
class OrdererNetwork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOrderer: null,
      listSwitch: true,
      certId: null,
      shouldCheck: true,
      disabled: false,
      certTypeFlag: true,
      certType: 'tls',
      tlsFileList: [],
      addSet: true,
    };
    this.downloadFile = React.createRef();
    this.deleteOrderer = this.deleteOrderer.bind(this);
    this.updateTable = this.updateTable.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'network/getConfigOrderer',
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const prevNetwork = prevProps.network;
    const prevOrdererDelete = prevNetwork.ordererDelete;

    const { dispatch, network } = this.props;
    const { ordererConfig, ordererDelete } = network;
    const { updateSwitch } = this.state;
    if (ordererConfig && this.state.listSwitch) {
      this.setState({
        currentOrderer: ordererConfig[0],
        listSwitch: false,
      });
    }

    if (ordererDelete && !prevOrdererDelete) {
      this.updateTable();
      ordererConfig.length === 1 && this.setState({
          currentOrderer: null
      })
    } else if (
      prevOrdererDelete &&
      ordererDelete &&
      ordererDelete.time !== prevOrdererDelete.time
    ) {
      this.updateTable();
      ordererConfig.length === 1 && this.setState({
        currentOrderer: null
    })
    }

    if (updateSwitch) {
      dispatch({
        type: 'network/getConfigOrderer',
      });
      this.setState({
        updateSwitch: false,
      });
    }

    
  }

  updateTable() {
    this.setState({
      updateSwitch: true,
    });
  }

  beforeUpload = file => {
    const fileName = file.name;
    const matchArr = fileName.split('.');
    if(!matchArr){
        message.error('只能上传zip格式的文件！');
        return false;
    }else{
        const type = matchArr[matchArr.length-1];
        if (type !== 'zip') {
            message.error('只能上传zip格式的文件！');
            return false;
        }
    }
  };




  deleteOrderer = ordererName => {
    const { dispatch } = this.props;
    if (confirm('确定删除吗？')) {
      dispatch({
        type: 'network/ordererDelete',
        payload: { ordererName },
      });
    }
  };

  managePeer = (name, oper, message) => {
    // debugger;
    console.log(message==undefined)
    const { dispatch } = this.props;
    if (typeof message !== 'undefined') {
      if (confirm(message)) {
        dispatch({
          type: 'network/handleManageOrderer',
          payload: {
            ordererName: name,
            oper,
          },
        });
      }
    } else {
      dispatch({
        type: 'network/handleManageOrderer',
        payload: {
          ordererName: name,
          oper,
        },
      });
    }
  };

  render() {
    const { currentOrderer, tlsFileList, addSet } = this.state;
    const { network, loading } = this.props;
    const {
      ordererConfig,
      ordererCertId,
      ordererDownload,
      ordererDelete,
      ordererImageVersion,
    } = network;
    const { getFieldDecorator } = this.props.form;

    const detailInfo = (
      <div className={styles.peer}>
        Orderer节点 - {currentOrderer ? currentOrderer.ordererName : '当前没有节点'}
      </div>
    );

    ordererConfig &&
      ordererConfig.map((item, i) => {
        return (ordererConfig[i].key = i);
      });
    const ordererConfigCol = [
      {
        title: '名称',
        dataIndex: 'ordererName',
      },
      {
        title: '节点所属主机',
        dataIndex: 'hostName'
      },
      {
        title: '容器ID',
        dataIndex: 'containerId',
        render: (text)=>{
          if(text){
            return text
          }else{
            return '-'
          }
        }
      },
      {
        title: '创建者',
        dataIndex: 'creator'
      },
      {
        title: '节点所在网络',
        dataIndex: 'dockerNetwork'
      },
      {
        title: '是否使用了TLS',
        dataIndex: 'tlsEnable',
        render: (text)=>{
          if(text){
            return '是'
          }else{
            return '否'
          }
        }
      },
      {
        title: '删除',
        dataIndex: 'delete',
        render: (text, record) => {
          return (
            <a href="javascript:;" onClick={() => this.deleteOrderer(record.ordererName)}>
              删除
            </a>
          );
        },
      },
    ];

    const managePeerCol = [
      {
        title: '名称',
        dataIndex: 'ordererName',
      },
      {
        title: '启动服务',
        dataIndex: 'start',
        render: (text, record) => {
          return (
            <a href="javascript:;" onClick={() => this.managePeer(record.ordererName, 'start')}>
              启动
            </a>
          );
        },
      },
      
      {
        title: '重启服务',
        dataIndex: 'restart',
        render: (text, record) => {
          return (
            <a
              href="javascript:;"
              onClick={() => this.managePeer(record.ordererName, 'restart', '确定重启吗？')}
            >
              重启
            </a>
          );
        },
      },
      {
        title: '停止服务',
        dataIndex: 'pause',
        render: (text, record) => {
          return (
            <a
              href="javascript:;"
              onClick={() => this.managePeer(record.ordererName, 'pause', '确定停止吗？')}
            >
              停止
            </a>
          );
        },
      },
      {
        title: '继续运行服务',
        dataIndex: 'unpause',
        render: (text, record) => {
          return (
            <a
              href="javascript:;"
              onClick={() => this.managePeer(record.ordererName, 'unpause')}
            >
              继续运行服务
            </a>
          );
        },
      },
      
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };

    return (
      <PageHeaderLayout detailInfo={detailInfo} logo={peer}>
        <Tabs defaultActiveKey="1" className={styles.tabs}>
          <TabPane
            className={styles.tabChildren}
            tab={
              <span>
                <Icon type="file-text" />
                节点信息
              </span>
            }
            key="1"
          >
            
            <TabPaneCon children={<Table bordered dataSource={ordererConfig} columns={ordererConfigCol}/>} title="Orderer列表"/>
            <TabPaneCon children={<Table bordered dataSource={ordererConfig} columns={managePeerCol}/>} title="管理Orderer节点"/>
          </TabPane>
          <TabPane
            className={styles.tabChildren}
            tab={
              <span>
                <Icon type="setting" />
                创建节点
              </span>
            }
            key="2"
          >
            <TabPaneCon children={<WrapOrdererDeploy updateTable={this.updateTable}/>} title="创建Orderer节点"/>
          </TabPane>
        </Tabs>
        <div ref={this.downloadFile} style={{ display: 'none' }} />
      </PageHeaderLayout>
    );
  }
}

const WrapOrdererNetwork = Form.create({})(OrdererNetwork);
export default WrapOrdererNetwork;
