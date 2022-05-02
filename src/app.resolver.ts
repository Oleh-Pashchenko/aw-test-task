import { Resolver, Query, Args } from '@nestjs/graphql';

@Resolver()
export class AppResolver {

  /*
    Just a Server Time in MS :)
  */
  @Query(() => Number)
  time(): number {
    return +new Date();
  }
}
