import React, { useEffect, useState } from 'react'
import styles from '../../styles/Dashboard.module.css'
import { useAuth } from '../../contexts/authContext'

import { app, auth, db } from '../../firebaseConfig'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

import { AiTwotoneEdit } from 'react-icons/ai'
import { gather } from '@tensorflow/tfjs'

function Profile() {

    const { user } = useAuth()

    const [userData, setUserData] = useState(null)

    const userRef = doc(db, 'users', user.uid)

    const gatherDoc = async() => {
        await getDoc(userRef)
        .then(data => {
            if(userData == null){
                setUserData(data.data())
                // console.log(data.data())
            }
        }).catch(error => {alert(error)})
    }

    gatherDoc()

    return (
        <>

        </>
    )
}

export default Profile