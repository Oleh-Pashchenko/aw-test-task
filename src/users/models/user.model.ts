import { ObjectType, HideField } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Item } from 'src/items/models/item.model';

@ObjectType()
export class User extends BaseModel {
  email: string;
  name: string;
  address: string;
  wallet: string;

  items: Item[];
}
