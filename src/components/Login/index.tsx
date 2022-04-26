import { useContext } from 'react'
import styles from './styles.module.scss'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../contexts/AuthContext'
import Router from 'next/router'

export function Login() {
  const { register, handleSubmit } = useForm()
  const { singIn } = useContext(AuthContext);



  const handleSignIn = async (data) => {
    try {
      const user = await singIn(data)
      console.log(user);
      if (user.userType === 'teacher' || user.userType === 'adm') {
        Router.push('/dashboard')
        return;
      }

      Router.push('/courses')
    } catch (err) {
      // TODO Tratativa de erro
      console.log(err.response.data.err)
    }
  }

  return (
    <form
      className={styles.main}
      onSubmit={handleSubmit(handleSignIn)}
    >

      <input
        {...register("email")}
        name="email"
        type="email"
        placeholder="Email"
      />
      <input
        {...register("password")}
        name="password"
        type="password"
        placeholder="Senha"
      />
      <button type='submit'>Entrar</button>
      <div />
      <a href="#">Criar uma conta</a>
    </form>
  )
}