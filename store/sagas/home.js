import { put, take } from 'redux-saga/effects'

import {
  LOAD_ERROR,
  LOAD_LOADING,
  LOAD_SUCCESS,
  SAGA_HOME,
} from '@constant/actionTypes'

import {
  getHomeApi,
} from '@root/services/home'

// home数据数据库获取
function* fetchHome() {
    while(true) {
        try {
          let load = {
              key: SAGA_HOME,
              type: LOAD_LOADING
          }
          yield take(SAGA_HOME)
          yield put(load)
          const res = yield getHomeApi()
          if (res) {
            yield put({ ...load, type: LOAD_SUCCESS, payload: res.data })
          }
        } catch (e) {
          console.log(e)
        }
    }
}

export default [
  fetchHome()
]