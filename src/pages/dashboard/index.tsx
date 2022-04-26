import { GetServerSideProps } from "next"
import { toast } from 'react-toastify';
import Head from "next/head";
import Router from "next/router";
import { parseCookies } from "nookies"
import { useContext, useEffect, useState } from "react"
import { Pagination } from "../../components/pagination";
import { AuthContext } from "../../contexts/AuthContext"
import api from "../../services/api";
import ConverterMinutesToHours from "../../utils/ConverterMinutesToHours";
import styles from './styles.module.scss'
import { CreateTeacherModel } from "../../components/CreateTeacherModel";
import { CreateCourseModal } from "../../components/CreateCourseModal";
import { CreateAnswerModal } from "../../components/CreateAnswerModal";

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
  questions: {
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
  }[]
}

interface PagesProps {
  total: number,
  take: number
}


export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState<CoursesProps[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [modalOpenCreateTeacher, setModalOpenCreateTeacher] = useState(false)
  const [modalOpenCreateCourse, setModalOpenCreateCourse] = useState(false)
  const [modalOpenCreateAnswer, setModalOpenCreateAnswer] = useState(false)
  const [courseSelected, setCourseSelected] = useState<CoursesProps>({} as CoursesProps)
  const [updatePage, setUpdatePage] = useState(false)
  const [pagesProps, setPagesProps] = useState<PagesProps>({
    take: 5,
    total: 0
  })
  useEffect(() => {
    if (user.userType === 'student') {
      Router.push('/teacher/courses')
    }
  }, [user.userType])

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get('/teacher/courses', {
          params: {
            offset: offset
          }
        })

        console.log(response.data.courses)

        const coursesFormated = response.data.courses.map((course: CoursesProps) => {
          return {
            ...course,
            duration: ConverterMinutesToHours(course.durationInMinutes),
            questionsOpen: course.questions.filter(question => question.open === true).length
          }
        })

        setCourses(coursesFormated)
        setPagesProps({
          total: response.data.total,
          take: response.data.take,
        })
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      } catch (error) {
        toast.error('Erro ao carregar dados.')
      }
    }
    loadData()
  }, [offset, updatePage])

  const HandleCourseSlected = (courseData) => {
    setModalOpenCreateAnswer(true)
    setCourseSelected(courseData)
  }

  return (
    <>
      <Head>
        <title>Painel de Controle | Learning Experience Platform</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.actionDiv}>
          <button onClick={() => setModalOpenCreateCourse(true)} >Adicionar Curso</button>
          <button onClick={() => setModalOpenCreateTeacher(true)}>Adicionar Professor</button>
        </div>
        <ul className={styles.ul}>
          {!!courses && courses.map(course =>
            <li key={course.id} onClick={() => HandleCourseSlected(course)}>
              <h1>Curso: {course.title} <span>- {course.duration}</span></h1>
              <p>Perguntas aguardando respostas:  <span>{course.questionsOpen}</span></p>
              {course.questionsOpen > 0 && <p className={styles.alert}>{course.questionsOpen}</p>}
            </li>)}
        </ul>
        <Pagination
          limit={pagesProps.take}
          offset={offset}
          total={pagesProps.total}
          setOffset={setOffset}
        />
      </main>
      {modalOpenCreateTeacher && (
        <CreateTeacherModel
          setModalOpen={setModalOpenCreateTeacher}
        />
      )}
      {modalOpenCreateCourse && (
        <CreateCourseModal
          setModalOpen={setModalOpenCreateCourse}
          setUpdatePage={setUpdatePage}
        />
      )}
      {(modalOpenCreateAnswer && !!courseSelected.id) && (
        <CreateAnswerModal
          setModalOpen={setModalOpenCreateAnswer}
          setUpdatePage={setUpdatePage}
          course={courseSelected}
        />
      )}
    </>

  )
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { 'lxp.token': token } = parseCookies(ctx)

//   if (!token) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       }
//     }
//   }

//   return {
//     props: {}
//   }
// }