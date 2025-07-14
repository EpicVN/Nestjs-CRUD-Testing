/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { plainToClass } from 'class-transformer'
import { IsNotEmpty, IsString, validateSync } from 'class-validator'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

config({
  path: '.env',
})

const envPath = path.resolve('.env')

// Kiểm tra có file .env
if (!fs.existsSync(envPath)) {
  console.log('Không tìm thấy file .env')
  process.exit(1)
}

class ConfigSchema {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_SECRET: string

  @IsString()
  @IsNotEmpty()
  ACCESS_TOKEN_EXPIRES_IN: string

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_SECRET: string

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_EXPIRES_IN: string
}

const configServer = plainToClass(ConfigSchema, process.env, {
  enableImplicitConversion: true, // Cho phép ép kiểu khác string ở .env
})

const error = validateSync(configServer)

if (error.length > 0) {
  console.log('Các giá trị khai báo trong file .env không hợp lệ')

  const errors = error.map((errorItem) => {
    return {
      property: errorItem.property,
      constraints: errorItem.constraints,
      value: errorItem.value,
    }
  })

  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw errors
}

const envConfig = configServer

export default envConfig
