import { Body, Controller, Post, SerializeOptions } from '@nestjs/common'
import { RegisterBodyDto, RegisterResDTO } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResDTO })
  @Post('register')
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }
}
