import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginBodyDTO, RegisterBodyDto } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly PrismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyDto) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password)

      const user = await this.PrismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
      })

      return user
    } catch (error) {
      console.error(error.meta)
      if (error.code === 'P2002') {
        throw new ConflictException('Email đã tồn tại')
      }

      throw error
    }
  }

  async login(body: LoginBodyDTO) {
    try {
      const user = await this.PrismaService.user.findUnique({
        where: {
          email: body.email,
        },
      })

      if (!user) {
        throw new UnauthorizedException('Tài khoản không tồn tại!')
      }

      const isPasswordMatch = await this.hashingService.compare(body.password, user.password)

      if (!isPasswordMatch) {
        throw new UnprocessableEntityException([
          {
            field: 'password',
            error: 'Password is incorrect',
          },
        ])
      }

      const tokens = await this.generateTokens({ userId: user.id })

      return tokens
    } catch (error) {
      console.error(error.meta)
      if (error.code === 'P2002') {
        throw new ConflictException('Email đã tồn tại')
      }

      throw error
    }
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)

    await this.PrismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiredAt: new Date(decodedRefreshToken.exp * 1000),
      },
    })

    return { accessToken, refreshToken }
  }
}
