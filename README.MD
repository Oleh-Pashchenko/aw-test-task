# AW-TEST-TASK

To simulate MetaMask I've created two wallets and set them private keys on .env to be able to sign transactions. One of them will be the seller, and another one buyer.

**_Please use the wallets from the examples below._**

You can import thee wallets by PK in metamask to check the balance or use [polygonscan](https://mumbai.polygonscan.com/)

# How to up

`docker-compose up -d`

# How to test

#### Register first user and remember his accesToken:

- Kil'jaeden will be owner/seller of item

```graphql
mutation signup {
  signup(
    data: {
      email: "test1@test.com"
      name: "Kil'jaeden"
      password: "12345678"
      wallet: "0xe6c61E38d328670b0F2917E63A62Df8Bc908cf15"
    }
  ) {
    accessToken
  }
}
```

#### Use accessToken in HTTP HEADERS tab like this

```JSON
{
   "Authorization": "Bearer ACCESS_TOKEN_HERE"
}
```

#### You can check current balance by ME query:

- Balance is came from blockchain

```graphql
query {
  me {
    balance
  }
}
```

#### Then create an Item to sale

- Price in Eth(Matic in this case)
- Token Id is the id that will be used for NFT in blockchain
- Amount default 1 to make it simple but in ERC1155 we can create a few same items for example Healing Potion but Frostmourne only one.

```graphql
mutation {
  createItem(
    data: { price: 0.5, title: "Frostmourne", tokenId: 1, amount: 1 }
  ) {
    id
  }
}
```

#### Waiting for a transaction will done succsessfully

Check the **mint** transaction [here](https://mumbai.polygonscan.com/address/0xcF036580255aAE06A4fa4B30E585B38503Ea6E9a)

### Check the balance of users NFT

Go to the [readProxyContract](https://mumbai.polygonscan.com/address/0xcF036580255aAE06A4fa4B30E585B38503Ea6E9a#readProxyContract) tab and use the `balanceOf` method by providing wallet and token id.

You should see the one item owned by this wallet.

**_Also you can check the user balance of Matic_**

### Register second user and remember his accesToken:

- Arthas will be buyr of Frostmourne

```graphql
mutation {
  signup(
    data: {
      email: "arthas@test.com"
      name: "Arthas"
      password: "123456"
      wallet: "0xB77D7Ef48b1891E3C01F52e43D0c32C1432a03CE"
    }
  ) {
    accessToken
  }
}
```

#### Request all items avaliable for sale

```graphql
query {
  items {
    id
    name
    price
    owner {
      id
      name
    }
  }
}
```

#### Use one item.id from previous request to buy an item

```graphql
mutation {
  buyItem(data: { id: "8473bb75-ad04-4743-9b6c-d678f07e4cbe", amount: 1 }) {
    id
  }
}
```

### Then recheck ownership of token in polygonscan and uses wallet balances.
