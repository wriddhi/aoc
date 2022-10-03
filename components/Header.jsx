import React from 'react'
import Link from 'next/link'
import { AiOutlineHome } from 'react-icons/ai'
import styles from '../styles/Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      {/* <Link href='/'> */}
        {/* <AiOutlineHome className={styles.home}/> */}
      {/* </Link> */}
      <h2>Quiz webapp</h2>
      {/* <h2>Quiz for Competency-based Assessment</h2> */}
    </header>
  )
}

export default Header