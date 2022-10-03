import React from 'react'
import LoginForm from '../components/LoginForm'
import Head from 'next/head'

function login() {
  return (
    <div>
        <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
        <LoginForm/>
    </div>
  )
}

export default login