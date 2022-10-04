import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { useRouter } from 'next/router'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if(authUser){
                console.log(user)
                setUser({
                    uid: authUser.uid,
                    email: authUser.email,
                    displayName: authUser.displayName,
                    phoneNumber: authUser.phoneNumber
                })
            }else{
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()

    }, [])
    

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }
    
    const router = useRouter()

    const logout = async() => {
        setUser(null)
        localStorage.clear()
        await signOut(auth)
        router.push('/login')
    }

    return(
        <AuthContext.Provider value={{user, setUser, login, signup, logout}}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}