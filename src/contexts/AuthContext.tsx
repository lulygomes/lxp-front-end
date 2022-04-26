import { createContext, useEffect, useState } from "react";
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import api from "../services/api";
import Router from "next/router";



interface SignInData {
  email: string,
  password: string,
}

interface UserData {
  id: string,
  name: string,
  email: string,
  userType: string
}

interface AuthContextType {
  user: UserData,
  isAuthenticated: boolean;
  singIn: (data: SignInData) => Promise<UserData>
  singOut: () => void
}


export const AuthContext = createContext({} as AuthContextType);



export function AuthProvider({ children }) {
  const [user, setUser] = useState<UserData>({} as UserData)
  const isAuthenticated = !!user

  useEffect(() => {
    const { 'lxp.token': token } = parseCookies()

    if (token) {
      api.get('/session')
        .then(response => setUser(response.data.user))
    }
  }, [])


  async function singIn({ email, password }: SignInData): Promise<UserData> {
    const response = await api.post('/session', {
      email,
      password
    })

    setCookie(undefined, 'lxp.token', response.data.token, {
      maxAge: 60 * 60 * 1 // 1 hora
    })

    api.defaults.headers['Authorization'] = `Bearer ${response.data.token}`

    setUser(response.data.user)

    return (response.data.user)
  }

  async function singOut() {
    destroyCookie(undefined, 'lxp.token')
    setUser({} as UserData);
    Router.push('/')
  }
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, singIn, singOut }}>
      {children}
    </AuthContext.Provider>
  )
}