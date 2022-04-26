import { Dispatch, SetStateAction, useContext } from 'react';
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../contexts/AuthContext';

import api from '../../services/api';
import { Input } from '../Input'
import styles from './styles.module.scss'

interface ModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setUpdatePage: Dispatch<SetStateAction<boolean>>
}

interface CourseData {
  title: string,
  durationInMinutes: number,
}

export function CreateCourseModal({ setModalOpen, setUpdatePage }: ModalProps) {
  const { user } = useContext(AuthContext)
  const { register, handleSubmit } = useForm()

  const handleUserSubmit = async ({ title, durationInMinutes }: CourseData) => {
    try {
      await api.post('/course', {
        title,
        teacherId: user.id,
        durationInMinutes,
      })

      setModalOpen(false)
      setUpdatePage(current => !current)
      toast.success("Cadastro realizado com sucesso")
    } catch (err) {

      toast.error(err.response.data.error)
    }
  }
  return (
    <div className={styles.modalBackground}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(handleUserSubmit)}>
          <h1>Cadastro de Curso.</h1>
          <Input
            register={register}
            placeholder='Nome do Curso'
            type="text"
            name="title"
            id="title"
          />
          <Input
            register={register}
            placeholder='Duração em Minutos'
            type="number"
            name="durationInMinutes"
            id="durationInMinutes"
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