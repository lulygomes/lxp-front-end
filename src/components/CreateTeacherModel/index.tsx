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

export function CreateTeacherModel({ setModalOpen }: ModalProps) {
  const { register, handleSubmit } = useForm()

  const handleUserSubmit = async ({ name, email, password }: UserData) => {
    try {
      await api.post('/teacher', {
        name,
        email,
        password
      })

      setModalOpen(false)
      toast.success("Cadastro realizado com sucesso")
    } catch (err) {

      toast.error(err.response.data.message)
    }
  }
  return (
    <div className={styles.modalBackground}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(handleUserSubmit)}>
          <h1>Cadastro de Professor.</h1>
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