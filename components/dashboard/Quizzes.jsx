import React, { useEffect, useState } from 'react'
import styles from '../../styles/Dashboard.module.css'

import Link from 'next/link'
import dynamic from 'next/dynamic'

import { IoQrCodeOutline } from 'react-icons/io5'

import { app, auth, db } from '../../firebaseConfig'
import { collection, query, where, getDocs } from "firebase/firestore";
import  { useAuth } from '../../contexts/authContext'

const QrCode = dynamic(() => import('../QrCode'), {ssr: false})

const QuizList = ({quiz, qrCode, setQrCode, setQrCodeUrl}) => {

  const timestamp = quiz.timestamp.toDate().toString().split(" ").slice(0,4)
  const quizTime = {
    weekday: timestamp[0],
    month: timestamp[1],
    day: timestamp[2],
    year: timestamp[3]
  }

  const handleQrCode = () => {
    setQrCodeUrl(`/quiz/${quiz.id}`)
    setQrCode(!qrCode)
  }

  return(
    <span className={styles.quizCard}>
      <p><Link href={`/quiz/${quiz.id}`}>{quiz.name}</Link></p>
      <p>{quizTime.weekday}, {quizTime.month} {quizTime.day} {quizTime.year}</p>
      <p>{quiz.quiz.length}</p>
      <p><IoQrCodeOutline onClick={handleQrCode}/></p>
    </span>
  )
}

function Quizzes() {

  const { user } = useAuth()

  const [quizzes, setQuizzes] = useState([])
  const [qrCode, setQrCode] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  
  const getQuizzes = async() => {

    if(quizzes.length > 0 ) {
      console.log("You have quizzes => ", quizzes)
      return
    }

    console.log("Getting your quizzes . . .")

    const querySnapshot = await getDocs(query(collection(db, "quizzes"), where("author", "==", user.uid)))

    let quizArray = []
    querySnapshot.forEach((doc) => {
      const currentQuiz = doc.data()
      currentQuiz.id = doc.id

      quizArray.push(currentQuiz)
    })
    quizArray.sort((a, b) => {
      return b.timestamp.seconds - a.timestamp.seconds
    })
    setQuizzes(quizArray)
  }

  useEffect(() => {
    return getQuizzes
  }, [])
  
  // useEffect(() => {
  //   console.log("Quizzes array was changed")
  //   console.log(quizzes)
  // }, [quizzes])

  return (
    <>
      {qrCode ? <QrCode url={qrCodeUrl} visible={qrCode} setQrCode={setQrCode}/> : null}
      <Link href={'/create-new-quiz'}><button className={styles.button}>Create New Quiz</button></Link>
      <main className={styles.form}>
        <h3 className={styles.quizzesHeading}>Your quizzes</h3>
        {quizzes.length>0 ?
          <span className={styles.quizDetailsTab}>
            <p>QUIZ NAME</p>
            <p>CREATION TIME</p>
            <p>NO. OF QUESTIONS</p>
            <p>SHARE</p>
          </span> :
          <span className={styles.quizDetailsTab}>
            <p className={styles.noQuizDetails}>NO QUIZZES TO SHOW</p>
          </span>
        }
        {quizzes.map((quiz) => (<QuizList key={quiz.id} quiz={quiz} qrCode={qrCode} setQrCode={setQrCode} setQrCodeUrl={setQrCodeUrl}/>))}
      </main>
    
    </>
  )
}

export default Quizzes