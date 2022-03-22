export interface ParamsCore {
  module: "account";
  apikey: string;
}

export interface ParamsOptions {
  action: "txlist" | "tokentx" | "tokennfttx" | 'txlistinternal';
  address?: string;
  contractaddress?: string;
  page?: number;
  offset?: number;
  startblock?: number;
  sort?: "desc" | "asc";
}

export type Params = ParamsOptions & ParamsCore;

export interface TxCore {
  from: string;
  to: string;
  hash: string;
  timeStamp: string;
  value: string;
}

export interface Tx extends TxCore {
  contractAddress: string;
}

export interface Transaction extends TxCore {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  transactionIndex: string;
  input: string;
  isError: string;
  txreceipt_status: string;
  nonce: string;
}

interface TokenCore extends Transaction {
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
}

export interface TransactionERC20 extends TokenCore {
  value: string;
}

export interface TransactionERC721 extends TokenCore {
  tokenID: "199";
}
