// REACT AND STYLES IMPORT

import React, { useEffect, useState } from 'react'
import styles from '../styles/Quiz.module.css'

// REACT ICONS IMPORTS

import { IoIosAddCircle } from 'react-icons/io'
import { FiEdit3 } from 'react-icons/fi'
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go'
import { MdDeleteSweep, MdModeEditOutline } from 'react-icons/md'
import { AiOutlineWarning, AiFillWarning } from 'react-icons/ai'

// FIREBASE IMPORTS

import { app, auth, db } from '../firebaseConfig'
import { collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore'

import  { useAuth } from '../contexts/authContext'
import { useRouter } from 'next/router'



const QuizQuestions = ({qnum, questionText, questions, setQuestions, setQno, setQuestion, setOption1, setOption2, setOption3, setOption4, setAnswer}) => {

    const deleteQuestion = (qnum) => {
        const updatedQuestions = questions.filter(qn => {
            return qn.qno !== qnum
        })

        setQuestions(updatedQuestions)
    }

    const editQuestion = (qnum) => {
        const newEditQuestion = questions.filter(qn => {
            return qn.qno == qnum
        })
        console.log("Question to be edited", newEditQuestion[0].qno)
        setQno(newEditQuestion[0].qno)
        setQuestion(newEditQuestion[0].question)
        setOption1(newEditQuestion[0].option1)
        setOption2(newEditQuestion[0].option2)
        setOption3(newEditQuestion[0].option3)
        setOption4(newEditQuestion[0].option4)
        setAnswer(newEditQuestion[0].answer)

        deleteQuestion(qnum)
    }

    return(
        <div className={styles.questionCard}>
            {qnum}. {questionText}
            <span onClick={() => editQuestion(qnum)} className={styles.editBtn}><MdModeEditOutline/></span>
            <span onClick={() => deleteQuestion(qnum)} className={styles.deleteBtn}><MdDeleteSweep/></span>
        </div>
    )
}

const TimeInput = ({time, setTime, status, setStatus}) => {

    return (
        <div className={styles.timer}>
            <p>Total time</p>
            <select 
                name='hrs' 
                className={styles.timerInput} 
                onChange={(e) => {setTime({...time, hrs: e.currentTarget.value})}} 
                value={time.hrs}
                required>
                <option value="00">00</option>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="09">04</option>
            </select>
            <select 
                name='mins' 
                className={styles.timerInput} 
                onChange={(e) => {setTime({...time, mins: e.currentTarget.value})}} 
                value={time.mins}
                required>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
            </select>
            <select 
                name='secs' 
                className={styles.timerInput} 
                onChange={(e) => {setTime({...time, secs: e.currentTarget.value})}} 
                value={time.secs}
                required>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
            </select>
            {/* <input value={time.hrs} name='hrs' className={styles.timerInput} type="number" min="0" max="4" placeholder="00" onChange={handleHrs} /> */}
            {/* <input value={time.mins} name='mins' className={styles.timerInput} type="number" min="10" max="59" placeholder="00" onChange={handleMins} />
            <input value={time.secs} name='secs' className={styles.timerInput} type="number" min="0" max="59" placeholder="00" onChange={handleSecs} /> */}
            <label className={styles.timeLabels} htmlFor='hrs'>Hrs</label>
            <label className={styles.timeLabels} htmlFor='mins'>Mins</label>
            <label className={styles.timeLabels} htmlFor='secs'>Secs</label>
        </div>
    )
}

function QuizCreator() {

    const { user, signup } = useAuth()
    const router = useRouter()
    
    const [questions, setQuestions] = useState([])
    const [status, setStatus] = useState(null)

    const [quizName, setQuizName] = useState('New Quiz')

    const [time, setTime] = useState({hrs: '00', mins: '00', secs: '00'})

    const [qno, setQno] = useState(1)
    const [question, setQuestion] = useState('')
    const [option1, setOption1] = useState('')
    const [option2, setOption2] = useState('')
    const [option3, setOption3] = useState('')
    const [option4, setOption4] = useState('')
    const [answer, setAnswer] = useState('1')

    const addQuestion = () => {

        if(!question || !option1 || !option2 || !option3 || !option4 || answer==null){
            setStatus("All fields are not filled!")
            return
        }

        if(option1==option2 || option1==option3 || option1==option4 || option2==option3 || option2==option4 || option3==option4){
            setStatus("Two options cannot be the same!")
            return
        }

        const currentQuestion = {
            qno,
            question,
            option1,
            option2,
            option3,
            option4,
            answer
        }

        if(questions.some(qn => qn['qno']==currentQuestion.qno)){
            setStatus("Cannot have 2 questions with same question no.!")
            return
        }else{
            setStatus(null)
        }

        setQuestions(qns => [...qns, currentQuestion])
        setQno(qno => qno+1)
        setQuestion('')
        setOption1('')
        setOption2('')
        setOption3('')
        setOption4('')
        setAnswer('1')
    }

    useEffect(() => {
        questions.sort((a, b) => {
            return a.qno - b.qno;
        })
    }, [questions])

    const handleTimer = () => {
        console.log("Timer")
    }

    const handleStatus = () => {
        if(status){
            return(<section className={styles.statusBox}><AiFillWarning id={styles.warn}/>{status}</section>)
        }
    }

    const handleSubmission = async(e) => {
        e.preventDefault()

        if(questions.length==0){
            setStatus("Cannot submit quiz with no questions!")
            return
        }

        if(time.hrs=='00' && time.mins=='00' && time.secs=='00'){
            setStatus('Total time for quiz cannot be 0!')
            return
        }else{
            setStatus('')
        }

        const sorted = [...questions].sort((a, b) => {
            return a.qno - b.qno;
        })

        setQuestions(sorted);

        for (let i = 1; i < questions.length; i++) {
            if(questions[i].qno!=(questions[i-1].qno)+1){
                setStatus(`Question ${questions[i-1].qno+1} is missing!`)
                return
            }
        }
        setStatus('')

        const quizRef = await addDoc(collection(db, "quizzes"), {
            name: quizName,
            author: user.uid,
            timestamp: serverTimestamp(),
            allowedTime: time,
            quiz: questions
        })

        router.push('/dashboard')
    }

    return (
        <form action='/' className={styles.form}>
            <h1>
                <input value={quizName} className={styles.quizName} onChange={(e) => {setQuizName(e.target.value)}}/>
                <TimeInput onClick={handleTimer()} time={time} setTime={setTime} status={status} setStatus={setStatus}/>
            </h1>

            <section className={styles.questionList}>
                {questions.length>0 ? questions.map(qn => <QuizQuestions key={qn.qno} qnum={qn.qno} questionText={qn.question} questions={questions} setQuestions={setQuestions} setQno={setQno} setQuestion={setQuestion} setOption1={setOption1} setOption2={setOption2} setOption3={setOption3} setOption4={setOption4} setAnswer={setAnswer}/>) : null}
            </section>

            {handleStatus()}

            <section className={styles.formGroup}>

                <label htmlFor="question" className={styles.formLabel}>Question No:</label>
                <input type="text" name="question" className={styles.formInput} placeholder="QNo..." value={qno} onChange={(e) => Number(e.target.value)>=0 && Number(e.target.value)%10<=9 ? setQno(Number(e.target.value)) : null} required/>
                
                <label htmlFor="question" className={styles.formLabel}>Question {qno}:</label>
                <input type="text" name="question" className={styles.formInput} placeholder="Question..." value={question} onChange={(e) => setQuestion(e.target.value)} required/>

                <label htmlFor="op1" className={styles.formLabel}>Option 1 :</label>
                <input type="text" name="op1" className={styles.formInput} placeholder="Option 1" value={option1} onChange={(e) => setOption1(e.target.value)} required/>

                <label htmlFor="op2" className={styles.formLabel}>Option 2 :</label>
                <input type="text" name="op2" className={styles.formInput} placeholder="Option 2" value={option2} onChange={(e) => setOption2(e.target.value)} required/>
                
                <label htmlFor="op3" className={styles.formLabel}>Option 3 :</label>
                <input type="text" name="op3" className={styles.formInput} placeholder="Option 3" value={option3} onChange={(e) => setOption3(e.target.value)} required/>

                <label htmlFor="op4" className={styles.formLabel}>Option 4 :</label>
                <input type="text" name="op4" className={styles.formInput} placeholder="Option 4" value={option4} onChange={(e) => setOption4(e.target.value)} required/>

                <label htmlFor="ans" className={styles.formLabel}>Answer :</label>
                <select 
                name='ans' 
                className={styles.formInput} 
                onChange={(e) => {setAnswer(e.currentTarget.value)}} 
                value={answer}
                required>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                    <option value="4">Option 4</option>
                </select>
                <span onClick={() => addQuestion()} className={styles.addBtn}><IoIosAddCircle/></span>
                <hr />
            </section>
            <section className={styles.buttons}>
                <span onClick={(e) => setQuestions([])} className={styles.clearBtn}>Clear Quiz</span>
                <button onClick={(e) => handleSubmission(e)} className={styles.submitBtn}>Submit Quiz</button>
            </section>
        </form>
    )
}

export default QuizCreator