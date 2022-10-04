import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuth } from '../contexts/authContext'

const ProtectedRoute = ({children}) => {

    const { user, setUser } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if(!user && localStorage.length===0) {
            router.push('/login')
        }
    }, [user])

    return(
        <>
            {user ? children : null}
        </>
    )
}

export default ProtectedRoute