import Head from "next/head";
import Router from "next/router";
import { useContext, useEffect } from "react";
import { Login } from "../components/Login";
import { AuthContext } from "../contexts/AuthContext";
import styles from './Home.module.scss'

export default function Home() {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user?.userType != 'student') Router.push('/dashboard')
    if (user?.userType === 'student') Router.push('/courses')
  }, [])

  return (
    <>
      <Head>
        <title>Learning Experience Platform</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <span>Bem-vindo!!</span>
          <h1>Learning Experience Platform</h1>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
          <p>Doloremque consequuntur, rerum aliquid maxime</p>
          <p>Nisi voluptas voluptates dolor laboriosam?</p>
        </section>
        <section>
          <Login />
        </section>
      </main>
    </>
  )
}
