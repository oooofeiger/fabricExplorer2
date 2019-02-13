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
import {downloadFile} from '@/utils/utils'


  const FormItem = Form.Item;
  const Option = Select.Option;
  const { TextArea } = Input;
  const RadioGroup = Radio.Group;

  const host = window.hostIp;

  @connect(({ CAUserManager }) => {
    return {
        CAUserManager
    };
  })
  class Enroll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
        this.downloadEle = React.createRef();
      }

    componentDidUpdate(){}

    handleSubmit = (e) => {
        e.preventDefault();
        const { form, dispatch, serverName, userId } = this.props;
        const downloadEle = this.downloadEle.current;
        if(serverName){
            form.validateFields((err, values)=>{
                if(!err){
                    if(values.download){
                        const params = {
                            ele: downloadEle,
                            fileName: `enroll_${userId}_${serverName}.zip`,
                            url: `http://${host}/ca/user/enroll/${serverName}/${userId}`,
                            type: 'post',
                            params: {download:values.download},
                            headers: {'Content-Type':'application/json'}
                        }
                        downloadFile(params);
                    }else{
                        dispatch({
                            type: 'CAUserManager/handleEnrollCAUser',
                            payload: {
                                download: values.download,
                                serverName,
                                userId
                            }
                        })
                    }
                    
                }
            })
        }else{
            message.error('请先选择CA服务！')
        }
    }


    render(){
        const { userData, form, userId } = this.props;
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
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="用户ID">
                    {getFieldDecorator('userId', {
                    initialValue: userId,
                    })(<Input readOnly />)}
                </FormItem>
                <FormItem {...formItemLayout} label="是否下载证书">
                    {getFieldDecorator('download', {
                        initialValue:false,
                    })(<RadioGroup>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </RadioGroup>)}
                </FormItem>
                
                {/* <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="用户属性" text="输入json数据。需要包含到证书中的属性，用户自定义" />}>
                    {getFieldDecorator('enrollInfo', {
                    rules: [
                        {
                            required: true,
                            message: '请输入用户属性！',
                        }
                    ],
                    })(<TextArea placeholder="输入json数据" autosize={{ minRows: 2, maxRows: 6 }} />)}
                </FormItem> */}

                <FormItem wrapperCol={{ span: 8, offset: 8 }}>
                    <Button type="primary" block htmlType="submit">确定</Button>
                </FormItem>
                <div ref={this.downloadEle}></div>
            </Form>
        )
    }
  }
  const WrapEnroll = Form.create({})(Enroll);
  export default WrapEnroll;