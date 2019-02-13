import React from 'react';
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
  Tooltip,
  message,
} from 'antd';
import LableToolTip from './labelToolTip';

const { TabPane } = Tabs;
const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const host = window.hostIp;

class ServerConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        nowServer: '',
    };

  }

  componentDidMount() {
    const { dispatch } = this.props;

    
  }

  componentDidUpdate(){
    const { dispatch } = this.props;
    const { nowServer } = this.state;

    
  }


  validateExpiry = (rule, value, callback) => {
    const isInteger = /^[0-9]+$/g.test(value);
    if(isInteger && value <= 65535){
        callback()
    }else{
        callback('输入的数据不合法！')
    }
  }

  validateIsJson = (rule, value, callback) => {
    try {
        JSON.parse(value);
        callback()
    } catch (error) {
        callback('josn数据不合法！')
    }
  }

  render() {
    const { getFieldDecorator, getConfigTpl, form, display, disabled } = this.props;
     


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
      <div style={{display:display ? 'block':'none'}}>
        <FormItem {...formItemLayout} hasFeedback={true} style={{display:'none'}} label="CA服务端口">
            {getFieldDecorator('server_port', {
                initialValue:getConfigTpl.port,
                rules: [
                    {
                        required: true,
                        message: '请输入CA服务端口！',
                    },
                    {
                        pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                        message: '输入的端口不正确！',
                    }
                ],
            })(<Input readOnly disabled={disabled} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="是否开启debug">
            {getFieldDecorator('debug', {
                initialValue:getConfigTpl.debug,
            })(
            <RadioGroup disabled={disabled} onChange={this.changeDebug}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
            </RadioGroup>)}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback={true} label="证书吊销列表大小">
            {getFieldDecorator('crlsizelimit', {
                initialValue: getConfigTpl.crlsizelimit,
                rules: [
                    {
                        pattern: /^[1-9][0-9]*$/g,message:"只能输入数字！"
                    }
                ],
            })(<Input disabled={disabled} />)}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback={true} label="ca名称">
            {getFieldDecorator('name', {
                initialValue: getConfigTpl.ca && getConfigTpl.ca.name,
                rules: [
                    {
                        pattern: /^[0-9a-zA-Z_]+$/g, message:"请输入数字、字母或下划线的组合"
                    }
                ],
            })(<Input disabled={disabled} placeholder="数字、字母、下选线的组合名称"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label={<LableToolTip name="下一次更行CRL时间" text="时间单位默认为小时，只能输入整数，不能超过65535" />}>
            {getFieldDecorator('expiry', {
                initialValue: getConfigTpl.crl && getConfigTpl.crl.expiry && getConfigTpl.crl.expiry.slice(0,getConfigTpl.crl.expiry.length-1),
                rules: [
                   
                    {
                        validator: this.validateExpiry
                    }
                ],
            })(<Input disabled={disabled} addonAfter="h" />)}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback={true} label="数据库类型">
            {getFieldDecorator('type', {
                initialValue: getConfigTpl.db && getConfigTpl.db.type,
                rules: [
                    
                ],
            })(
                <Select disabled={disabled}>   
                    <Option value="sqlite3">sqlite3</Option>
                    <Option value="mysql">mysql</Option>
                    <Option value="postgres">postgres</Option>
                </Select>
            )}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="数据库地址" text="数据库连接串goland版本。" />}>
            {getFieldDecorator('datasource', {
                initialValue: getConfigTpl.db && getConfigTpl.db.datasource,
                rules: [
                   
                ],
            })(<Input disabled={disabled} />)}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="组织联系" text={`输入json数据形如{"org1":["department1","department2"],"org2":["department1"]}`} />}>
            {getFieldDecorator('affiliations', {
                initialValue:JSON.stringify(getConfigTpl.affiliations?getConfigTpl.affiliations:{}),
                rules: [
                    {
                        validator: this.validateIsJson
                    }
                ],
            })(<TextArea disabled={disabled} placeholder="输入json数据" autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="hosts" text="输入IP或主机名称，两者都输入用英文','隔开" />}>
            {getFieldDecorator('hosts', {
                initialValue: getConfigTpl.csr && getConfigTpl.csr.hosts && getConfigTpl.csr.hosts.join(','),
                rules: []  
            })(<Input disabled={disabled} />)}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback={true} label="密钥生成算法">
            {getFieldDecorator('algo', {
                initialValue: getConfigTpl.csr && getConfigTpl.csr.keyrequest && getConfigTpl.csr.keyrequest.algo || 'ecdsa',
                rules: []  
            })(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback={true} label="密钥长度">
            {getFieldDecorator('size', {
                initialValue: getConfigTpl.csr &&  getConfigTpl.csr.keyrequest && getConfigTpl.csr.keyrequest.size,
                rules: []  
            })(<Select disabled={disabled}>
                <Option key={256}>256</Option>
                <Option key={384}>384</Option>
                <Option key={521}>521</Option>
            </Select>)}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback={true} label="国家">
            {getFieldDecorator('C', {
                initialValue: getConfigTpl.csr && getConfigTpl.csr.names && getConfigTpl.csr.names[0].C,
                rules: []  
            })(<Input disabled={disabled} />)}
        </FormItem>

        <FormItem {...formItemLayout} hasFeedback={true} label="洲">
            {getFieldDecorator('ST', {
                initialValue: getConfigTpl.csr && getConfigTpl.csr.names && getConfigTpl.csr.names[0].ST,
                rules: []  
            })(<Input disabled={disabled} />)}
        </FormItem>

        <FormItem {...formItemLayout} hasFeedback={true} label="地区或城市">
            {getFieldDecorator('L', {
                initialValue: getConfigTpl.csr && getConfigTpl.csr.names && getConfigTpl.csr.names[0].L,
                rules: []  
            })(<Input disabled={disabled} />)}
        </FormItem>

        <FormItem {...formItemLayout} hasFeedback={true} label="组织名称">
            {getFieldDecorator('O', {
                initialValue: getConfigTpl.csr && getConfigTpl.csr.names && getConfigTpl.csr.names[0].O,
                rules: []  
            })(<Input disabled={disabled} />)}
        </FormItem>

        <FormItem {...formItemLayout} hasFeedback={true} label="组织成员">
            {getFieldDecorator('OU', {
                initialValue: getConfigTpl.csr && getConfigTpl.csr.names && getConfigTpl.csr.names[0].OU,
                rules: []  
            })(<Input disabled={disabled} />)}
        </FormItem>

        <FormItem {...formItemLayout} label={<LableToolTip name="CA服务有效期" text="时间单位默认为小时，只能输入整数" />}>
            {getFieldDecorator('csr_expiry', {
                initialValue: getConfigTpl.csr && getConfigTpl.csr.ca && getConfigTpl.csr.ca.expiry && getConfigTpl.csr.ca.expiry.slice(0,getConfigTpl.csr.ca.expiry.length-1),
                rules: [{
                    pattern:/^[1-9][0-9]*$/g,message:"只能输入数字！"
                }]  
            })(<Input disabled={disabled} addonAfter="h"/>)}
        </FormItem>
        <FormItem {...formItemLayout} hasFeedback={true} label="下级CA深度">
            {getFieldDecorator('pathlength', {
                initialValue: getConfigTpl.csr && getConfigTpl.csr.ca && getConfigTpl.csr.ca.pathlength,
                rules: [
                    {
                        pattern: /^(-1|([0-9]+))$/g, message:"只能输入数字！"
                    }
                ]  
            })(<Input disabled={disabled} />)}
        </FormItem>
      </div>
    );
  }
}

const WrapServerConfig = ServerConfig;
export default WrapServerConfig;
