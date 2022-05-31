import { combineReducers } from 'redux'
import common from './common'
import home from './home'

// reducer 是纯函数
export default combineReducers({
    common,
    home
})