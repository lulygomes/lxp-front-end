import Head from "next/head";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { Login } from "../components/Login";
import { SingUpModal } from "../components/SingUpModal";
import { AuthContext } from "../contexts/AuthContext";
import styles from './Home.module.scss'

export default function Home() {
  const { user } = useContext(AuthContext)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (user?.userType != 'student') Router.push('/dashboard')
    if (user?.userType === 'student') Router.push('/courses')
  }, [user?.userType])

  return (
    <>
      <Head>
        <title>Learning Experience Platform</title>
      </Head>
      {modalOpen && <SingUpModal setModalOpen={setModalOpen} />}
      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <span>Bem-vindo!!</span>
          <h1>Learning Experience Platform</h1>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
          <p>Doloremque consequuntur, rerum aliquid maxime</p>
          <p>Nisi voluptas voluptates dolor laboriosam?</p>
        </section>
        <section>
          <Login setModalOpen={setModalOpen} />
        </section>
      </main>
    </>
  )
}
