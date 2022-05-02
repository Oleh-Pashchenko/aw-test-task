import { expect } from "chai";
import { ethers, waffle } from "hardhat";

describe("Item", function () {
  it("Should create new item", async function () {
    const ITEM_ID = 1;
    const ITEM_AMOUNT = 1;
    const ITEM_PRICE = 10000;

    const [owner] = await ethers.getSigners();

    const Item = await ethers.getContractFactory("Item");
    const item = await Item.deploy();

    await item.deployed();
    await item.initialize();

    await item.mint(owner.address, ITEM_ID, ITEM_AMOUNT, ITEM_PRICE);

    const itemCount = await item.balanceOf(owner.address, ITEM_ID);

    expect(itemCount).to.equal(ITEM_AMOUNT);
  });

  it("Should buy item", async function () {
    try {
      const ITEM_ID = 1;
      const ITEM_AMOUNT = 2;
      const BUYING_AMOUNT = ITEM_AMOUNT - 1;
      const ITEM_PRICE = ethers.utils.parseEther("1").toHexString();
      const [owner, buyer] = await ethers.getSigners();

      const Item = await ethers.getContractFactory("Item");
      const item = await Item.deploy();

      await item.deployed();
      await item.initialize();

      const itemCountOfOwnerItemsBeforMint = await item.balanceOf(
        owner.address,
        ITEM_ID
      );
      const itemCountOfBuyerItemsBeforMint = await item.balanceOf(
        buyer.address,
        ITEM_ID
      );

      expect(itemCountOfOwnerItemsBeforMint).to.equal(0);
      expect(itemCountOfBuyerItemsBeforMint).to.equal(0);

      await item.mint(owner.address, ITEM_ID, ITEM_AMOUNT, ITEM_PRICE);

      const itemCountOfOwnerItemsAfterMint = await item.balanceOf(
        owner.address,
        ITEM_ID
      );

      expect(itemCountOfOwnerItemsAfterMint).to.equal(ITEM_AMOUNT);

      await item.setApprovalForAll(buyer.address, true);

      await item.connect(buyer).buyItem(owner.address, ITEM_ID, BUYING_AMOUNT, {
        value: ITEM_PRICE,
      });

      const itemCountOfOwnerItemsAfterBuying = await item.balanceOf(
        owner.address,
        ITEM_ID
      );
      const itemCountOfBuyerItemsAfterBuying = await item.balanceOf(
        buyer.address,
        ITEM_ID
      );

      expect(itemCountOfOwnerItemsAfterBuying).to.equal(
        ITEM_AMOUNT - BUYING_AMOUNT
      );
      expect(itemCountOfBuyerItemsAfterBuying).to.equal(BUYING_AMOUNT);
    } catch (error) {
      console.log(error);
    }
  });
});
