import React, { useEffect, useState } from 'react'
import styles from '../../styles/Dashboard.module.css'
import Profile from './Profile'
import Quizzes from './Quizzes'
import { useAuth } from '../../contexts/authContext'

import { db } from '../../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

function DashboardNav() {

    const { user, setUser, logout } = useAuth()
    const [ currentUser, setCurrentUser ] = useState(null)
    const [tab, setTab] = useState('profile')

    const getUser = async() => {
        console.log("Gathering info for => ", user.uid)
        const userRef = doc(db, 'users', user.uid)
        await getDoc(userRef).then(data => {
            // Store all of the user's details in local storage to remember user and avoid logging in everytime page refreshes
            for(const detail in data.data()) {
                // console.log("Setting user")
                localStorage.setItem(detail, data.data()[detail])
            }

            const authUser = data.data()
            setUser(authUser)
        })
    }

    useEffect(() => {
        if(user){
            getUser(user)
        }
    }, [])
    

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
        <h1 className={styles.intro}>Welcome to Dashboard, {user.first_name}
            <button className={styles.logoutBtn} onClick={()=>{logout()}}>Logout</button>
        </h1>

        <nav className={styles.nav}>
            <section id="profile-tab" className={styles.navtab}><span onClick={()=>setTab('profile')}>Profile</span></section>
            <section id="quizzes-tab" className={styles.navtab}><span onClick={()=>setTab('quizzes')}>Quizzes</span></section>
        </nav>

        {tab=='profile'?<Profile user={user}/>:<Quizzes/>}
    </>
  )
}

export default DashboardNav