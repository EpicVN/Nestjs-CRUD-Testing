import { IsEmail, IsString } from 'class-validator'

export class LoginBodyDTO {
  @IsString()
  @IsEmail()
  email: string

  @IsString()
  password: string
}

export class RegisterBodyDto extends LoginBodyDTO {
  @IsString({message: 'Tên phải là chuỗi' })
  name: string

  @IsString()
  confirmPassword: string
}
