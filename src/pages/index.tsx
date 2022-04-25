import Head from "next/head";
import { Login } from "../components/Loging";
import styles from './styles/Home.module.scss'

export default function Home() {
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
          <Login/>
        </section>
      </main>
    </>
  )
}
