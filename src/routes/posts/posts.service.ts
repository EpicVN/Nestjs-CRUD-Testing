import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreatePostBodyDTO, UpdatePostBodyDTO } from './post.dto'
import { isNotFoundPrismaError } from 'src/shared/helpers'

@Injectable()
export class PostsService {
  constructor(private readonly PrismaService: PrismaService) {}

  getPosts(userId: number) {
    return this.PrismaService.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
      },
    })
  }

  createPost(userId: number, body: CreatePostBodyDTO) {
    return this.PrismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
      },
    })
  }

  async getPost(postId: number) {
    try {
      const post = await this.PrismaService.post.findUniqueOrThrow({
        where: {
          id: postId,
        },
        include: {
          author: {
            omit: {
              password: true,
            },
          },
        },
      })

      return post
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }

  async updatePost({ postId, userId, body }: { postId: number; userId: number; body: UpdatePostBodyDTO }) {
    try {
      const updatePost = await this.PrismaService.post.update({
        where: {
          id: postId,
          authorId: userId,
        },
        data: {
          title: body.title,
          content: body.content,
        },
        include: {
          author: {
            omit: {
              password: true,
            },
          },
        },
      })

      return updatePost
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }

  async deletePost({ postId, userId }: { postId: number; userId: number }) {
    try {
      await this.PrismaService.post.delete({
        where: {
          id: postId,
          authorId: userId,
        },
      })

      return true
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }
}
