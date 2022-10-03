import React, {useState, useEffect} from 'react'
import styles from '../styles/SignUp.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {BsFillEyeFill, BsFillEyeSlashFill} from 'react-icons/bs'

import { app, auth, db } from '../firebaseConfig'
import { collection, addDoc, setDoc, doc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'

import  { useAuth } from '../contexts/authContext'


function SignUpForm() {

    const { user, setUser, signup } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [designation, setDesignation] = useState('student')
    const [country, setCountry] = useState('')
    const [mobile, setMobile] = useState('')

    const [status, setStatus] = useState('')

    const[visibility, setVisibility] = useState('password')

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
    const handlePassVisibility = (e) => {
        if(visibility==='password'){
            setVisibility('text')
        }else{
            setVisibility('password')
        }
    }
    const handleFname = (e) => {
        e.preventDefault()
        if(e.key!="Enter"){
            setFname(e.target.value)
        }
    }
    const handleLname = (e) => {
        e.preventDefault()
        if(e.key!="Enter"){
            setLname(e.target.value)
        }
    }
    const handleCountry = (e) => {
        e.preventDefault()
        if(e.key!="Enter"){
            setCountry(e.target.value)
        }
    }
    const handleMobile = (e) => {
        e.preventDefault()
        if(e.key!="Enter" && Number(e.target.value)%10>=0 && Number(e.target.value)%10<=9){
            setMobile(e.target.value)
        }
    }

    useEffect(() => {
        if(password && password.length<6){
            setStatus({time:'presubmit', details: 'password is too short'})
        }else{
            setStatus('')
        }

    }, [password])    

    const handleStatus = () => {
        if(status){
            return(<section className={styles.statusBox}>{status.details}</section>)
        }
    }
    

    const router = useRouter()

    const handleSignUpForm = async(e) => {
        e.preventDefault()

        const userInfo = {
            email,
            "first_name": fname,
            "last_name": lname,
            password,
            designation,
            country,
            mobile
        }

        if((email && fname && lname && country && designation && password && mobile) == false){
            setStatus({time: 'presubmit', details: 'one or more fields empty'})
            return
        }

        if(status && status.time=='presubmit'){
            return
        }

        signup(userInfo.email, userInfo.password)
        .then((userCredential) => {
            const userRef = collection(db, 'users')
            delete userInfo.password
            userInfo["userID"] = userCredential.user.uid
            // console.log(userCredential)
            updateProfile(auth.currentUser, {
                displayName: userInfo.first_name
            }).then(() => {
            
            }).catch((error) => {
                console.error(error)
            })
            setDoc(doc(userRef, userCredential.user.uid), userInfo)
            console.log(auth.currentUser)
            router.push('/login')
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            const errorStatus = String(errorCode).slice(5).replaceAll('-', ' ')
            setStatus({time: 'postsubmit', details: errorStatus})
        });
    }

    return (
        <form action='/' className={styles.form}>
            <h1>SIGN UP</h1>
            {handleStatus()}
            <section className={styles.formGroup}>
                <label htmlFor="firstname" className={styles.formLabel}>First Name</label>
                <input type="text" name='firstname' id='firstname' className={styles.formInput} required value={fname} onChange={handleFname}/>
            </section>
            <section className={styles.formGroup}>
                <label htmlFor="lastname" className={styles.formLabel}>Last Name</label>
                <input type="text" name='lastname' id='lastname' className={styles.formInput} required value={lname} onChange={handleLname}/>
            </section>
            <section className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>Email</label>
                <input type="email" name='email' id='email' className={styles.formInput} required value={email} onChange={handleEmail}/>
            </section>
            <section className={styles.formGroup}>
                <label htmlFor="password" className={styles.formLabel}>Password</label>
                <input type={visibility} name='password' id='password' className={styles.formInput} required value={password} onChange={handlePassword}/>
                <div className={styles.passbtn} onClick={handlePassVisibility}>{visibility==='password'? <BsFillEyeFill/>: <BsFillEyeSlashFill/>}</div>
            </section>
            <section className={styles.span1}>
                <label htmlFor="designation" className={styles.formLabel}>You are</label>
                <select 
                name='desgination' 
                className={styles.formInput} 
                onChange={(e) => {setDesignation(e.currentTarget.value)}} 
                value={designation}
                required>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="others">Others</option>
                </select>
            </section>
            <section className={styles.span1}>
                <label htmlFor="country" className={styles.formLabel}>Country Code</label>
                <input type="number" min="0" name='country' id='country' className={styles.formInput} required value={country} onChange={handleCountry}/>
            </section>
            <section className={styles.formGroup}>
                <label htmlFor="mobile" className={styles.formLabel}>Mobile</label>
                <input type="tel" name='mobile' id='mobile' pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" className={styles.formInput} required value={mobile} onChange={handleMobile}/>
            </section>
            <span className={styles.options}> <input type="checkbox" required name="terms" id="terms" value="true" /> Agree to terms &amp; conditions<Link href='/terms'>*</Link></span>
            <button className={styles.btn} type="submit" onClick={handleSignUpForm}>Sign Up</button>
            <span className={styles.options}>Already have an account? <Link href='/login'>Login</Link></span>
        </form>
  )
}

export default SignUpForm