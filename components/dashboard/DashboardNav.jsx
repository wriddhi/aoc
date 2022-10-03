import React, { useEffect, useState } from 'react'
import styles from '../../styles/Dashboard.module.css'
import Profile from './Profile'
import Quizzes from './Quizzes'
import { useAuth } from '../../contexts/authContext'

import { app, auth, db } from '../../firebaseConfig'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

function DashboardNav() {

    const { user, logout } = useAuth()


    const [tab, setTab] = useState('profile')
    const [userData, setUserData] = useState(null)

    const userRef = doc(db, 'users', user.uid)

    const gatherDoc = async() => {
        await getDoc(userRef)
        .then(data => {
            if(userData == null){
                setUserData(data.data())
                // console.log(userData)
            }
        }).catch(error => {alert(error)})
    }

    gatherDoc()

    // useEffect(() => {
    //     gatherDoc()
    // }, [])

    useEffect(() => {
        if(tab==='profile'){
            document.getElementById('quizzes-tab').classList.remove(`${styles.active}`)
            document.getElementById('profile-tab').classList.add(`${styles.active}`)
        }else if(tab==='quizzes'){
            document.getElementById('profile-tab').classList.remove(`${styles.active}`)
            document.getElementById('quizzes-tab').classList.add(`${styles.active}`)
        }
    }, [tab])
    

  return (
    <>
        <h1 className={styles.intro}>Welcome to Dashboard, {userData?userData.first_name:user.email}
            {console.log('User by dashboard ', user)}
            <button className={styles.logoutBtn} onClick={()=>{logout()}}>Logout</button>
        </h1>

        <nav className={styles.nav}>
            <section id="profile-tab" className={styles.navtab}><span onClick={()=>setTab('profile')}>Profile</span></section>
            <section id="quizzes-tab" className={styles.navtab}><span onClick={()=>setTab('quizzes')}>Quizzes</span></section>
        </nav>

        {tab=='profile'?<Profile user={userData}/>:<Quizzes/>}
    </>
  )
}

export default DashboardNav