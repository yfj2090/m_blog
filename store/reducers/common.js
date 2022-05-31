import {
  LOAD_ERROR,
  LOAD_LOADING,
  LOAD_SUCCESS
} from '@constant/actionTypes'
  
  const INITIAL_STATE = {
    data: {},
    loading: {},
    error: {},
  }
  
  const commonReducer = (state = INITIAL_STATE, action) => {
    const { type, payload, key, error = '' } = action
    switch (type) {
      case LOAD_LOADING:
        state.loading = true
        return {
          ...state,
          error: {}
        }
      case LOAD_SUCCESS:
        state.loading = false
        state.data = payload
        return {
          ...state
        }
      case LOAD_ERROR:
        state.loading = false
        state.data = payload
        state.error = error ? error : ''
        return {
          ...state
        }
      default:
          return state
    }
  }
  
  export default commonReducer
  