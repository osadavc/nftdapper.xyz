import startCase from "lodash.startcase";
import toLower from "lodash.tolower";
import { SmartContractFeatures as ContractFeatures } from "@prisma/client";

type SmartContractFeatures = Omit<ContractFeatures, "id" | "smartContractId">;

interface GenerateSmartContractOptions {
  tokenName: string;
  tokenSymbol: string;
  features: SmartContractFeatures;
  maxSupply: number;
  price?: number;
  saleStartTime?: number;
  maxNumberOfTokens?: number;
}

export const generateSmartContract = ({
  tokenName,
  tokenSymbol,
  features,
  maxSupply,
  price,
  saleStartTime,
  maxNumberOfTokens,
}: GenerateSmartContractOptions) => {
  if (!maxSupply) {
    throw new Error("maxSupply is required");
  }

  if (!price && features.paidMint) {
    throw new Error("Price is required for paid minting");
  }

  if (!saleStartTime && features.saleStartingTime) {
    throw new Error("Sale start time is required for sale");
  }

  if (!maxNumberOfTokens && features.mintMultiple) {
    throw new Error("Max number of tokens is required for max mint count");
  }

  const code = `//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
${
  features.pausable
    ? 'import "@openzeppelin/contracts/security/Pausable.sol";'
    : ""
}

contract ${startCase(toLower(tokenName)).replaceAll(
    " ",
    ""
  )} is ERC721A, Ownable ${features.pausable ? ", Pausable" : ""} {
    
  constructor() ERC721A("${startCase(toLower(tokenName)).replaceAll(
    " ",
    ""
  )}", "${tokenSymbol.toUpperCase()}") {}


  uint256 public maxSupply = ${maxSupply};
  ${features.paidMint ? `uint256 public price = ${price} ether;` : ""}
  ${
    features.saleStartingTime
      ? `uint256 public saleStartingTime = ${new Date(
          saleStartTime!
        ).getTime()};`
      : ""
  }
   ${
     features.mintMultiple
       ? `uint256 public maxMintAmount = ${maxNumberOfTokens};
   `
       : ""
   }
  modifier mintCompliance(${
    features.mintMultiple ? "uint256 _mintAmount" : ""
  }) {
    require(totalSupply() + ${
      features.mintMultiple ? "_mintAmount" : "1"
    } <= maxSupply, "Max supply exceeded!");
    require(tx.origin == msg.sender, "The caller is another contract");

    ${
      features.saleStartingTime
        ? 'require(saleStartingTime < block.timestamp, "Sale has not started yet");'
        : ""
    }
    ${
      features.mintMultiple && features.mintMultiple
        ? `
    require(
      _mintAmount > 0 &&
        _mintAmount <= maxMintAmount &&
        _numberMinted(msg.sender) + _mintAmount <= maxMintAmount,
      "Invalid mint amount!"
    );`
        : ""
    }_;
  }
  ${
    features.paidMint
      ? `
  modifier mintPriceCompliance(uint256 _mintAmount) {
    require(msg.value >= (price * _mintAmount), "Insufficient funds!");
    _;
  }`
      : ""
  }
  ${
    features.pausable
      ? `function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  `
      : ""
  }
  function mint(${features.mintMultiple ? "uint256 _tokenCount" : ""}) public ${
    features.paidMint ? "payable" : ""
  } ${features.pausable ? "whenNotPaused" : ""} mintCompliance(${
    features.mintMultiple ? "_tokenCount" : ""
  }) ${
    features.paidMint
      ? `mintPriceCompliance(${features.mintMultiple ? "_tokenCount" : "1"})`
      : ""
  } {
    _mint(msg.sender, ${features.mintMultiple ? "_tokenCount" : "1"});
  }
  ${
    features.saleStartingTime
      ? `
  function setSaleStartingTime(uint256 _saleStartingTime) external onlyOwner {
    saleStartingTime = _saleStartingTime;
  }
  `
      : ""
  }

  function _startTokenId() internal view virtual override returns (uint256) {
    return 1;
  }

  function withdraw() external payable onlyOwner {
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
  }

}`;

  return { code, name: startCase(toLower(tokenName)).replaceAll(" ", "") };
};
