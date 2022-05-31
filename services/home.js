
import request from '@plugins/request'
import {
  API_HOME,
} from '@constant/api'

// 获取首页 banner、通知、币种实时价格趋势
export const getHomeApi = () => {
  return request({
    url: API_HOME,
    method: 'GET'
  })
}