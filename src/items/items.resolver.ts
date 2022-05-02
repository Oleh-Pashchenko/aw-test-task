import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Args,
  ResolveField,
  Mutation,
} from '@nestjs/graphql';
import {
  MethodNotAllowedException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { UserIdArgs } from './args/user-id.args';
import { Item } from './models/item.model';
import { CreateItemInput } from './dto/createItem.input';
import { BuyItemInput } from './dto/buyItem.input';
import { Web3Service } from 'src/web3/web3.service';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(
    private readonly web3Service: Web3Service,
    private prisma: PrismaService
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Item)
  async createItem(
    @UserEntity() user: User,
    @Args('data') data: CreateItemInput
  ) {
    await this.web3Service.mintItem(
      user.wallet,
      data.tokenId,
      data.amount,
      this.web3Service.toWei(data.price)
    );

    const newItem = this.prisma.item.create({
      data: {
        name: data.title,
        price: data.price,
        ownerId: user.id,
        tokenId: data.tokenId,
        amount: data.amount,
      },
    });
    return newItem;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Item)
  async buyItem(@UserEntity() user: User, @Args('data') data: BuyItemInput) {
    const item = await this.prisma.item.findUnique({
      select: { id: true, price: true, owner: true, tokenId: true },
      where: {
        id: data.id,
      },
    });

    const itemPrice = item.price * data.amount;

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.owner.id === user.id) {
      throw new MethodNotAllowedException("You can't buy from yourself");
    }

    await this.web3Service.setApprovalForAll(item.owner.wallet, user.wallet);
    const value = this.web3Service.toWei(itemPrice);
    await this.web3Service.buyItem(
      user.wallet,
      item.owner.wallet,
      item.tokenId,
      data.amount,
      value
    );
    // Race-condition preventing
    await this.prisma.$transaction(async (prisma) => {
      const buyer = await this.prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: itemPrice } },
      });

      if (buyer.balance <= 0) {
        throw new MethodNotAllowedException('Not enoght balance');
      }

      prisma.user.update({
        where: { id: item.owner.id },
        data: {
          balance: { increment: itemPrice },
        },
      });
    });

    return item;
  }

  @Query(() => [Item])
  async items() {
    return this.prisma.item.findMany();
  }

  @Query(() => [Item])
  userItems(@Args() id: UserIdArgs) {
    return this.prisma.item.findMany({
      where: {
        owner: { id: id.userId },
      },
    });
  }

  @ResolveField('owner')
  async owner(@Parent() item: Item) {
    return this.prisma.item.findUnique({ where: { id: item.id } }).owner();
  }
}
