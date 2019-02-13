import { 
    getDockerImage, 
    postDockerImage,
    getImageDetail,
    deleteImage,
    imageTag
} from '@/services/api';


export default {
  namespace: 'dockerImage',

  state: {
    token: localStorage.getItem('token')
  },

  effects: {  
    *handleGetDockerImage({ payload }, { call, put}){
      const response = yield call(getDockerImage, payload);
      try {
        const { data } = response;
        yield put({
          type: 'getImage',
          payload: data
        })
      } catch (error) {
          console.log(error)
      }
      
    },
    *handlePostDockerImage({ payload }, { call, put}){
        const response = yield call(postDockerImage, payload);
        try {
            const { data } = response;
            if(response.meta.success){
                data.stamp = new Date().getTime()
            }
            yield put({
            type: 'imagePost',
            payload: data
            })
        } catch (error) {
            console.log(error)
        }
        
      },
    *handleGetImageDetail({ payload }, {call, put}){
        const response = yield call(getImageDetail, payload);
        try {
            const { data } = response;
            yield put({
                type: 'imageDetail',
                payload: data
            })
        } catch (error) {
            console.log(error)
        }
        
    },
    *handleDeleteImage({ payload }, {call, put}){
        const response = yield call(deleteImage, payload);
        try {
            const { data } = response;
            yield put({
                type: 'deleteImage',
                payload: data
            }) 
        } catch (error) {
            console.log(error)
        }
        
    },
    *handleImageTag({ payload }, {call, put}){
        const response = yield call(imageTag, payload);
        try {
            const { meta } = response;
            if(meta.success){
                meta.stamp = new Date().getTime()
            }
            yield put({
                type: 'imageTag',
                payload: meta
            })
        } catch (error) {
            console.log(error)
        }
        
    }
  },

  reducers: {
    getImage(state, { payload }){
      return {
        ...state,
        getImageList: payload
      }
    },
    imagePost(state, { payload }){
        return {
            ...state,
            postImageList: payload
        }
    },
    imageDetail(state, { payload }){
        return {
            ...state,
            imageDetail: payload
        }
    },
    deleteImage(state, { payload }){
        return {
            ...state,
            deleteImage: payload
        }
    },
    imageTag(state, { payload }){
        return {
            ...state,
            imageTag: payload
        }
    }
  },
};
