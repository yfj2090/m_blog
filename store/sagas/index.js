import { all } from 'redux-saga/effects'
import home from './home'
// 注册 saga
function * rootSaga() {
    yield all([
        ...home
    ])
}

export default rootSaga