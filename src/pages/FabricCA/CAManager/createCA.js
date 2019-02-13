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
  Tooltip,
  message,
  Card,
  Upload,
} from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import TabPaneCon from '@/components/TabPaneCon';
import LableToolTip from '../labelToolTip';
import ServerConfig from '../serverConfig';
import styles from '../style.less';

import org from '@/assets/组织.png';

const { TabPane } = Tabs;
const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const host = window.hostIp;
@connect(({ CAManager, loading }) => {
  return {
    CAManager,
    loading: loading.effects['CAManager/handleGetOneCA'],
  };
})
class CreateCA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        parentDisabled: true,
        serverPort: 7054,
        moreSetting: false,  //打开更多设置
        nowStamp: 0,
        createId: '',
        certFileList: [],
        keyFileList: [],
        addStamp:0,
        uploadCert: false, //是否上传CA证书,
        getCAStamp: 0,
        serverStamp: 0,
    };

  }

  componentDidMount() {
    const { dispatch, serverName } = this.props;
    dispatch({
        type: 'CAManager/handleGetConfigTpl'
    })
    dispatch({
        type: 'CAManager/getHostHandle'
    })
    dispatch({
        type: 'CAManager/handleGetCA'
    })
  }

  componentDidUpdate(){
    const { form, CAManager, updateTable, complete } = this.props;
    const { addCA, getCA, createServer } = CAManager;
    const { nowStamp, addStamp, serverStamp } = this.state;
    if(getCA && getCA.stamp !== nowStamp){   //判断是否是跟ca
        if(getCA.length===0){
            this.setState({
                isRootCA: true,
            })
        }else{
            let flag = false;
            getCA.map((item)=>{
                if(item.type === 'root'){
                    flag = true
                }
            })
            if(flag){
                this.setState({
                    isRootCA: false,
                })
            }else{
                this.setState({
                    isRootCA: true,
                })
            }
        }
        this.setState({
            nowStamp: getCA.stamp,
            
        })
    }
    

    if(addCA && addCA.addStamp !== addStamp){
        const uploadCert = form.getFieldValue('uploadCert');
        if(addCA.meta.success){
            if(!uploadCert){
                complete && complete();
                form.resetFields();
                updateTable && updateTable();
                
            }else{
                this.setState({
                    createId: addCA.data.createId
                })
            }
            
        }
        this.setState({
            addStamp: addCA.addStamp,
        })
    }

    if(createServer && createServer.stamp !== serverStamp){
        if(createServer.success){
            complete && complete();
            form.resetFields();
            updateTable && updateTable();
        }
        this.setState({
            serverStamp: createServer.stamp,
        })
    }
    
  }

  handleBlurServerName = (e) => {
      const value = e.target.value;
      this.setState({
          serverName: value
      })
  }

  handleBlurServerPort = (e) => {
    const value = e.target.value;
    this.setState({
        serverPort: value
    })
}

  changeServerType = (e) => {
      const value = e.target.value;
      const { form } = this.props;
      if(value === 'root'){
        form.resetFields(['parentServerName','parentUserId']);
        this.setState({
            parentDisabled: true
        })
      }else{
          this.setState({
              parentDisabled: false
          })
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

  handleClickMoreSetting = () => {
    const { moreSetting } = this.state;
    this.setState({
        moreSetting: !moreSetting
    })
  }

  changeUploadCert = (e) => {
    const value = e.target.value;
    this.setState({
        uploadCert: value
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

  handleGetCreateId = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values)=>{
        if(!err){
            console.log(values);
            const { hostName, serverName, serverPort, adminPassword, adminUser, cmd, containerName, env, exposedPorts, image, networkMode, parentServerName, type, hosts,
                parentUserId, serverType, tag, volumes, workingDir, C, L, O, OU, ST, affiliations, algo, cn, crlsizelimit, csr_expiry, debug, pathlength, server_port, size,
                datasource, expiry, name, uploadCert
            } = values;
            let CAdata = {};
            CAdata.hostName = hostName;
            CAdata.serverName = serverName;
            CAdata.serverPort = serverPort;
            CAdata.adminUser = adminUser;
            CAdata.adminPassword = adminPassword;
            CAdata.serverType = serverType;
            CAdata.parentServerName = parentServerName;
            CAdata.parentUserId = parentUserId;
            CAdata.uploadCert = uploadCert;

            CAdata.containerConfig = {};
            CAdata.containerConfig.image = image;
            CAdata.containerConfig.tag = tag;
            CAdata.containerConfig.workingDir = workingDir;
            CAdata.containerConfig.containerName = containerName;
            CAdata.containerConfig.env = env?JSON.parse(env):{};
            CAdata.containerConfig.cmd = cmd;
            CAdata.containerConfig.exposedPorts =exposedPorts?JSON.parse(exposedPorts):{};
            CAdata.containerConfig.networkMode = networkMode;
            CAdata.containerConfig.volumes = volumes?JSON.parse(volumes):{};

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
            CAdata.serverConfig.csr.keyRequest = {};
            CAdata.serverConfig.csr.keyRequest.algo = algo;
            CAdata.serverConfig.csr.keyRequest.size = size;
            CAdata.serverConfig.csr.names = [{C,L,O,OU,ST}];
            CAdata.serverConfig.csr.hosts = hosts?hosts.split(','):[];
            CAdata.serverConfig.csr.ca = {};
            CAdata.serverConfig.csr.ca.expiry = csr_expiry+'h';
            CAdata.serverConfig.csr.ca.pathlength = pathlength;

            console.log(CAdata);

            dispatch({
                type: 'CAManager/handleAddCA',
                payload: CAdata
            })
        }
    })
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { createId, uploadCert } = this.state;
    if(uploadCert){
        createId && form.validateFields(['cert','key'],(err,values)=>{
            if (!err) {
                let formData = new FormData();
                formData.append('cert', values['cert'].file);
                formData.append('key', values['key'].file);
                dispatch({
                  type: 'CAManager/handleCreateServer',
                  payload: {data: formData,createId}
                });
              }
        })
    }else{
        this.handleGetCreateId()
    }
    
  }



  render() {
    const { CAManager, form, global } = this.props;
    const { getFieldDecorator } = form;
    const { getConfigTpl, hostData } = CAManager;
    const { parentDisabled, serverName, serverPort, moreSetting, createId, keyFileList, certFileList, uploadCert, isRootCA } = this.state;

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
        <div>
            <Form onSubmit={this.handleSubmit} className={styles.createCAForm}>
                {/* CA基础配置 */}
                <FormItem {...formItemLayout} style={{marginBottom:10}} className={styles.createCALabel} label="CA基础配置"></FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="宿主机名称">
                    {getFieldDecorator('hostName', {
                        rules: [
                            {
                                required: true,
                                message: '请输入主机名称！',
                            }
                        ],
                    })(<Select placeholder="请选择主机">
                        {
                            hostData ? hostData.map((ele)=>{
                                return <Option key={ele.hostName} value={ele.hostName}>{ele.hostName}</Option>
                            }):''
                        }
                    </Select>)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="CA服务名称">
                    {getFieldDecorator('serverName', {
                        rules: [
                            {
                                required: true,
                                message: '请输入CA服务名称！',
                            },
                            {
                                pattern: /^[0-9a-zA-Z_]{1,16}$/g, message:"请输入数字、字母或下划线的组合且不超过16位"
                            }
                        ],
                    })(<Input placeholder="请输入数字、字母或下划线的组合且不超过16位"  onBlur={this.handleBlurServerName} />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="CA服务端口">
                    {getFieldDecorator('serverPort', {
                        initialValue:7054,
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
                    })(<Input onBlur={this.handleBlurServerPort} />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="初始管理员用户名">
                    {getFieldDecorator('adminUser', {
                        rules: [
                            {
                                required: true,
                                message: '请输入初始管理员用户名！',
                            },
                            {
                                pattern: /^[0-9a-zA-Z_]{1,16}$/g, message:"请输入数字、字母或下划线的组合且不超过16位"
                            }
                        ],
                    })(<Input/>)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="初始管理员密码">
                    {getFieldDecorator('adminPassword', {
                        rules: [
                            {
                                required: true,
                                message: '请输入初始管理员密码！',
                            }
                        ],
                    })(<Input type="password"/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="CA类型">
                    {getFieldDecorator('serverType', {
                        initialValue: isRootCA?'root':'intermediate',
                    })(
                    <RadioGroup disabled>
                        <Radio value={'root'}>root</Radio>
                        <Radio value={'intermediate'}>intermediate</Radio>
                    </RadioGroup>)}
                </FormItem>
                <div style={{display:isRootCA?'none':'block'}}>
                <FormItem {...formItemLayout} hasFeedback={true} label="父CA服务名称">
                    {getFieldDecorator('parentServerName', {
                        rules: [
                            {
                                required: !isRootCA,  //!parentDisabled
                                message: '请输入父CA服务名称！',
                            },
                            {
                                pattern: /^[0-9a-zA-Z_]+$/g, message:"请输入数字、字母或下划线的组合"
                            }
                        ],
                    })(<Input/>)} {/*parentDisabled*/}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="父CA用户" text="父CA中用户注册中间CA的用户" />}>
                    {getFieldDecorator('parentUserId', {
                        rules: [
                            {
                                required: !isRootCA,  //!parentDisabled
                                message: '请输入父CA用户！',
                            }
                        ],
                    })(<Input />)} {/*parentDisabled*/}
                </FormItem>
                </div>


                {/* CA容器配置 */}
                <FormItem {...formItemLayout} style={{marginBottom:10}} className={styles.createCALabel} label="CA容器配置"></FormItem>
                
                <FormItem {...formItemLayout} hasFeedback={true} label="镜像名称">
                    {getFieldDecorator('image', {
                        initialValue: 'hyperledger/fabric-ca',
                        rules: [
                            {
                                required: true,
                                message: '请输入镜像名称！',
                            }
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="镜像版本">
                    {getFieldDecorator('tag', {
                        initialValue: 'latest',
                        rules: [
                            {
                                required: true,
                                message: '请输入镜像版本！',
                            }
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="CA工作目录">
                    {getFieldDecorator('workingDir', {
                        initialValue: '/ect/hyperledger/fabric-ca-server',
                        rules: [
                            {
                                required: true,
                                message: '请输入工作目录！',
                            }
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label="容器名称">
                    {getFieldDecorator('containerName', {
                        initialValue: serverName,
                        rules: [
                            {
                                required: true,
                                message: '请输入容器名称！',
                            }
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="环境变量" text="输入json数据，FABRIC_CA_HOME环境变量不可缺失" />}>
                    {getFieldDecorator('env', {
                        initialValue: '{"FABRIC_CA_HOME":"/ect/hyperledger/fabric-ca-server"}',
                        rules: [
                            {
                                required: true,
                                message: '请输入环境变量！',
                            },
                            {
                                validator: this.validateIsJson
                            }
                        ],
                    })(<TextArea placeholder="输入json数据" autosize={{ minRows: 2, maxRows: 6 }} />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="容器启动命令" text="默认是fabric-ca-server start -p {serverPort} -H {serverName}，括号内为CA服务端口和CA服务名" />}>
                    {getFieldDecorator('cmd', {
                        initialValue: `fabric-ca-server start -p ${serverPort?serverPort:'{serverPort}'}`,
                        rules: [
                            {
                                required: true,
                                message: '请输入容器启动命令！',
                            }
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="容器对外映射端口" text="输入json数据，key为容器内部端口号，Value为映射出来的端口号。必须指定上面设定的CA服务端口号为映射出来的端口号" />}>
                    {getFieldDecorator('exposedPorts', {
                        rules: [
                            {
                                required: true,
                                message: '请输入容器对外映射端口！',
                            },
                            {
                                validator: this.validateIsJson
                            }
                        ],
                    })(<TextArea placeholder="输入json数据" autosize={{ minRows: 2, maxRows: 6 }} />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="docker网络" text="容器连接的docker网络" />}>
                    {getFieldDecorator('networkMode', {
                        rules: [
                            {
                                required: true,
                                message: '请输入容器对外映射端口！',
                            }
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} hasFeedback={true} label={<LableToolTip name="容器挂载的数据卷" text="输入json数据，容器挂载的本地目录或数据卷，key为本地路径或数据卷名，value为容器内部路径。如果输入了不存在的数据卷则会自动创建" />}>
                    {getFieldDecorator('volumes', {
                        initialValue: null,
                        rules: [
                            {
                                validator: this.validateIsJson
                            }
                        ],
                    })(<TextArea placeholder="输入json数据" autosize={{ minRows: 2, maxRows: 6 }} />)}
                </FormItem>


                <div style={{textAlign:'center',marginBottom:20}}>
                    <a onClick={this.handleClickMoreSetting}><Icon type={moreSetting?"minus-square":"plus-square"} /> 更多设置</a>
                </div>
                
                {/* CA服务配置 */}
                <FormItem {...formItemLayout} style={{marginBottom:10, display:moreSetting?'block':'none'}} className={styles.createCALabel} label="CA服务配置"></FormItem>

                {getConfigTpl?<ServerConfig getFieldDecorator={getFieldDecorator} disabled={false} display={moreSetting} getConfigTpl={getConfigTpl}/>:<div style={{textAlign:'center'}}>正在加载...</div>}

                {/* 如果是创建根ca */}
                <div style={{display:isRootCA?'block':'none'}}>
                <FormItem {...formItemLayout} label="是否上传CA证书">
                    {getFieldDecorator('uploadCert', {
                        initialValue:uploadCert,
                    })(
                    <RadioGroup onChange={this.changeUploadCert}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </RadioGroup>)}
                </FormItem>
                <div style={{display:uploadCert?'block':'none'}}>
                <FormItem
                    {...formItemLayout}
                    label="获取上传ID"
                >
                <Row gutter={8}>
                    <Col span={12}>
                        {getFieldDecorator('createId', {
                            initialValue: createId,
                        })(
                            <Input readOnly onChange={this.changeCreateId} />
                        )}
                    </Col>
                    <Col span={12}>
                        <Button onClick={this.handleGetCreateId} type='primary'>获取</Button>
                    </Col>
                </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="上传CA证书">
                    {getFieldDecorator('cert', {
                    rules: [{
                        required: createId===''?false:true,
                        message: '上传CA证书'
                    }]
                    })(
                    <Upload 
                        name="cert"
                        fileList={certFileList}
                        onChange={this.certChange}
                        beforeUpload={this.beforeUpload}
                        disabled={!createId}
                    >
                        <Button>
                        <Icon type="upload" /> 上传CA证书
                        </Button>
                    </Upload>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="上传CA证书私钥">
                    {getFieldDecorator('key', {
                    rules: [{
                        required: createId===''?false:true,
                        message: '上传CA证书私钥'
                    }]
                    })(
                    <Upload 
                        name="key"
                        fileList={keyFileList}
                        onChange={this.keyChange}
                        beforeUpload={this.beforeUpload}
                        disabled={!createId}
                    >
                        <Button>
                        <Icon type="upload" /> 上传CA证书私钥
                        </Button>
                    </Upload>
                    )}
                </FormItem>
                </div>
                </div>
                <FormItem wrapperCol={{ span: 8, offset: 8 }}>
                    <Button type="primary" block htmlType="submit">确定</Button>
                </FormItem>
            </Form>
        </div>
      
    );
  }
}

const WrapCreateCA = Form.create({})(CreateCA);
export default WrapCreateCA;
