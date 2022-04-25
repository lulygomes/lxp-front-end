import { NextApiRequest, NextApiResponse} from 'next'
import api from '../../services/api'

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const courses = await api.get('course');

  return response.json(courses.data)
}