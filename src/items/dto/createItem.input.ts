import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateItemInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field(() => Float)
  @IsNotEmpty()
  price: number;

  @Field()
  @IsNotEmpty()
  tokenId: number;

  @Field()
  @IsNotEmpty()
  amount: number;
}
