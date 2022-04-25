import { useCallback, useState } from 'react'
import api from '../../services/api'
import styles from './styles.module.scss'

export function Login()
{
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = useCallback(async () => {
    try {
      const resp = await api.post('/session', {
        email,
        password
      })

      console.log(resp)
    } catch (err) {
      console.log(err.response.data.err)
    }
  },[email, password])

  return(
    <main className={styles.main}>
      <input 
      type="text" 
      placeholder="Email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
     />
      <button onClick={handleSubmit}>Entrar</button>
      <div/>
      <a href="#">Criar uma conta</a>
    </main>
  )
}