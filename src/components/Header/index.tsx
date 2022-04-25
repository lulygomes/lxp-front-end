import styles from './styles.module.scss'
export function Header() {
  return (
    <header className={styles.headerContainer}>
      <h1>LXP</h1>
      <nav>
        <a href="#">Início</a>
        <a href="#">Cursos</a>
        <a className={styles.login} href="/">Entrar</a>
        <a className={styles.exit} href="/courses">Sair</a>
      </nav>
    </header>
  )
}