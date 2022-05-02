import { Field, Float, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class Item extends BaseModel {
  name: string;
  @Field(() => Float)
  price: number;
  owner: User;
  amount: number;
  tokenId: number;
}
