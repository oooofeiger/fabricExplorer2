import router from 'umi/router';
import { getHostData, addHost, updateHost, getOneHost, deleteHost } from '@/services/api';

export default {
  namespace: 'host',

  state: {
    title: '主机信息及设置',
    token: localStorage.getItem('token')
  },

  effects: {  
    *getHostHandle({ payload }, { call, put}){
      const response = yield call(getHostData, payload);
      try {
        const { data } = response;
        data.stamp = new Date().getTime();
        yield put({
          type: 'hostData',
          payload: data
        })
      } catch (error) {
        console.log(error)
      }
      
    },
    *addHostHandle({ payload }, { call, put }) {
      let response = yield call(addHost, payload);
      try {
        if(response.meta.success){
          response.stamp = new Date().getTime();
        }
        
        yield put({
          type: 'addHostRes',
          payload: response,
        });
      } catch (error) {
        console.log(error)
      }
      
    },
    *updateHostHandle({ payload }, { call, put}){
      const response = yield call(updateHost, payload);
      yield put({
        type: 'updateHost',
        payload: response
      })
    },
    *getOneHostHandle({ payload }, { call, put }){
      const response = yield call(getOneHost, payload);
      try {
        const { data, meta } = response;
        if(meta.success){
          data.stamp = new Date().getTime();
        }
        yield put({
          type: 'getOneHost',
          payload: data
        })
      } catch (error) {
        console.log(error)
      }
      
    },
    *deleteHostHandle({ payload }, {call, put}){
      const response = yield call(deleteHost, payload);
      try {
        const { meta } = response;
        meta.stamp = new Date().getTime();
        yield put({
          type: 'deleteHost',
          payload: meta
        })
      } catch (error) {
        console.log(error)
      }
      
    },
    *saveNowHost({ payload }, {call, put}){
      yield put({
        type: 'nowHost',
        payload: payload
      })
    }

  },

  reducers: {
    hostData(state, { payload }){
      return {
        ...state,
        hostData: payload
      }
    },
    addHostRes(state, { payload }) {
      return {
        ...state,
        addHostRes: payload,
      };
    },
    updateHost(state, { payload }){
      return {
        ...state,
        updateHost: payload
      }
    },
    getOneHost(state, { payload }){
      return {
        ...state,
        oneHost: payload
      }
    },
    deleteHost(state, { payload }){
      return {
        ...state,
        deleteHost: payload
      }
    },
    nowHost(state, { payload }){
      return {
        ...state,
        nowHost: payload
      }
    }
  },
};
