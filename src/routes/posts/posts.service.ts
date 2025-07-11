/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common'
import envConfig from 'src/shared/services/config';
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly PrismaService: PrismaService) {}

  getPosts() {
    return this.PrismaService.post.findMany({})
  }

  createPost(body: any) {
    const userId = 1;

    return this.PrismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    })
  }

  getPost(id: string) {
    return `Post ${id}`
  }

  updatePost(id: string, body: any) {
    return `Updated post ${id}`
  }

  deletePost(id: string) {
    return `Delete Post ${id}`
  }
}
