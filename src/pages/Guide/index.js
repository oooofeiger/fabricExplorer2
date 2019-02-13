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
} from 'antd';
import WrapOrganization from './organization';
import WrapHostAdd from '../Host/hostManager/add';
import WrapCreateCA from '../FabricCA/CAManager/createCA';

import styles from './index.less';


const { TabPane } = Tabs;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Step = Steps.Step;

const host = window.hostIp;
@connect(({ network }) => {
  return {
    network
  };
})
class Guide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        current: 0,
        isRootCA: false,
        nowStamp: 0,
    };

  }

  componentDidMount() {
    const { dispatch } = this.props;

  }

  componentDidUpdate() {
    const { network } = this.props;

    
    
  }

  next = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  }



  render() {
    const { currentOrderer, tlsFileList, addSet, current, isRootCA } = this.state;
    const { network, loading, complete, nowStep, prev, next } = this.props;
    const { getFieldDecorator } = this.props.form;

    const steps = [{
        title: '配置组织',
        content: <WrapOrganization next={next} />,
      }, {
        title: '配置CA主机',
        content: <WrapHostAdd nowStep={nowStep} isInit={true} next={next}/>,
      }, {
        title: '配置CA服务',
        content: <WrapCreateCA complete={complete} isRootCA={isRootCA} />,
      }];

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
        <Steps current={nowStep}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className={styles.stepsContent}>{steps[nowStep].content}</div>
        <div className="steps-action">
          {
            nowStep > 0
            && (
            <Button style={{ marginLeft: 8 }} onClick={() => prev()}>
              上一步
            </Button>
            )
          }
        </div>
      </div>
    );
  }
}

const WrapGuide = Form.create({})(Guide);
export default WrapGuide;
