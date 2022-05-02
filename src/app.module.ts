import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AppResolver } from './app.resolver';

import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';

import config from 'src/common/configs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLConfigService } from './graphql-config.service';
import { Web3Module } from './web3/web3.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),

    PrismaModule.forRoot({ isGlobal: true }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphQLConfigService,
    }),

    AuthModule,
    UsersModule,
    ItemsModule,
    Web3Module,
  ],
  providers: [AppResolver],
})
export class AppModule {}
