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

@connect(({ host, loading }) => {
  return {
    host
  };
})
class HostAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caFileList: [],
      certFileList: [],
      keyFileList: [],
      addStamp: 0, 
      tls: true,
    };

    this.caChange = this.caChange.bind(this);
    this.certChange = this.certChange.bind(this);
    this.keyChange = this.keyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
  }

  componentDidMount() {
    const { nowStep, dispatch } = this.props;
    dispatch({
      type: 'host/getHostHandle'
    });
  }


  componentDidUpdate(prevProps, prevState) {
    const { host, updateList, next } = this.props;
    const { addHostRes, hostData } = host;
    const { addStamp } = this.state;
    if(addHostRes){
      let { stamp } = addHostRes;
      if(stamp && stamp !== addStamp){
        updateList && updateList();
        if(addHostRes.meta.success){
          next && next();
        }
        
        this.setState({
          addStamp: stamp
        })
      }
    }

    // if(hostData && hostData.stamp !== hostStamp){
    //   if(hostData.length === 0){
    //       this.setState({
    //           visible: true,
    //           current: 1,
    //           hostStamp: hostData.stamp
    //       })
    //   }else{
    //       this.setState({
    //           current: 2,
    //           hostStamp: hostData.stamp
    //       })
    //   }
    // }
  }

  changeTls = (e) => {
    this.setState({
      tls: e.target.value
    })
  }

  caChange = (info) => {
    console.log(info);
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    this.setState({
      caFileList: fileList
    })
  }

  certChange = (info) => {
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

  beforeUpload = (file) => {
    return false;
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values)=>{
      if(!err){
        console.log(values)
        let formData = new FormData();
        console.log(formData)
        Object.keys(values).forEach((key)=>{
          if(values[key] !== undefined){
            formData.append(key, values[key].file ? values[key].file : values[key]);
          }
          
        })
        
        dispatch({
          type: 'host/addHostHandle',
          payload: {
            formData
          }
        })
      }
    })
  }

  render() {
    const { form, isInit, host } = this.props;
    const { hostData } = host;
    const { caFileList, certFileList, keyFileList, tls} = this.state;
    const { getFieldDecorator } = form;

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
          <FormItem {...formItemLayout} hasFeedback={true} label="宿主机名称">
            {getFieldDecorator('hostName', {
              initialValue: isInit && hostData && hostData[0]?hostData[0].hostName:'',
              rules: [
                {
                  required: true,
                  message: '请输入主机名称！',
                },
                {
                  pattern: /^[0-9a-zA-Z_]+$/,message:'只能输入数字者字母或下划线组成的名称'
                }
              ],
            })(<Input placeholder="默认同ip"/>)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback={true} label="宿主机ip">
            {getFieldDecorator('ip', {
              initialValue: isInit && hostData && hostData[0]?hostData[0].ip:'',
              rules: [
                {
                  required: true,
                  message: 'ip不能为空！',
                },
                {
                  pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                  message: '输入的ip不正确！',
                }
              ],
            })(<Input placeholder="请输入ip"/>)}
          </FormItem>

          <FormItem {...formItemLayout} hasFeedback={true} label="docker端口">
            {getFieldDecorator('port', {
              initialValue: isInit && hostData && hostData[0]?hostData[0].port:'2375',
              rules: [
                {
                  required: true,
                  message: '端口不能为空！',
                },
                {
                  pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                  message: '输入的端口不正确！',
                },
              ],
            })(<Input placeholder="请输入服务端口" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="是否使用tls">
            {getFieldDecorator('tlsEnable', {
              initialValue: isInit && hostData && hostData[0]?hostData[0].tlsEnable:true,
            })(
              <RadioGroup onChange={this.changeTls}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="protocol">
            {getFieldDecorator('protocol', {
              initialValue: isInit && hostData && hostData[0]?hostData[0].protocol:'tcp',
            })(
              <RadioGroup onChange={this.changeTls}>
                <Radio value={'tcp'}>tcp</Radio>
                <Radio value={'udp'}>udp</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <div style={{display:tls?'block':'none'}}>
          <FormItem {...formItemLayout} label="CA证书">
            {getFieldDecorator('ca', {
              rules: [{
                required: tls,
                message: '请上传ca证书！'
              }]
            })(
              <Upload 
                name="ca"
                fileList={caFileList}
                onChange={this.caChange}
                beforeUpload={this.beforeUpload}
              >
                <Button>
                  <Icon type="upload" /> 上传CA证书
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="客户端证书">
            {getFieldDecorator('cert', {
              rules: [{
                required: tls,
                message: '请上传客户端证书！'
              }]
            })(
              <Upload 
                name="cert"
                fileList={certFileList}
                onChange={this.certChange}
                beforeUpload={this.beforeUpload}
              >
                <Button>
                  <Icon type="upload" /> 上传客户端证书
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="客户端私钥">
            {getFieldDecorator('key', {
              rules: [{
                required: tls,
                message: '请上传客户端私钥！'
              }]
            })(
              <Upload 
                name="key"
                fileList={keyFileList}
                onChange={this.keyChange}
                beforeUpload={this.beforeUpload}
              >
                <Button>
                  <Icon type="upload" /> 上传客户端私钥
                </Button>
              </Upload>
            )}
          </FormItem>
          </div>

          <FormItem wrapperCol={{ span: 8, offset: 8 }}>
            <Button type="primary" block htmlType="submit">
              确定
            </Button>
          </FormItem>
        </Form>
    );
  }
}

const WrapHostAdd = Form.create({})(HostAdd);
export default WrapHostAdd;
