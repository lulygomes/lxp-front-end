import { Dispatch, SetStateAction, useContext } from 'react'
import styles from './styles.module.scss'
import { useForm } from 'react-hook-form'
import Router from 'next/router'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../contexts/AuthContext'
import { Input } from '../Input'


interface LoginProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export function Login({ setModalOpen }: LoginProps) {
  const { register, handleSubmit } = useForm()
  const { singIn } = useContext(AuthContext);

  const handleSignIn = async (data) => {
    try {
      const user = await singIn(data)

      if (user.userType === 'teacher' || user.userType === 'adm') {
        Router.push('/dashboard')
        return;
      }

      Router.push('/courses')
    } catch (err) {
      toast.error(err.response.data.err.message)
    }
  }


  return (
    <form
      className={styles.main}
      onSubmit={handleSubmit(handleSignIn)}
    >

      <Input
        register={register}
        name="email"
        type="email"
        placeholder="Email"
      />
      <Input
        register={register}
        name="password"
        type="password"
        placeholder="Senha"
      />
      <button type='submit'>Entrar</button>
      <div />
      <a onClick={() => setModalOpen(true)}>Criar uma conta</a>
    </form>
  )
}