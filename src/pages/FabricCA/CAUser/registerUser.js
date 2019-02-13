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
    Select,
    message,
  } from 'antd';
import LableToolTip from '../labelToolTip';


  const FormItem = Form.Item;
  const Option = Select.Option;
  const { TextArea } = Input;

  @connect(({ CAUserManager }) => {
    return {
        CAUserManager
    };
  })
  class RegisterUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nowStamp: 0
        };
      }

    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type: 'CAUserManager/handleGetChildrenUser'
        })
    }

    confirmPassword = (rule, value, callback) => {
        const { form } = this.props;
        if( value && form.getFieldValue('secret') !== value){
            callback('两次密码输入不一致！')
        }else{
            callback()
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { form, dispatch } = this.props;
        form.validateFields((err, values)=>{
            if(!err){
                console.log(values)
                values.attributes = JSON.parse(values.attributes);
                dispatch({
                    type: 'CAUserManager/handleRegisterCAUser',
                    payload: {
                        registerInfo: values,
                        serverName: values.serverName,
                        userId: values.userId
                    }
                })
            }
        })
    }

    validateIsJson = (rule, value, callback) => { 
        try {
            JSON.parse(value);
            callback()
        } catch (error) {
            callback('josn数据不合法！')
        }
      }


    render(){
        const { userData, form, getCA, CAUserManager } = this.props;
        const { childrenUser } = CAUserManager;
        const { getFieldDecorator } = form;

        let userDataArr = [];
        userData && userData.map((item)=>{
            if(userDataArr.indexOf(item.id)<0){
                userDataArr.push(item.id)
            }
        })
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
                <FormItem {...formItemLayout} hasFeedback={true} label="选择CA服务">
                        {getFieldDecorator('serverName', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择CA服务！',
                                }
                            ],
                        })(<Select placeholder="请选择CA服务">
                            {
                                getCA && getCA.length>0 ? getCA.map((item)=>{
                                    return (<Option value={item.serverName} key={item.serverName}>{item.serverName}</Option>)
                                }) : ''
                            }
                    </Select>)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="CA用户ID">
                    {getFieldDecorator('userId', {
                        rules: [
                            {
                                required: true,
                                message: '请选择CA用户！',
                            }
                        ],
                    })(<Select placeholder="请选择CA用户">
                        {
                            userDataArr && userDataArr.length && userDataArr.map(ele=>{
                                return <Option key={ele} value={ele}>{ele}</Option>
                            })
                        }
                </Select>)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="用户ID">
                    {getFieldDecorator('identityId', {
                    rules: [
                        {
                            required: true,
                            message: '请输入用户ID！',
                        }
                    ],
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="ca用户所有者">
                    {getFieldDecorator('owner', {
                        initialValue: localStorage.getItem('userId'),
                    rules: [
                    ],
                    })(<Select>
                        {childrenUser && childrenUser.map(item=>{
                            return <Option key={item.userId} value={item.userId}>{item.userId}</Option>
                        })}
                    </Select>)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="密码">
                    {getFieldDecorator('secret', {
                    rules: [
                        {
                            required: true,
                            message: '请输入密码！',
                        }
                    ],
                    })(<Input type="password"/>)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="确认密码">
                    {getFieldDecorator('confirm', {
                    rules: [
                        {
                            required: true,
                            message: '请输入密码！',
                        },{
                            validator: this.confirmPassword
                        }
                    ],
                    })(<Input type="password"/>)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="所属关系">
                    {getFieldDecorator('affiliation', {
                    rules: [
                    ],
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="类型">
                    {getFieldDecorator('type', {
                        initialValue: 'peer',
                        rules: [
                        ],
                        })(<Select>
                            <Option key="peer" value="peer">peer</Option>
                            <Option key="orderer" value="orderer">orderer</Option>
                            <Option key="client" value="client">client</Option>
                            <Option key="user" value="user">user</Option>
                    </Select>)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="最大登记次数" text="只能输入-1或者正整数，-1表示无限制" />}>
                    {getFieldDecorator('maxEnrollments', {
                    rules: [
                        {
                            required: true,
                            message: '请输入最大登记次数！',
                        },
                        {
                            pattern: /^(-1|[1-9]+[0-9]*)$/g,message:'不符合输入规则！'
                        }
                    ],
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="用户属性" text="输入json数据。需要包含到证书中的属性，用户自定义" />}>
                    {getFieldDecorator('attributes', {
                    rules: [
                        {
                            required: true,
                            message: '请输入用户属性！',
                        },
                        {
                            validator: this.validateIsJson
                        }
                    ],
                    })(<TextArea placeholder="输入json数据" autosize={{ minRows: 2, maxRows: 6 }} />)}
                </FormItem>

                <FormItem wrapperCol={{ span: 8, offset: 8 }}>
                    <Button type="primary" block htmlType="submit">确定</Button>
                </FormItem>
            </Form>
        )
    }
  }
  const WrapRegisterUser = Form.create({})(RegisterUser);
  export default WrapRegisterUser;