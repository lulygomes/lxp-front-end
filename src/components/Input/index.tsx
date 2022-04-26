import { InputHTMLAttributes } from "react"
import { FieldValues, UseFormRegister } from "react-hook-form"
import styles from './styles.module.scss'
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<FieldValues>
}

export function Input({ register, name, ...rest }: InputProps) {
  return (
    <input
      className={styles.input}
      {...rest}
      {...register(name)}
    />
  )
}