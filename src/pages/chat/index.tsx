import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'
import { AuthContext } from '../../contexts/AuthContext'
import styles from './styles.module.scss'

let socket = io("http://localhost:3333")

interface ChatUserDTO {
  _id: string,
  email: string,
  name: string,
  user_id: string,
  socket_id: string,
}

interface ChatMessageDTO {
  _id: string;
  from: ChatUserDTO;
  text: String;
  created_at: Date;
  roomId: String;
}

export default function Chat() {
  const { user } = useContext(AuthContext)
  const [usersList, setUsersList] = useState<ChatUserDTO[]>([])
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<ChatMessageDTO[]>([])
  const [idChatRoom, setIdChatRoom] = useState('')
  const messagesEndRef = useRef(null)
  const router = useRouter()

  useEffect(() => {

    if (!!user.id) {
      socket.emit("start", {
        email: user.email,
        name: user.name,
        user_id: user.id
      })
      socket.emit("get_users", (users: ChatUserDTO[]) => {
        users.forEach(newUser => {
          const existInList = usersList.find(userInlist => userInlist.user_id === newUser.user_id)
          if (!existInList && newUser.user_id !== user.id) {
            setUsersList([...usersList, newUser])
          }
        })
      })
    }

  }, [user])

  useEffect(() => {
    socket.on('new_user', (newUser) => {
      const existInList = usersList.find(user => user.user_id === newUser.user_id)
      if (!existInList && newUser.user_id !== user.id) {
        setUsersList([...usersList, newUser])
      }
    })
  }, [user.id, usersList])

  useEffect(() => {
    socket.on
  }, [])

  useEffect(() => {
    socket.on("message", (data => {
      setMessages(current => {
        const messageInList = current.find(msg => msg._id === data._id)
        if (messageInList) {
          return current
        }
        return [...current, data]
      });
      scrollToBottom()
    }))
  }, [])

  const handleSelectUser = useCallback((idUser: string) => {
    setMessages([])
    socket.emit("start_chat", { idUser }, (response) => {
      setIdChatRoom(response.room.idChatRoom)
      setMessages(response.messages)
      scrollToBottom()
    })
  }, [])

  const handldeSendMessage = useCallback(() => {
    const data = {
      message: text,
      idChatRoom
    }

    socket.emit("message", data)

    setText("")

    scroll()

  }, [idChatRoom, text])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  return (
    <main className={styles.container}>
      <div className={styles.menuContent}>
        <ul ref={messagesEndRef} id='message-list'>
          {usersList && (
            usersList.map(user => (
              <li
                key={user.user_id}
                onClick={() => handleSelectUser(user._id)}
              >
                <p>{user.name}</p>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className={styles.chatContent}>
        <div id="chatBox" className={styles.chatBox}>
          <ul>
            {messages && (messages.map(message => (
              <li
                className={user.id === message.from.user_id && styles.myMessage}
                key={message._id} >
                <p>{message.from.name}</p>
                <hr />
                <p>{message.text}</p>
              </li>
            )))}
          </ul>
        </div>
        <div className={styles.chatText}>
          <input
            type="text"
            name="text"
            id="text"
            placeholder='Menssagem'
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handldeSendMessage()}
          />
          <button onClick={handldeSendMessage}>
            Enviar
          </button>
        </div>
      </div>
    </main>
  )
}