import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuth } from '../contexts/authContext'

const ProtectedRoute = ({children}) => {

    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if(!user){
            const localUser = localStorage.getItem("user")
            if(!localUser){
                router.push('/login')
            }
            // else{
            //     console.log('User not found')
            // }
        }
    }, [user])

    return(
        <>
            {user ? children : null}
        </>
    )
}

export default ProtectedRoute