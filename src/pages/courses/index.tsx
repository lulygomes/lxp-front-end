import { GetServerSideProps } from "next"
import Head from "next/head";
import { useEffect, useState } from "react";
import { Pagination } from "../../components/pagination";
import api from "../../services/api"
import ConverterMinutesToHours from "../../utils/ConverterMinutesToHours";

import styles from './styles.module.scss'

interface CoursesProps {
  id: string;
  title: string;
  durationInMinutes: number,
  duration: string;
  teacher: {
    id: string,
    name: string
  }
}

interface PagesProps {
  total: number,
  take: number
}



export default function Courses() {
  const [courses, setCourses] = useState<CoursesProps[]>([])
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
      } catch (error) {
        //TODO tratativa de erro
      }
    }
    loadData()
  }, [offset])

  return (
    <>
      <Head>
        <title>Cursos | Learning Experience Platform</title>
      </Head>
      <main className={styles.main}>
        <ul className={styles.ul}>
          {courses.map(course =>
            <li key={course.id}>
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