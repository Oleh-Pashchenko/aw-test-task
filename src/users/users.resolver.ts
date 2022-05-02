import { PrismaService } from 'nestjs-prisma';
import { Resolver, Parent, ResolveField, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { UserPrivate } from './models/userPrivate.model';
import { User } from './models/user.model';
import { UserEntity } from 'src/common/decorators/user.decorator';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(private prisma: PrismaService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserPrivate)
  async me(@UserEntity() user: User) {
    return this.prisma.user.findUnique({ where: { id: user.id } });
  }

  @ResolveField('items')
  items(@Parent() owner: User) {
    return this.prisma.user.findUnique({ where: { id: owner.id } }).items();
  }
}
