import { Body, Controller, Post } from '@nestjs/common'
import { RegisterBodyDto, RegisterResDTO } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @SerializeOptions({ type: RegisterResDTO })
  @Post('register')
  async register(@Body() body: RegisterBodyDto) {
    return new RegisterResDTO(await this.authService.register(body))
  }
}
