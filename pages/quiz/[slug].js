import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import { useTimer } from 'react-timer-hook'


import styles from '../../styles/QuizAttempt.module.css'


import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore"

import  { useAuth } from '../../contexts/authContext'
import {app, db} from '../../firebaseConfig'

const Timer = ({allowedTime}) => {
    const quizTime = (Number(allowedTime.hrs)*3600)+(Number(allowedTime.mins)*60)+Number(allowedTime.secs)

    const time = new Date()
    const expiryTimestamp = time.setSeconds(time.getSeconds()+quizTime)

    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

    return(
        <div className={styles.timerSection}>
            <span>Time remaining : </span>
            <div className={styles.timer}>
                <span className={styles.timerInput}>{hours<=9 ? <>0{hours}</> : hours}</span>:
                <span className={styles.timerInput}>{minutes<=9 ? <>0{minutes}</> : minutes}</span>:
                <span className={styles.timerInput}>{seconds<=9 ? <>0{seconds}</> : seconds}</span>
            </div>
        </div>
    )
}

const InvalidQuiz = () => {
    return(
        <>
            No such quiz found
        </>
    )
}

const Quiz = ({question, answers, setAnswers}) => {

    const handleAnswerChange = (e) => {
        setAnswers({...answers, [question.qno-1]: e.target.value})
    }
    

    return(
        <div className={styles.questionBlock}>
            <span className={styles.question}>{question.qno}. {question.question}</span>
            <div className={styles.optionsList} onChange={handleAnswerChange}>
                <input type="radio" value="1" name={question.qno} /> {question.option1}
                <input type="radio" value="2" name={question.qno} /> {question.option2}
                <input type="radio" value="3" name={question.qno} /> {question.option3}
                <input type="radio" value="4" name={question.qno} /> {question.option4}
            </div>
        </div>
    )
}


function slug() {

    const { user } = useAuth()

    const router = useRouter()

    const [quiz, setQuiz] = useState(null)
    const [allowedTime, setAllowedTime] = useState(null)

    const [answers, setAnswers] = useState({})

    const getQuizzes = async() => {
    
        const quizSnapshot = await getDoc(doc(db, "quizzes", router.query.slug))

        console.log(quizSnapshot.data())

        if (quizSnapshot.data()) {
            setQuiz(quizSnapshot.data().quiz)
            setAllowedTime(quizSnapshot.data().allowedTime)
        }

    }

    const handleSubmission = async() => {

        let percentage = 0
        let correct = 0
        let correctAnswers = {}


        for (let i = 0; i < quiz.length; i++) {
            if(Number(quiz[i].answer) === Number(answers[i])){
                correct++
                correctAnswers[`${quiz[i].qno}`]=true
            }else{
                correctAnswers[`${quiz[i].qno}`]=false
            }
            percentage = (100*correct)/quiz.length
        }

        const resultsRef = await addDoc(collection(db, "quizzes", router.query.slug, "results"), {
            email: user.email,
            uid: user.uid,
            timestamp: serverTimestamp(),
            correctAnswers,
            correct,
            percentage
        })

        router.push('/dashboard')
    }

    useEffect(() => {
        return getQuizzes
    }, [])

    return (
        <div className={styles.form}>
            {quiz ? <Timer allowedTime={allowedTime}/> : null}
            {quiz ? quiz.map(question => <Quiz key={question.qno} question={question} answers={answers} setAnswers={setAnswers}/>) : <InvalidQuiz/>}
            <button className={styles.submitBtn} onClick={handleSubmission}>Submit Quiz</button>
        </div>
    )
}

export default slug