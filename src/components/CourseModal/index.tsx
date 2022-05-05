import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../services/api';
import styles from './styles.module.scss'

interface ModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  courseData: CourseData;
  setUpdatePage: Dispatch<SetStateAction<boolean>>
}

interface CourseData {
  id: string,
  title: string,
  durationInMinutes: number,
  duration: string,
  teacher: {
    id: string,
    name: string
  }
  questions: {
    id: string,
    text: string,
    student: {
      id: string,
      name: string,
    },
    answers: {
      id: string,
      text: string,
    }[]
  }[]
}

export function CourseModal({ setModalOpen, courseData, setUpdatePage }: ModalProps) {
  const { register, handleSubmit } = useForm()

  const handleQuestionSubmit = async ({ text }) => {
    if (!text) toast.error('Digite algo na sua pergunta.')
    try {
      await api.post('/course/question', {
        courseId: courseData.id,
        text
      })

      toast.success('Pergunta cadastrada com sucesso')
      setUpdatePage(current => !current)
      setModalOpen(false)
    } catch (err) {
      toast.error(err.response.data.error)
    }
  }
  return (
    <div className={styles.modalBackground}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Perguntas</h1>
          <p className={styles.subTitle}>Envie até 2 perguntas por curso.</p>
          <hr />
          <div className={styles.courseInfo}>
            <p>Curso: <span>{courseData.title}</span> - Duração <span>{courseData.duration}Hrs</span></p>
            <p>Professor: <span>{courseData.teacher.name}</span></p>
          </div>
          <ul>
            <h2>Perguntas</h2>
            {courseData.questions.map(question => {
              return (
                <li key={question.id}>
                  <p>{question.student.name} pergunta: </p>
                  <p>{question.text}</p>
                  {question.answers.map(anser =>
                    <p key={anser.id}>
                      <span>Resposta: </span> {anser.text}
                    </p>)}
                </li>
              )
            })}
          </ul>

          <form className={styles.form} onSubmit={handleSubmit(handleQuestionSubmit)}>
            <textarea
              {...register('text')}
              name="text"
              id="text"
              cols={30} rows={5}
              placeholder="Digite sua pergunta aqui..."
            >
            </textarea>

            <button type="submit">Perguntar</button>
          </form>
        </div>
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