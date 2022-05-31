import {
    SAGA_HOME
} from '@constant/actionTypes'

const INITIAL_STATE = {
    home: {},
    loading: {},
    error: {},
  }

const homeReducer = (state = INITIAL_STATE, action) => {
    const { type, payload, key, error = '' } = action
    switch(type) {
        case SAGA_HOME:
            return {
                ...state,
                error: {}
            }
        default:
            return state
    }
}

export default homeReducer