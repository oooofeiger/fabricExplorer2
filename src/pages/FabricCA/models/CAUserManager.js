import { 
    getCAUser, 
    registerCAUser,
    enrollCAUser,
    reenrollCAUser,
    deleteCAUser,
    createCrl,
    getCert,
    getCertInfo,
    downloadAllCert,
    downloadCert,
    revokeCert,
    getChildrenUser
} from '@/services/api';


export default {
  namespace: 'CAUserManager',

  state: {
    token: localStorage.getItem('token')
  },

  effects: {  
    *handleGetCAUser({ payload }, { call, put }){
      const response = yield call(getCAUser, payload);
      try {
        const { data } = response;
        data.stamp = new Date().getTime();
        yield put({
          type: 'getCAUser',
          payload: data
        })
      } catch (error) {
         console.log(error) 
      }
    },
    *handleRegisterCAUser({ payload }, { call, put }){
        const response = yield call(registerCAUser, payload);
        try {
          const { meta } = response;
          yield put({
            type: 'registerCAUser',
            payload: meta
          })
        } catch (error) {
           console.log(error) 
        }
    },
    *handleEnrollCAUser({ payload }, { call, put }){
        const response = yield call(enrollCAUser, payload);
        try {
          const { meta } = response;
          yield put({
            type: 'enrollCAUser',
            payload: meta
          })
        } catch (error) {
           console.log(error) 
        }
    },
    *handleReenrollCAUser({ payload }, { call, put }){
        const response = yield call(reenrollCAUser, payload);
        try {
          const { meta } = response;
          yield put({
            type: 'reenrollCAUser',
            payload: meta
          })
        } catch (error) {
           console.log(error) 
        }
    },
    *handleDeleteCAUser({ payload }, { call, put }){
        const response = yield call(deleteCAUser, payload);
        try {
          response.stamp = new Date().getTime();
          yield put({
            type: 'deleteCAUser',
            payload: response
          })
        } catch (error) {
           console.log(error) 
        }
    },
    *handleRevokeCert({ payload }, { call, put }){
      const response = yield call(revokeCert, payload);
      try {
        response.stamp = new Date().getTime();
        yield put({
          type: 'revokeCert',
          payload: response
        })
      } catch (error) {
         console.log(error) 
      }
  },
    *handleCreateCrl({ payload }, { call, put }){
        const response = yield call(createCrl, payload);
        try {
          const { data } = response;
          data.stamp = new Date().getTime();
          yield put({
            type: 'createCrl',
            payload: data
          })
        } catch (error) {
           console.log(error) 
        }
    },
    *handleGetCert({ payload }, { call, put }){
        const response = yield call(getCert, payload);
        try {
          const { data } = response;
          yield put({
            type: 'getCert',
            payload: data
          })
        } catch (error) {
           console.log(error) 
        }
    },
    *handleGetCertInfo({ payload }, { call, put }){
        const response = yield call(getCertInfo, payload);
        try {
          const { data } = response;
          yield put({
            type: 'getCertInfo',
            payload: data
          })
        } catch (error) {
           console.log(error) 
        }
    },
    *handleDownloadAllCert({ payload }, { call, put }){
        const response = yield call(downloadAllCert, payload);
        try {
          const { data } = response;
          yield put({
            type: 'downloadAllCert',
            payload: data
          })
        } catch (error) {
           console.log(error) 
        }
    },
    *handleDownloadCert({ payload }, { call, put }){
        const response = yield call(downloadCert, payload);
        try {
          const { data } = response;
          yield put({
            type: 'downloadCert',
            payload: data
          })
        } catch (error) {
           console.log(error) 
        }
    },
    *handleGetChildrenUser({ payload }, { call, put }){
      const response = yield call(getChildrenUser, payload);
      try {
        const { data } = response;
        yield put({
          type: 'childrenUser',
          payload: data
        })
      } catch (error) {
         console.log(error) 
      }
  },
  },

  reducers: {
    getCAUser(state, { payload }){
      return {
        ...state,
        getCAUser: payload
      }
    },
    registerCAUser(state, { payload }){
        return {
          ...state,
          registerCAUser: payload
        }
    },
    enrollCAUser(state, { payload }){
        return {
          ...state,
          enrollCAUser: payload
        }
    },
    reenrollCAUser(state, { payload }){
        return {
          ...state,
          reenrollCAUser: payload
        }
    },
    deleteCAUser(state, { payload }){
        return {
          ...state,
          deleteCAUser: payload
        }
    },
    createCrl(state, { payload }){
        return {
          ...state,
          createCrl: payload
        }
    },
    getCert(state, { payload }){
        return {
          ...state,
          getCert: payload
        }
    },
    getCertInfo(state, { payload }){
        return {
          ...state,
          getCertInfo: payload
        }
    },
    downloadAllCert(state, { payload }){
        return {
          ...state,
          downloadAllCert: payload
        }
    },
    downloadCert(state, { payload }){
        return {
          ...state,
          downloadCert: payload
        }
    },
    revokeCert(state, { payload }){
      return {
        ...state,
        revokeCert: payload
      }
    },
    childrenUser(state, { payload }){
      return {
        ...state,
        childrenUser: payload
      }
    }
  },
};
