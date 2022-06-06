import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getHomeSaga } from '@store/actions/home'


const Index = () => {
  const home = useSelector((state) => state.common.data.home) || ''
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getHomeSaga())
  }, [dispatch])
  
  return (
    <div>
      {
        home ? <span>{ home.title  }</span> : null
      }
    </div>
  )
}


export default Index