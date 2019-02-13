import React from 'react';
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
  Upload,
  Tooltip,
  message,
} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@connect(({ dockerList, loading }) => {
  return {
    dockerList,
    loading: loading.effects['dockerList/handleGetDockerInfo']
  };
})
class DockerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowId:''
    };

    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleClickPause = this.handleClickPause.bind(this);
    this.handleClickRestart = this.handleClickRestart.bind(this);
    this.handleClickStart = this.handleClickStart.bind(this);
    this.handleClickUnpause = this.handleClickUnpause.bind(this);
  }

  componentDidMount() {
    const { containerId, dispatch, hostName } = this.props;
    if(hostName && containerId){
      dispatch({
        type: 'dockerList/handleGetDockerInfo',
        payload: {
          containerId,
          hostName
        }
      })
      this.setState({
        nowId: containerId
      })
    }
    
  }


  componentDidUpdate() {
    const { containerId, dispatch, hostName } = this.props;
    const { nowId } = this.state;
    if(containerId && nowId !== containerId){
      dispatch({
        type: 'dockerList/handleGetDockerInfo',
        payload: {
          containerId,
          hostName
        }
      })
      this.setState({
        nowId: containerId
      })
    }
    
  }

  handleClickStart = () => {
    const { dispatch, hostName } = this.props;
    const { nowId } = this.state;
    dispatch({
      type: 'dockerList/handleDockerStart',
      payload: {
        containerId: nowId,
        hostName
      }
    })
  }

  handleClickPause = () => {
    const { dispatch, hostName } = this.props;
    const { nowId } = this.state;
    dispatch({
      type: 'dockerList/handleDockerPause',
      payload: {
        containerId: nowId,
        hostName
      }
    })
  }

  handleClickUnpause = () => {
    const { dispatch, hostName } = this.props;
    const { nowId } = this.state;
    dispatch({
      type: 'dockerList/handleDockerUnpause',
      payload: {
        containerId: nowId,
        hostName
      }
    })
  }

  handleClickRestart = () => {
    const { dispatch, hostName } = this.props;
    const { nowId } = this.state;
    dispatch({
      type: 'dockerList/handleDockerRestart',
      payload: {
        containerId: nowId,
        hostName
      }
    })
  }

  handleClickDelete = () => {
    const { dispatch, hostName } = this.props;
    const { nowId } = this.state;
    dispatch({
      type: 'dockerList/handleDeleteDocker',
      payload: {
        containerId: nowId,
        hostName 
      }
    })
  }

  render() {
    const { dockerList, dockerName } = this.props;
    const { dockerData } = dockerList;
    
    let dataInfo = [];
    if(dockerName){
      dataInfo = [{dockerData,key:0,dockerName}]
    }
     
    const columns = [{
      dataIndex: 'dockerName',
      title: '镜像名称'
    },{
      dataIndex: 'dockerData',
      title: 'docker详情',
      width:'50%',
      render: (text)=>(<span>{JSON.stringify(text)}</span>)
    },{
      dataIndex: 'start',
      title: '启动未运行容器',
      render: ()=>(<a onClick={this.handleClickStart}>启动未运行容器</a>)
    },{
      dataIndex: 'pause',
      title: '暂停正在运行容器',
      render: ()=>(<a onClick={this.handleClickPause}>暂停正在运行容器</a>)
    },{
      dataIndex:'unpause',
      title: '运行暂停的容器',
      render: ()=>(<a onClick={this.handleClickUnpause}>运行暂停的容器</a>)
    },{
      dataIndex:'restart',
      title:'重启容器',
      render: ()=>(<a onClick={this.handleClickRestart}>重启容器</a>)
    },{
      dataIndex:'delete',
      title:'删除容器',
      render: ()=>(<a onClick={this.handleClickDelete}>删除容器</a>)
    }]

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
        <Table dataSource={dataInfo} columns={columns} />
    );
  }
}

const WrapDockerInfo = Form.create({})(DockerInfo);
export default WrapDockerInfo;
