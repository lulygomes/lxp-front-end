import { toast } from 'react-toastify';
import { GetServerSideProps } from "next"
import Head from "next/head";
import { useCallback, useContext, useEffect, useState } from "react";
import { Pagination } from "../../components/pagination";
import api from "../../services/api"
import ConverterMinutesToHours from "../../utils/ConverterMinutesToHours";

import styles from './styles.module.scss'
import { AuthContext } from '../../contexts/AuthContext';
import { CourseModal } from '../../components/CourseModal';

interface CoursesProps {
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
    ansers: {
      id: string,
      text: string,
    }[]
  }[]
}

interface PagesProps {
  total: number,
  take: number
}

export default function Courses() {
  const { isAuthenticated } = useContext(AuthContext)
  const [courses, setCourses] = useState<CoursesProps[]>([])
  const [courseSelected, setCourseSelected] = useState<CoursesProps | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [updatePage, setUpdatePage] = useState(false)
  const [offset, setOffset] = useState<number>(0)
  const [pagesProps, setPagesProps] = useState<PagesProps>({
    take: 5,
    total: 0
  })

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get('/course', {
          params: {
            offset: offset
          }
        })

        const coursesFormated = response.data.courses.map(course => {
          return {
            ...course,
            duration: ConverterMinutesToHours(course.durationInMinutes)
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
      } catch (e) {
        console.log(e.response)
      }
    }
    loadData()
  }, [offset, updatePage])


  const handleOpenCourse = (courseData: CoursesProps) => {
    if (!isAuthenticated) {
      toast.error('Realize o login na tela inicial, para ter acesso às perguntas.')
      return
    }
    setCourseSelected(courseData)
    setModalOpen(true)


  }


  return (
    <>
      <Head>
        <title>Cursos | Learning Experience Platform</title>
      </Head>
      <main className={styles.main}>
        <ul className={styles.ul}>
          {courses.map(course =>
            <li key={course.id} onClick={() => handleOpenCourse(course)}>
              <h1>Curso: {course.title} <span>- {course.duration}</span></h1>
              <p>Profesor: <span>{course.teacher.name}</span></p>
            </li>)}
        </ul>
        <Pagination
          limit={pagesProps.take}
          offset={offset}
          total={pagesProps.total}
          setOffset={setOffset}
        />
      </main>
      {(modalOpen && !!courseSelected) && (
        <CourseModal
          setModalOpen={setModalOpen}
          courseData={courseSelected}
          setUpdatePage={setUpdatePage}
        />
      )}
    </>
  )
}

export const getStaticProps: GetServerSideProps = async () => {
  const { data } = await api.get('/course')

  return {
    props: {
      courses: data
    }
  }
}