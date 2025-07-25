import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import envConfig from '../config'

@Injectable()
export class APIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const xAPIKey = request.headers['x-api-key']

    if (xAPIKey !== envConfig.SECRET_API_KEY) {
      throw new UnauthorizedException('Invalid api key')
    }

    return true
  }
}
