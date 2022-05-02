import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3Type from 'web3';
import { Contract } from 'web3-eth-contract';
import itemAbi from '../common/abis/item';
import { TransactionReceipt } from 'web3-core';

const Web3 = require('Web3');

@Injectable()
export class Web3Service {
  public readonly itemContract: Contract;

  private readonly web3: Web3Type;

  constructor(private readonly configService: ConfigService) {
    this.web3 = new Web3(this.configService.get('MUMBAI_URL'));

    this.itemContract = new this.web3.eth.Contract(
      itemAbi,
      this.configService.get('ITEM_CONTRACT_ADDRESS')
    );
  }

  async getBalance(address: string): Promise<number> {
    const balance = await this.getBalanceInEth(address);

    return Number(balance);
  }

  fromWei(value: number): number {
    return Number(this.web3.utils.fromWei(value.toString()));
  }

  toWei(value: number): string {
    return this.web3.utils.toWei(value.toString());
  }

  waitForHash(signedTx: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.web3.eth
        .sendSignedTransaction(signedTx)
        .once('transactionHash', (hash: string) => {
          resolve(hash);
        });
    });
  }

  private getRawBalance(address: string): Promise<string> {
    return this.web3.eth.getBalance(address);
  }

  private async getBalanceInEth(address: string): Promise<string> {
    const balance = await this.getRawBalance(address);

    return this.web3.utils.fromWei(balance);
  }

  async mintItem(
    wallet: string,
    tokenId: number,
    amount: number,
    price: string
  ): Promise<TransactionReceipt> {
    const tx = this.itemContract.methods.mint(wallet, tokenId, amount, price);
    const data = tx.encodeABI();
    const [gas, gasPrice, nonce, networkId] = await Promise.all([
      tx.estimateGas({ from: wallet }),
      this.web3.eth.getGasPrice(),
      this.web3.eth.getTransactionCount(wallet),
      this.web3.eth.net.getId(),
    ]);

    const signedTx = await this.web3.eth.accounts.signTransaction(
      {
        to: this.itemContract.options.address,
        data,
        gas,
        gasPrice,
        nonce,
        chainId: networkId,
      },
      this.configService.get('ACCOUNT_1_PRIVATE_KEY')
    );
    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }

  async setApprovalForAll(
    owner: string,
    buyer: string
  ): Promise<TransactionReceipt> {
    const tx = this.itemContract.methods.setApprovalForAll(buyer, true);
    const data = tx.encodeABI();
    const [gas, gasPrice, nonce, networkId] = await Promise.all([
      tx.estimateGas({ from: owner }),
      this.web3.eth.getGasPrice(),
      this.web3.eth.getTransactionCount(owner),
      this.web3.eth.net.getId(),
    ]);

    const signedTx = await this.web3.eth.accounts.signTransaction(
      {
        to: this.itemContract.options.address,
        data,
        gas,
        gasPrice,
        nonce,
        chainId: networkId,
      },
      this.configService.get('ACCOUNT_1_PRIVATE_KEY')
    );
    return await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }

  async buyItem(
    spender: string,
    owner: string,
    tokenId: number,
    amount: number,
    value: string
  ): Promise<TransactionReceipt> {
    const tx = this.itemContract.methods.buyItem(owner, tokenId, amount);
    const data = tx.encodeABI();
    // const gas = await tx.estimateGas({ from: spender });
    const gasPrice = await this.web3.eth.getGasPrice();
    const nonce = await this.web3.eth.getTransactionCount(spender);
    const networkId = await this.web3.eth.net.getId();

    const signedTx = await this.web3.eth.accounts.signTransaction(
      {
        to: this.itemContract.options.address,
        data,
        gas: 100000,
        gasPrice,
        nonce: nonce,
        from: spender,
        value,
        chainId: networkId,
      },
      this.configService.get('ACCOUNT_2_PRIVATE_KEY')
    );

    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }
}
