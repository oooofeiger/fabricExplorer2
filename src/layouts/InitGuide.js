import React, { Suspense } from 'react';
import { Modal } from 'antd';
import WrapGuide from '../pages/Guide/index';
import { connect } from 'dva';
import router from 'umi/router';


@connect(({global, host, CAManager})=>({
    global,
    host,
    CAManager
}))
export default class InitGuide extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            caStamp: 0,
            hostStamp: 0,
            orgStamp: 0,
            isRootCA: false,
            visible: false,
            current: 0,
          }
    }

    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type: 'global/handleGetOrganiztion'
          })
          dispatch({
              type: 'host/getHostHandle'
          });
          dispatch({
              type: 'CAManager/handleGetCA'
          })
    }

    componentDidUpdate(){
        const { CAManager, dispatch, global, host } = this.props;
        const { getCA } = CAManager;
        const { getOrganiztion } = global;
        const { hostData } = host;
        const { caStamp, orgStamp, hostStamp } = this.state;

        if(getOrganiztion && getOrganiztion.stamp !== orgStamp){  // 判断是否配置了组织
          if(getOrganiztion.data === null){
              this.setState({
                  orgStamp: getOrganiztion.stamp,
                  visible: true,
                  current: 0,
              })
          }
          else if(hostData && hostData.stamp !== hostStamp && hostData.length === 0){
              
                  this.setState({
                      visible: true,
                      current: 1,
                      hostStamp: hostData.stamp
                  })
              
          }else if(getCA && getCA.stamp !== caStamp && getCA.length===0){   //判断是否是跟ca
              
                  this.setState({
                      isRootCA: true,
                      visible: true,
                      current: 2,
                      caStamp: getCA.stamp
                  })
          }else{
              this.setState({
                  isRootCA: false,
                  // visible: false,
                  orgStamp: getOrganiztion.stamp,
              })
          }
        }else if(getOrganiztion && getOrganiztion.data && hostData && hostData.stamp !== hostStamp){
            if(hostData.length === 0){
                this.setState({
                    visible: true,
                    current: 1,
                    hostStamp: hostData.stamp
                })
            }
            else if(getCA && getCA.stamp !== caStamp && getCA.length===0){   //判断是否是跟ca
                this.setState({
                    isRootCA: true,
                    visible: true,
                    current: 2,
                    caStamp: getCA.stamp
                })
            }else{
                this.setState({
                    isRootCA: false,
                    // visible: false,
                    hostStamp: hostData.stamp
                })
            }
        }else if(getOrganiztion && getOrganiztion.data && hostData && hostData.length && getCA && getCA.stamp !== caStamp){   //判断是否是跟ca
            if(getCA.length===0){
                this.setState({
                    isRootCA: true,
                    visible: true,
                    current: 2,
                    caStamp: getCA.stamp,
                })
            }else{
                
                this.setState({
                  caStamp: getCA.stamp,
                    isRootCA: false,
                    // visible: false
                })
            }
        }
    }


    complete = () => {
        const { location } = this.props;
        window.location.reload(location.pathname)
    }
    
    next = () => {
        let { current } = this.state;
        current++;
        this.setState({ current });
    }
    
    prev = () => {
        let { current } = this.state;
        current--;
        this.setState({ current });
    }

    render(){
        const { current, visible} = this.state;
        return <div>
            <Modal
                title={"初始化环境配置"}
                visible={visible}
                // visible={true}
                width='60%'
                footer={null}
                closable={false}
            >
                <WrapGuide complete={this.complete} prev={this.prev} next={this.next} nowStep={current} />
            </Modal>
        </div>
    }

}