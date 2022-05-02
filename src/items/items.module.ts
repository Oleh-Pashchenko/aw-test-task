import { Module } from '@nestjs/common';
import { Web3Module } from 'src/web3/web3.module';
import { ItemsResolver } from './items.resolver';

@Module({
  imports: [Web3Module],
  providers: [ItemsResolver],
})
export class ItemsModule {}
