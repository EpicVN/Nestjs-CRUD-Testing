import { Exclude } from "class-transformer"

export class UserModel {
  id: number
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
  
  @Exclude()
  password: string
  
  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial)
  }
}
