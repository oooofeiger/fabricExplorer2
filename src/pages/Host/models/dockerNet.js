import { 
    getDockerNet, 
    getNetDetail,
    deleteNet,
    addNet
} from '@/services/api';


export default {
  namespace: 'dockerNet',

  state: {
    token: localStorage.getItem('token')
  },

  effects: {  
    *handleGetDockerNet({ payload }, { call, put}){
      const response = yield call(getDockerNet, payload);
      try {
            const { data } = response;
            yield put({
                type: 'getNetList',
                payload: data
            })
      } catch (error) {
            console.log(error)
      }
      
    },
    *handleGetNetDetail({ payload }, {call, put}){
        const response = yield call(getNetDetail, payload);
        try {
            const { data } = response;
            yield put({
                type: 'netDetail',
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
        
    },
    *handleDeleteNet({ payload }, {call, put}){
        const response = yield call(deleteNet, payload);
        try {
           const { meta } = response;
            yield put({
                type: 'deleteNet',
                payload: meta
            })  
        } catch (error) {
            console.log(error)
        }
        
    },
    *handleAddNet({ payload },{ call, put}){
        const response = yield call(addNet, payload);
        try {
            const { data, meta } = response;
            if(meta.success){
                data.stamp = new Date().getTime()
            }
            yield put({
                type: 'addNet',
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
        
    }
  },

  reducers: {
    getNetList(state, { payload }){
      return {
        ...state,
        getNetList: payload
      }
    },
    netDetail(state, { payload }){
        return {
            ...state,
            netDetail: payload
        }
    },
    deleteNet(state, { payload }){
        return {
            ...state,
            deleteNet: payload
        }
    },
    addNet(state, { payload }){
        return {
            ...state,
            addNet: payload
        }
    }
  },
};
