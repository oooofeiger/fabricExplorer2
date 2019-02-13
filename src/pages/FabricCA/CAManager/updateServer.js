import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Tabs,
  Switch,
  Radio,
  Button,
  Form,
  Input,
  Select,
  Tooltip,
  message,
} from 'antd';
import ServerConfig from '../serverConfig';

const { TabPane } = Tabs;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const host = window.hostIp;
@connect(({ CAManager, loading }) => {
  return {
    CAManager,
    loading: loading.effects['CAManager/handleGetConfigCA'],
  };
})
class UpdateServer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        nowServer: '',
        couildEdit: true
    };

  }

  componentDidMount() {
    const { dispatch, serverName } = this.props;
    if(serverName){
        dispatch({
            type: 'CAManager/handleGetConfigCA',
            payload: {serverName}
        })
        this.setState({
            nowServer: serverName
        })
    }
    
    
  }

  componentDidUpdate(){
    const { dispatch, serverName } = this.props;
    const { nowServer } = this.state;
    if(serverName && serverName !== nowServer){
        dispatch({
            type: 'CAManager/handleGetConfigCA',
            payload: {serverName}
        })
        this.setState({
            nowServer: serverName
        })
    }
    
  }

  changeSwitch = (e) => {
      this.setState({
          couildEdit: !e
      })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch, serverName } = this.props;
    if(serverName){
        form.validateFields((err, values)=>{
            if(!err){
                const { type, hosts, C, L, O, OU, ST, affiliations, algo, cn, crlsizelimit, csr_expiry, debug, pathlength, size, datasource, expiry, name} = values;
                let CAdata = {};
                CAdata.serverConfig = {};
                CAdata.serverConfig.debug = debug;
                CAdata.serverConfig.crlsizelimit = crlsizelimit;
                CAdata.serverConfig.ca = {};
                CAdata.serverConfig.ca.name = name;
                CAdata.serverConfig.crl = {};
                CAdata.serverConfig.crl.expiry = expiry+'h';
                CAdata.serverConfig.db = {};
                CAdata.serverConfig.db.type = type;
                CAdata.serverConfig.db.datasource = datasource;
                CAdata.serverConfig.affiliations = affiliations?JSON.parse(affiliations):{};
                CAdata.serverConfig.csr = {};
                CAdata.serverConfig.csr.cn = cn;
                CAdata.serverConfig.csr.keyrequest = {};
                CAdata.serverConfig.csr.keyrequest.algo = algo;
                CAdata.serverConfig.csr.keyrequest.size = size;
                CAdata.serverConfig.csr.names = [{C,L,O,OU,ST}];
                CAdata.serverConfig.csr.hosts = hosts?hosts.split(','):[];
                CAdata.serverConfig.csr.ca = {};
                CAdata.serverConfig.csr.ca.expiry = csr_expiry+'h';
                CAdata.serverConfig.csr.ca.pathlength = pathlength;

                dispatch({
                    type: 'CAManager/handleSetConfigCA',
                    payload: {...CAdata.serverConfig, serverName}
                })
            }
        })
    }else{
        message.error('请先选择CA服务！')
    }
}



  render() {
    const { CAManager, serverName, form } = this.props;
    const { getConfigCA } = CAManager;
    const { getFieldDecorator } = form;
    const { couildEdit } = this.state;

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
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="编辑" >
            {getFieldDecorator('switch', { valuePropName: 'checked',initialValue: false })(
                <Switch onChange={this.changeSwitch}/>
            )}
        </FormItem>
        {getConfigCA?<ServerConfig getFieldDecorator={getFieldDecorator} disabled={couildEdit} display={true} getConfigTpl={getConfigCA}  />:''}
        <FormItem wrapperCol={{ span: 8, offset: 8 }}>
            <Button disabled={couildEdit} type="primary" block htmlType="submit">确定</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrapUpdateServer = Form.create({})(UpdateServer);
export default WrapUpdateServer;
