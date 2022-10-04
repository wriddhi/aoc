import React, {useEffect, useState} from 'react'
import styles from '../styles/Login.module.css'
import Link from 'next/link'

import { auth, db } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from '../contexts/authContext'
import { useRouter } from 'next/router'

function LoginForm() {

    
    const router = useRouter()
    const { user, setUser, login } = useAuth()
    
    if(user) {
        router.push('/dashboard')
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')

    const handleEmail = (e) => {
        e.preventDefault()
        if(e.key!="Enter"){
            setEmail(e.target.value)
        }
    }

    const handlePassword = (e) => {
        e.preventDefault()
        if(e.key!="Enter"){
            setPassword(e.target.value)
        }
    }

    const handleStatus = () => {
        if(status){
            return(<section className={styles.statusBox}>{status}</section>)
        }
    }

    const handleLogin = async(e) => {
        e.preventDefault()
        const userRef = await login(email, password).then((userCredential) => {
            return doc(db, 'users', userCredential.user.uid)
        })
        .catch(error => {
            setStatus('invalid login details')
            return
        });

        if(!userRef) {
            return
        }
        // at this  point user is eligible for login as they entered correct login details, hence we get all their data
        router.push('/dashboard')
    }

    return (
        <form action='/login' className={styles.form}>
            <h1>LOGIN</h1>
            {handleStatus()}
            <section className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>Email</label>
                <input type="email" name='email' id='email' className={styles.formInput} required value={email} onChange={handleEmail}/>
            </section>
            <section className={styles.formGroup}>
                <label htmlFor="password" className={styles.formLabel}>Password</label>
                <input type="password" name='password' id='password' className={styles.formInput} required value={password} onChange={handlePassword}/>
            </section>
            <button className={styles.btn} onClick={handleLogin}>Login</button>
            <span className={styles.options}>Forgot Password? <Link href='/login'>Click here</Link></span>
            <span className={styles.options}>Don&apos;t have an account? <Link href='/signup'>Sign Up</Link></span>
        </form>
  )
}

export default LoginForm