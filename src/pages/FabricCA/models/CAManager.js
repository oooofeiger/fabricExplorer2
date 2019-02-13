import { 
    addCA, 
    getCA,
    getOneCA,
    deleteCA,
    operCA,
    getConfigCA,
    setConfigCA,
    getConfigTpl,
    updateCert,
    getHostData,
    createServer
} from '@/services/api';


export default {
  namespace: 'CAManager',

  state: {
    token: localStorage.getItem('token')
  },

  effects: {  
    *getHostHandle({ payload }, { call, put}){
        const response = yield call(getHostData, payload);
        try {
          const { data } = response;
          yield put({
            type: 'hostData',
            payload: data
          })
        } catch (error) {
          console.log(error)
        }
        
    },
    *handleAddCA({ payload }, { call, put }){
      const response = yield call(addCA, payload);
      try {
        response.addStamp = new Date().getTime();
        yield put({
          type: 'addCA',
          payload: response
        })
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
                type: 'getCA',
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
    },
    *handleGetOneCA({ payload },{ call, put }){
        const response = yield call(getOneCA, payload);
        try {
            const { data } = response;
            yield put({
                type: 'getOneCA',
                payload: data
            })
        } catch (error) {
            console.log(error);
        }
    },
    *handleDeleteCA({ payload }, { call, put }){
        const response = yield call(deleteCA, payload);
        try {
            response.deleteStamp = new Date().getTime();
            yield put({
                type: 'deleteCA',
                payload: response
            })
        } catch (error) {
            console.log(error)
        }
    },
    *handleOperCA({ payload }, { call, put }){
        const response = yield call(operCA, payload);
        try {
            const { data } = response;
            yield put({
                type: 'operCA',
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
    },
    *handleGetConfigCA({ payload }, { call, put }){
        const response = yield call(getConfigCA, payload);
        try {
            const { data } = response;
            yield put({
                type: 'getConfigCA',
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
    },
    *handleSetConfigCA({ payload }, { call, put}){
        const res = yield call(setConfigCA, payload);
        try {
            const { meta } = res;
            yield put({
                type: 'setConfigCA',
                payload: meta
            })
        } catch (error) {
            console.log(error)
        }
    },
    *handleGetConfigTpl(_, {call, put}){
        const res = yield call(getConfigTpl);
        try {
            const { data } = res;
            yield put({
                type: 'getConfigTpl',
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
    },
    *handleUpdateCert({ payload },{ call, put}){
        const res = yield call(updateCert, payload);
        try {
            const { meta } = res;
            yield put({
                type: 'updateCert',
                payload: meta
            })
        } catch (error) {
            console.log(error)
        }
    },
    *handleCreateServer({ payload }, { call, put}){
        const res = yield call(createServer, payload);
        try {
            const { meta } = res;
            meta.stamp = new Date().getTime();
            yield put({
                type: 'createServer',
                payload: meta
            })
        } catch (error) {
            console.log(error)
        }
    }
  },

  reducers: {
    hostData(state, { payload }){
        return {
            ...state,
            hostData: payload
        }
    },
    addCA(state, { payload }){
      return {
        ...state,
        addCA: payload
      }
    },
    getCA(state, { payload }){
        return {
            ...state,
            getCA: payload
        }
    },
    getOneCA(state, { payload }){
        return {
            ...state,
            getOneCA: payload
        }
    },
    deleteCA(state, { payload }){
        return {
            ...state,
            deleteCA: payload
        }
    },
    operCA(state, { payload }){
        return {
            ...state,
            operCA: payload
        }
    },
    getConfigCA(state, { payload }){
        return {
            ...state,
            getConfigCA: payload
        }
    },
    setConfigCA(state, { payload }){
        return {
            ...state,
            setConfigCA: payload
        }
    },
    getConfigTpl(state, { payload }){
        return {
            ...state,
            getConfigTpl: payload
        }
    },
    updateCert(state, { payload }){
        return {
            ...state,
            updateCert: payload
        }
    },
    createServer(state, { payload }){
        return {
            ...state,
            createServer: payload
        }
    }
  },
};
