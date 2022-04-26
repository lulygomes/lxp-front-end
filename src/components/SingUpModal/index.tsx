import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../services/api';
import { Input } from '../Input'
import styles from './styles.module.scss'

interface ModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

interface UserData {
  name: string,
  email: string,
  password: string,
}

export function SingUpModal({ setModalOpen }: ModalProps) {
  const { register, handleSubmit } = useForm()

  const handleUserSubmit = async ({ name, email, password }: UserData) => {
    try {
      await api.post('/user', {
        name,
        email,
        password
      })

      setModalOpen(false)
    } catch (err) {

      toast.error(err.response.data.err)
    }
  }
  return (
    <div className={styles.modalBackground}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(handleUserSubmit)}>
          <h1>Crie a sua conta agora!</h1>
          <p>E aproveite o melhor da plataforma.</p>
          <Input
            register={register}
            placeholder='Nome Completo'
            type="text"
            name="name"
            id="name"
          />
          <Input
            register={register}
            placeholder='Email'
            type="email"
            name="email"
            id="email"
          />
          <Input
            register={register}
            placeholder='Senha'
            type="password"
            name="password"
            id="password"
          />

          <button type="submit">Cadastrar</button>
        </form>
        <button
          onClick={() => setModalOpen(false)}
          className={styles.closeButton}
        >
          +
        </button>

      </div>
    </div>
  )
}