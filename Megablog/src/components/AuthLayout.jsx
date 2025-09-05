import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function Protected({children, authentication = true}) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
      // If authentication is required and user is not authenticated, redirect to login
      if(authentication && authStatus !== authentication){
        navigate('/login')
      }
      // If authentication is not required (like signup/login pages) and user is already authenticated, redirect to home
      else if(!authentication && authStatus !== authentication){
        navigate('/')
      }
      setLoader(false)
    }, [authStatus, navigate, authentication])

  return loader ? <h1>Loading ...</h1> : <>{children}</>
}