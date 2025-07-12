import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor'
import { TransformInterceptor } from './shared/interceptor/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field ko dc khai báo decorator trong DTO

      forbidNonWhitelisted: true, // Nếu có field ko dc khai báo trong DTO mà client truyền lên thì sẽ báo lỗi

      transform: true, // Tự động chuyển đổi dữ liệu sang kiểu dc khai báo trong DTO

      transformOptions: {
        enableImplicitConversion: true,
      },

      // Takes an array of the validation errors and returns an exception object to be thrown.
      exceptionFactory: (validationErrors: ValidationError[]) => {
        console.log(validationErrors)
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints as any).join(', '),
          })),
        )
      },
    }),
  )

  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
