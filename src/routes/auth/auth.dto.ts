import { Exclude, Expose } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'

export class LoginBodyDTO {
  @IsString()
  @IsEmail()
  email: string

  @IsString()
  password: string
}

export class RegisterBodyDto extends LoginBodyDTO {
  @IsString({ message: 'Tên phải là chuỗi' })
  name: string

  @IsString()
  confirmPassword: string
}

export class RegisterResDTO {
  id: number
  email: string
  name: string
  createdAt: Date
  updatedAt: Date

  @Exclude()
  password: string

  @Expose()
  get emailName() {
    return `${this.email} - ${this.name}`
  }

  constructor(partial: Partial<RegisterResDTO>) {
    Object.assign(this, partial)
  }
}
