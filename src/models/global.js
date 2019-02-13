import { getOrganiztion, setORganiztion } from '@/services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {
    *handleGetOrganiztion(_, { put, call }) {
      const res = yield call(getOrganiztion);
      try {
        res.stamp = new Date().getTime();
        yield put({
          type: 'getOrganiztion',
          payload: res,
        });
      } catch (error) {
        console.log(error)
      }
    },
    *handleSetOrganiztion({ payload }, { put, call}){
      const res = yield call(setORganiztion, payload);
      try {
        const { meta } = res;
        meta.stamp = new Date().getTime();
        yield put({
          type: 'setORganiztion',
          payload: meta
        })
      } catch (error) {
        console.log(error)
      }
    }

  },

  reducers: {
    getOrganiztion(state, { payload }){
      return {
        ...state,
        getOrganiztion: payload
      }
    },
    setORganiztion(state, { payload }){
      return {
        ...state,
        setORganiztion: payload
      }
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
