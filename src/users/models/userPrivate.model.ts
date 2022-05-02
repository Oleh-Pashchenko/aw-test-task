import { ObjectType, HideField } from '@nestjs/graphql';
import { User } from './user.model';
import { Item } from 'src/items/models/item.model';

@ObjectType()
export class UserPrivate extends User {
  balance: string;
}
