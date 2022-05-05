import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../contexts/AuthContext';

import api from '../../services/api';
import { Input } from '../Input'
import styles from './styles.module.scss'

interface ModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>,
  setUpdatePage: Dispatch<SetStateAction<boolean>>,
  course: CoursesProps
}

interface AnswerData {
  text: number,
}

interface CoursesProps {
  id: string;
  title: string;
  durationInMinutes: number;
  duration: string;
  questionsOpen: number;
  teacher: {
    id: string;
    name: string;
  },
  questions: QuestionsData[]
}

interface QuestionsData {
  id: string;
  studentId: string;
  courseId: string;
  text: string;
  open: boolean;
  student: {
    id: string;
    name: string;
  }
  answers: {
    id: string,
    text: string,
  }[]
}




export function CreateAnswerModal({ setModalOpen, course, setUpdatePage }: ModalProps) {
  const { register, handleSubmit } = useForm()
  const [questionSelected, setQuestionSelected] = useState({} as QuestionsData)

  const handleAnswerSubmit = async ({ text }: AnswerData) => {
    try {
      if (!questionSelected.id) {
        toast.error('Selecione uma pergunta')
        return
      }
      await api.post('/course/answer', {
        text,
        questionId: questionSelected.id
      })

      setUpdatePage(current => !current)
      setModalOpen(false)
      toast.success("Cadastro realizado com sucesso")
    } catch (err) {

      toast.error(err.response.data.error)
    }
  }

  const handleSelectedQuestion = (question: QuestionsData) => {
    setQuestionSelected(question)
  }

  const handleCloseModal = () => {
    setQuestionSelected({} as QuestionsData)
    setModalOpen(false)
  }
  return (
    <div className={styles.modalBackground}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>{course.title}</h1>
          <p>Duração <span>{course.duration}Hrs</span></p>
          <p>Professor: <span>{course.teacher.name}</span></p>
          <hr />
          <h2>Perguntas</h2>
          <p className={styles.subTitle}>Selecione a pergunta que deseja responder</p>
          <ul className={styles.ul}>
            {course.questions.map(question => {
              return (
                <li
                  className={questionSelected.id === question.id && styles.select}
                  key={question.id}
                  onClick={() => handleSelectedQuestion(question)}
                >

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

          <form className={styles.form} onSubmit={handleSubmit(handleAnswerSubmit)}>
            <textarea
              {...register('text')}
              name="text"
              id="text"
              cols={30} rows={5}
              placeholder="Digite a resposta aqui..."
            >
            </textarea>

            <button type="submit">Responder</button>
          </form>
        </div>
        <button
          onClick={handleCloseModal}
          className={styles.closeButton}
        >
          +
        </button>

      </div>
    </div>
  )
}