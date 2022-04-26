import { GetServerSideProps } from "next"
import Head from "next/head";
import Router from "next/router";
import { parseCookies } from "nookies"
import { useContext, useEffect, useState } from "react"
import { Pagination } from "../../components/pagination";
import { AuthContext } from "../../contexts/AuthContext"
import api from "../../services/api";
import ConverterMinutesToHours from "../../utils/ConverterMinutesToHours";
import styles from './styles.module.scss'


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
  const [pagesProps, setPagesProps] = useState<PagesProps>({
    take: 5,
    total: 0
  })
  useEffect(() => {
    if (user.userType === 'student') {
      Router.push('/courses')
    }
  }, [])

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get('/teacher/courses', {
          params: {
            offset: offset
          }
        })

        const coursesFormated = response.data.courses.map((course: CoursesProps) => {
          return {
            ...course,
            duration: ConverterMinutesToHours(course.durationInMinutes),
            questionOpen: course.questions.filter(question => question.open === true).length
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
        //TODO tratativa de erro
      }
    }
    loadData()
  }, [offset])

  return (
    <>
      <Head>
        <title>Painel de Controle | Learning Experience Platform</title>
      </Head>
      <main className={styles.main}>
        <ul className={styles.ul}>
          {!!courses && courses.map(course =>
            <li key={course.id}>
              <h1>Curso: {course.title} <span>- {course.duration}</span></h1>
              <p>Esse curso possui <span>{course.questionsOpen}</span> sem resposta</p>
            </li>)}
        </ul>
        <Pagination
          limit={pagesProps.take}
          offset={offset}
          total={pagesProps.total}
          setOffset={setOffset}
        />
      </main>
    </>

  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { 'lxp.token': token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}