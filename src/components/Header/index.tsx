import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import styles from './styles.module.scss'
export function Header() {
  const { user, singOut } = useContext(AuthContext)

  return (
    <header className={styles.headerContainer}>
      <h1>LXP</h1>
      <nav>
        <Link href="/">Início</Link>
        <Link href="/courses">Cursos</Link>
        {(user?.userType === 'teacher'
          || user?.userType === "adm"
        ) && (
            <Link href="/dashboard">
              <a className={styles.dashboard} >Dashboard</a>
            </Link>
          )}
        {!!user.name && (
          <button className={styles.exitButton} onClick={singOut}>
            Sair
          </button>
        )}
      </nav>
    </header>
  )
}