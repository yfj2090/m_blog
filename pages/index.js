import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getHomeSaga } from '@store/actions/home'


function Index() {
  const home = useSelector((state) => state.home)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getHomeSaga())
  }, [dispatch])
  
  return (
    <div>
      Monotony Blog
      {home}
    </div>
  )
}


export default Index