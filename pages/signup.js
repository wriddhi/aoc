import React from 'react'
import Head from 'next/head'
import SignUpForm from '../components/SignUpForm'

function signup() {
  return (
    <div>
        <Head>
        <title>Sign Up</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <SignUpForm/>
    </div>
  )
}

export default signup