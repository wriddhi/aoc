import '../styles/globals.css'
import Header from '../components/Header'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthContextProvider } from '../contexts/authContext'
import { useRouter } from 'next/router'


const noAuthRequired = ['/', '/signup', '/login']

function MyApp({ Component, pageProps }) {

  const router = useRouter()

  return (
    <AuthContextProvider>
      <Header/>
      {noAuthRequired.includes(router.pathname) ?
       (<Component {...pageProps} />) : 
       (<ProtectedRoute><Component {...pageProps} /></ProtectedRoute>)
      }
    </AuthContextProvider>
  )
}

export default MyApp
