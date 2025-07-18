import { Exclude, Expose } from 'class-transformer'
import { IsEmail, IsString, Length } from 'class-validator'
import { Match } from 'src/shared/decorators/custom-validator.decorator'

export class LoginBodyDTO {
  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @Length(6, 20, { message: 'Mật khẩu phải từ 6 đến 20 kí tự' })
  password: string
}

export class LoginResDTO {
  accessToken: string
  refreshToken: string

  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial)
  }
}

export class RegisterBodyDto extends LoginBodyDTO {
  @IsString({ message: 'Tên phải là chuỗi' })
  name: string

  @IsString()
  @Match('password', { message: 'Mật khẩu không khớp' })
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

export class RefreshTokenBodyDTO {
  @IsString()
  refreshToken: string
}

export class RefreshTokenResDTO extends LoginResDTO {}

export class LogoutBodyDTO extends RefreshTokenBodyDTO {}

export class LogoutResDTO {
  message: string

  constructor(partial: Partial<LogoutResDTO>) {
    Object.assign(this, partial)
  }
}
