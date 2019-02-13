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
  Steps,
  Input,
  Upload
} from 'antd';

import styles from './index.less';


const { TabPane } = Tabs;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Step = Steps.Step;

const host = window.hostIp;
@connect(({ global }) => {
  return {
    global
  };
})
class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        certFileList: [],
        keyFileList: [],
        clientFileList: [],
        tlsEnable: true,
        nowStamp: ''
    };

  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  componentDidUpdate() {
      const { next, global } = this.props;
      const { setORganiztion } = global;
      const { nowStamp } = this.state;
      if(setORganiztion && setORganiztion.stamp !== nowStamp){
        if(setORganiztion.success){
            next && next();
        }
        
        this.setState({
            nowStamp: setORganiztion.stamp
        })
      }

  }

  changeTlsEnable = (e) => {
      const value = e.target.value;
      this.setState({
          tlsEnable: value
      })
  }

  certChange = (info) => {
    console.log(info);
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    this.setState({
        certFileList: fileList
    })
  }

  keyChange = (info) => {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    this.setState({
        keyFileList: fileList
    })
  }

  clientChange = (info) => {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    this.setState({
        clientFileList: fileList
    })
  }

  beforeUpload = (file) => {
    return false;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
        form.validateFields((err, values)=>{
            if(!err){
                let formData = new FormData();
                Object.keys(values).forEach(key=>{
                    if(values[key]!==undefined){
                        formData.append(key, values[key] && values[key].file ? values[key].file : values[key])
                    }
                    
                })
                dispatch({
                    type: 'global/handleSetOrganiztion',
                    payload: formData
                })
            }
        })

    }

  render() {
    const { currentOrderer, tlsFileList, addSet } = this.state;
    const { network, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { certFileList, keyFileList, clientFileList, tlsEnable} = this.state;

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
        <Form encType="multipart/form-data" onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} hasFeedback={true} label="组织名称">
            {getFieldDecorator('orgName', {
                rules: [{
                    required: true,
                    message: '请输入组织名称！'
                },{
                    pattern: /^[0-9a-zA-Z]{1,64}$/g,
                    message: '请输入不超过16位的数字、字母、下划线的组合!',
                  }]
                })(<Input placeholder="请输入不超过16位的数字、字母、下划线的组合" />)}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback={true} label="组织MSPID">
            {getFieldDecorator('orgMspId', {
                rules: [{
                    required: true,
                    message: '请输入组织MSPID！'
                }]
                })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="组织类型">
            {getFieldDecorator('orgType', {
                initialValue:'ordererOrg' ,
                rules: []
                })(<RadioGroup>
                    <Radio value="ordererOrg">ordererOrg</Radio>
                    <Radio value="peerOrg">peerOrg</Radio>
                </RadioGroup>)}
        </FormItem>
        <FormItem {...formItemLayout} label="是否使用tls">
            {getFieldDecorator('tlsEnable', {
                initialValue:true ,
                rules: []
                })(<RadioGroup onChange={this.changeTlsEnable}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                </RadioGroup>)}
        </FormItem>
        <div style={{display: tlsEnable?'block':'none'}}>
        <FormItem {...formItemLayout} label="tls客户端证书">
            {getFieldDecorator('tlsCert', {
              rules: [{
                required: tlsEnable,
                message: '请上传tls客户端证书！'
              }]
            })(
              <Upload 
                name="tlsCert"
                fileList={certFileList}
                onChange={this.certChange}
                beforeUpload={this.beforeUpload}
              >
                <Button>
                  <Icon type="upload" /> 上传tls客户端证书
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="tls客户端私钥">
            {getFieldDecorator('tlsKey', {
              rules: [{
                required: tlsEnable,
                message: '请上传tls客户端私钥！'
              }]
            })(
              <Upload 
                name="tlsKey"
                fileList={keyFileList}
                onChange={this.keyChange}
                beforeUpload={this.beforeUpload}
              >
                <Button>
                  <Icon type="upload" /> 上传tls客户端私钥
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="tls CA根证书">
            {getFieldDecorator('tlsCA', {
              rules: [{
                required: tlsEnable,
                message: '请上传tls CA根证书！'
              }]
            })(
              <Upload 
                name="tlsCA"
                fileList={clientFileList}
                onChange={this.clientChange}
                beforeUpload={this.beforeUpload}
              >
                <Button>
                  <Icon type="upload" /> 上传tls CA根证书
                </Button>
              </Upload>
            )}
          </FormItem>
          </div>
        
        <FormItem wrapperCol={{ span: 8, offset: 8 }}>
            <Button type="primary" block htmlType="submit">确定</Button>
        </FormItem>
    </Form>
    );
  }
}

const WrapOrganization = Form.create({})(Organization);
export default WrapOrganization;
