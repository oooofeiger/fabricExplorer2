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
  Button,
  Form,
  Input,
  Select,
  message,
  Modal
} from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import TabPaneCon from '@/components/TabPaneCon';
import WrapRegisterUser from './registerUser';
// import WrapUserOperation from './userOperation';
// import WrapLocalCertInfo from './localCertInfo';
import WrapDeleteUser from './deleteUser';
import WrapEnroll from './Enroll';
import { downloadFile } from '@/utils/utils';
import styles from '../style.less';

import org from '@/assets/组织.png';

const { TabPane } = Tabs;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const host = window.hostIp;
@connect(({ CAManager, CAUserManager, loading }) => {
  return {
    CAUserManager,
    CAManager,
    loading: loading.effects['CAUserManager/handleGetCAUser'],
  };
})
class CAUserManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        activeKey: '1',   //展开的tab页
        serverName: '',
        visible: false,
        modalTitle:'',
        update: false,
    };

    this.handleChangeTabs = this.handleChangeTabs.bind(this);
    this.Modal = '';
    this.downloadEle = React.createRef();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
        type: 'CAUserManager/handleGetCAUser'
    })
    dispatch({
        type: 'CAManager/handleGetCA'
    })
  }

  componentDidUpdate(){
    const { CAManager, dispatch } = this.props;
    const { getCA } = CAManager;
    const { serverName, update } = this.state;
    if(getCA && getCA.length > 0 && serverName === ''){
        this.setState({
            serverName: getCA[0].serverName
        })
    }
    if(update){
        dispatch({
            type: 'CAUserManager/handleGetCAUser'
        })
        this.setState({
            update: false
        })
    }
  }

  handleChangeTabs = (key)=> {
    this.setState({
        activeKey: key
    })  
  }

  handleClickName = (name) => {
    console.log(name)
    this.setState({
        userId: name,
        activeKey: '2'
    })
  }


  changeSelectCA = (e) => {
      this.setState({
          serverName: e
      })
  }

  changeSelectServer = (key) =>{
    this.setState({
        serverName: key
    })
  }

  DeleteUser = (userId,serverName) => {
    this.setState({
        visible: true,
        modalTitle: '注销用户'
    })
    this.Modal = <WrapDeleteUser serverName={serverName} userId={userId} shouldUpdate={this.shouldUpdate} />
  }

  Enroll = (userId,serverName) => {
    this.setState({
        visible: true,
        modalTitle: '登记用户证书'
    })
    this.Modal = <WrapEnroll serverName={serverName} userId={userId} />
  }

  downloadAllCert = (userId,serverName) => {
    const params = {
        ele: this.downloadEle.current,
        fileName: `${userId}_certs.zip`,
        url: `http://${host}/ca/cert/download/${serverName}/${userId}`,
        type: 'get'
    }
    downloadFile(params);
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
        visible: false,
    });
  }

  shouldUpdate = () => {
      this.setState({
          update: true
      })
  }

  render() {
    const { CAUserManager, CAManager } = this.props;
    const { getCAUser } = CAUserManager;
    const { getCA } = CAManager;
    const { activeKey, serverName, userId, modalTitle } = this.state;

    const detailInfo = (
      <div className={styles.peer}>CA用户管理</div>
    );

    function SelectServer(props){
        return <Select
                showSearch
                style={{ width: 200 }}
                placeholder="请选择CA服务"
                defaultValue={props.serverName}
                optionFilterProp="children"
                onChange={props.changeSelectServer}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {
                props.serverData && props.serverData.length>0 ? props.serverData.map((item)=>{
                    return (<Option value={item.serverName} key={item.serverName}>{item.serverName}</Option>)
                }) : ''
                }
            </Select>
    }

    getCAUser && getCAUser.map((item,index)=>{
        return item.key = index
    })

    const CAUserColumns = [{
        dataIndex: 'id',
        title: '用户ID',
        render: (text)=>(<a onClick={this.handleClickName.bind(this,text)}>{text}</a>)
    },{
        dataIndex: 'serverName',
        title: 'CA服务名称'
        
    },{
        dataIndex: 'creator',
        title: '创建者'
    },{
        dataIndex: 'type',
        title: '用户类型'
    },{
        dataIndex: 'affiliation',
        title: '从属关系',
        render: (text)=>(<span>{text===''?'无':text}</span>)
    },{
        dataIndex: 'attributes',
        title: '用户属性',
        width:'30%',
        render: (text)=>{
            if(text && text.length>0){
                let array = JSON.parse(text);
                return <div>
                    {
                        array.map(ele=>{
                            return <p style={{marginBottom:'0.5em'}} key={ele.name}>{ele.name + ' : ' + ele.value  }</p>
                        })
                    }
                </div>
               
            }
            
        }
    },{
        dataIndex: 'maxEnrollments',
        title: '最大证书登记次数',
        render: (text)=>(<span>{text === -1?'无限制':text}</span>)
    },{
        dataIndex: 'enroll',
        title: '登记用户证书',
        render: (text,item)=>(<a onClick={this.Enroll.bind(this,item.id,item.serverName)}>登记</a>)
    },{
        dataIndex: 'downloadAllCert',
        title: '下载全部证书',
        render: (text,item)=><a onClick={this.downloadAllCert.bind(this,item.id,item.serverName)}>下载全部证书</a>
    },{
        dataIndex: 'delete',
        title: '注销用户',
        render: (text,item)=><a onClick={this.DeleteUser.bind(this,item.id,item.serverName)}>注销</a>
    }]



    

    return (
      <PageHeaderLayout detailInfo={detailInfo} logo={org}>
        <Tabs onChange={this.handleChangeTabs} activeKey={activeKey} className={styles.tabs}>
            <TabPane
                className={styles.tabChildren}
                tab={<span><Icon type="file-text" />用户列表</span>}
                key="1"
            >
                <TabPaneCon children={<Table bordered pagination={{pageSize:5}} dataSource={getCAUser} columns={CAUserColumns}  />} title="用户列表"/>
            </TabPane>
            {/* <TabPane
                className={styles.tabChildren}
                tab={<span><Icon type="file-text" />用户操作</span>}
                key="2"
            >
                <TabPaneCon children={<WrapUserOperation bordered serverName={serverName} userId={userId} />} title="用户列表"/>
            </TabPane> */}
            <TabPane
                className={styles.tabChildren}
                tab={<span><Icon type="file-text" />注册用户</span>}
                key="2"
            >
                <TabPaneCon children={<WrapRegisterUser serverName={serverName} getCA={getCA} userData={getCAUser} />} title="注册用户"/>
            </TabPane>
        </Tabs>
        <Modal
            title={modalTitle}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
        >
            {this.Modal}
        </Modal>
        <div ref={this.downloadEle}></div>
      </PageHeaderLayout>
    );
  }
}

const WrapCAUserManager = Form.create({})(CAUserManager);
export default WrapCAUserManager;
