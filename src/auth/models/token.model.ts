import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJWT } from 'graphql-scalars';

@ObjectType()
export class Token {
  @Field(() => GraphQLJWT)
  accessToken: string;

  @Field(() => GraphQLJWT)
  refreshToken: string;
}
