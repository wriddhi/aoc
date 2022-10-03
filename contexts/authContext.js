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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    phoneNumber: user.phoneNumber
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
        await signOut(auth)
        localStorage.removeItem("user")
        router.push('/login')
    }

    return(
        <AuthContext.Provider value={{user, login, signup, logout}}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}