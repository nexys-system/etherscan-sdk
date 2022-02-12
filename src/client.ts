import fetch from "node-fetch";

const apikey = "";

import * as T from "./type";

const hostEtherscan = "https://api.etherscan.io/api";

// MOONEY
//const address = '0x2b837d661b9382a67a197ce9074d7788be3edf79';

class Client {
  apikey: string;
  host: string;
  constructor(apikey: string, host: string = hostEtherscan) {
    this.apikey = apikey;
    this.host = host;
  }

  getPreParams = (): Omit<T.Params, "address"> => ({
    module: "account",
    action: "tokentx",
    sort: "asc",
    apikey: this.apikey,
  });

  getParams = (options: T.ParamsOptions): T.Params => ({
    ...this.getPreParams(),
    ...options,
  });

  req = async (options: T.ParamsOptions) => {
    //console.log(options);
    if (!options.address && !options.contractaddress) {
      throw Error("either address or contract address must be given");
    }
    const params = this.getParams(options);
    //console.log(params);
    const url =
      this.host +
      "?" +
      Object.entries(params)
        .map(([k, v]) => [k, encodeURIComponent(v)].join("="))
        .join("&");

    const response = await fetch(url);

    if (response.status !== 200) {
      throw Error("something went wrong while querying");
    }

    const { result } = await response.json();

    if (
      JSON.stringify(result) ===
      '["M","a","x"," ","r","a","t","e"," ","l","i","m","i","t"," ","r","e","a","c","h","e","d"]'
    ) {
      throw Error("max limit reached");
    }

    return result;
  };

  getTokenTx = async <A extends T.Transaction>(
    options: T.ParamsOptions,
    result: any[] = []
  ): Promise<A[]> => {
    const r = await this.req(options);
    const ir = [...r, ...result];

    const length = r.length;

    if (length < 10000) {
      return ir;
    }

    const { blockNumber } = r[length - 1];

    return this.getTokenTx({ ...options, startblock: blockNumber }, ir);
  };

  getTokenSupply = async (
    contractaddress: string
  ): Promise<{ message: string; result: string; status: string }> => {
    const paramsIn = {
      module: "stats",
      action: "tokensupply",
      contractaddress,
    };

    //const key = Object.entries(paramsIn)
    //  .map(([k, v]) => [k, v].join("-"))
    //  .join("&");

    const apikey = this.apikey;

    const url =
      this.host +
      "?" +
      Object.entries({ ...paramsIn, apikey })
        .map(([k, v]) => [k, encodeURIComponent(v)].join("="))
        .join("&");

    const r = await fetch(url);
    return r.json();
  };

  getBalances = async (addresses: string[]) => {
    const apikey = this.apikey;
    const url =
      this.host +
      "?" +
      Object.entries({
        module: "account",
        action: "balancemulti",
        address: addresses.join(","),
        tag: "latest",
        apikey,
      })
        .map(([k, v]) => [k, encodeURIComponent(v)].join("="))
        .join("&");

    const r = await fetch(url);
    const { result }: { result: { account: string; balance: string }[] } =
      await r.json();

    const balances: { [address: string]: string } = {};

    result.map(({ balance, account }) => {
      balances[account] = balance;
    });

    return balances;
  };
}

export default Client;
