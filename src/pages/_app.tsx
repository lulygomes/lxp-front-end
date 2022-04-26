import { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from '../components/Header'
import { AuthProvider } from '../contexts/AuthContext'
import "../styles/global.scss"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
      <ToastContainer />
    </AuthProvider>
  )
}

export default MyApp
