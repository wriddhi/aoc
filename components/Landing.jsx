import React from 'react'
import styles from '../styles/Landing.module.css'
import {useRouter} from 'next/router'

function Landing() {

    const router = useRouter()

    const handleLogin = (e) => {
        e.preventDefault()
        console.log("User tried to login")
        router.push('/login')
    }

    const handleSignup = (e) => {
        e.preventDefault()
        console.log("User tried to sign up")
        router.push('/signup')
    }

    return(
        <section className={styles.container}>
            <section className={styles.landing}>
                <div className={styles.gif}></div>
                <section className={styles.btns}>
                    <button className={`${styles.btn} ${styles.green}`} onClick={handleLogin}>Login</button>
                    <button className={`${styles.btn} ${styles.red}`}onClick={handleSignup}>Sign Up</button>
                </section>
            </section >
        </section>
    )
}

export default Landing