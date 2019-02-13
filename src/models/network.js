import {
    getConfigPeer,//
    getConfigOrderer,//
    managePeer,//
    manageOrderer,//
    ordererDelete,//
    peerDelete,//
    generatePeerCert,
    peerDeploy,//
    ordererDeploy,//
    peerOrgGet, //获取配置信息
    createOrderer,//,
    getCA
  } from '@/services/api';
  
  export default {
    namespace: 'network',
    state: {
      loading: false,
    },
    effects: {
      *getConfigPeer(_, { call, put }) {
        const response = yield call(getConfigPeer);
        try {
          const { data } = response;
          yield put({
            type: 'save',
            payload: {
              peerConfig: data,
            },
          });
        } catch (error) {
          console.log(error)
        }
        
      },
      *getConfigOrderer(_, { call, put }) {
        const response = yield call(getConfigOrderer);
        try {
          const { data } = response
          yield put({
            type: 'save',
            payload: {
              ordererConfig: data,
            },
          });
        } catch (error) {
          console.log(error)
        }
        
      },
      *handleManagePeer({ payload }, { call, put }) {
        const response = yield call(managePeer, payload);
        try {
          const { meta } = response;
          yield put({
            type: 'save',
            payload: {
              managePeer: meta,
            },
          });
        } catch (error) {
          console.log(error)
        }
        
      },
      *handleManageOrderer({ payload }, { call, put }) {
        const response = yield call(manageOrderer, payload);
        try {
          const { meta } = response;
          yield put({
            type: 'save',
            payload: {
              manageOrderer: meta,
            },
          });
        } catch (error) {
          console.log(error)
        }
        
      },
      *ordererDelete({ payload }, { call, put }) {
        const response = yield call(ordererDelete, payload);
        try {
          const { meta } = response;
          yield put({
            type: 'save',
            payload: {
              ordererDelete: meta,
            },
          });
        } catch (error) {
          console.log(error)
        }
        
      },
      *peerDelete({ payload }, { call, put }) {
        const response = yield call(peerDelete, payload);
        try {
          const { meta } = response;
          yield put({
            type: 'save',
            payload: {
              peerDelete: meta,
            },
          });
        } catch (error) {
          console.log(error)
        }
        
      },
      *peerDeploy({ payload }, { call, put }) {
        const response = yield call(peerDeploy, payload);
        try {
          const { meta } = response;
          meta.stamp = new Date().getTime();
          yield put({
            type: 'save',
            payload: {
              peerDeploy: meta,
            },
          });
        } catch (error) {
          console.log(error)
        }
        
      },
      *handleOrdererDeploy({ payload }, { call, put }) {
        const response = yield call(ordererDeploy, payload);
        try {
          const { data } = response;
          data.stamp = new Date().getTime();
          yield put({
            type: 'save',
            payload: {
              ordererDeploy: data,
            },
          });
        } catch (error) {
          console.log(error)
        }
        
      },
      *handleCreateOrderer({ payload }, { call, put }) {
        const response = yield call(createOrderer, payload);
        try {
          const { meta } = response;
          meta.stamp = new Date().getTime();
          yield put({
            type: 'save',
            payload: {
              createOrderer: meta,
            },
          });
        } catch (error) {
          console.log(error)
        }
        
      },
      *handleGetCA({ payload }, { call, put }){
        const response = yield call(getCA, payload);
        try {
            const { data } = response;
            data.stamp = new Date().getTime();
            yield put({
                type: 'save',
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
    },
    },
    reducers: {
      save(state, { payload }) {
        return {
          ...state,
          ...payload,
        };
      },
    },
  };
  