import { keyStores, connect, Contract } from "near-api-js";
import { TokenMetadata } from "../interface/common";
import getConfig from "../services/config";
const { NODE_URL, walletUrl,  myNearWalletUrl, helperUrl, explorerUrl} = getConfig();
async function connectToNear() {
  const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
  const connectionConfig = {
    networkId: "mainnet",
    keyStore: myKeyStore,
    nodeUrl: `${NODE_URL}`,
    walletUrl: `${walletUrl}`,
    myNearWalletUrl: `${myNearWalletUrl}`,
    helperUrl: `${helperUrl}`,
    explorerUrl: `${explorerUrl}`,
  };
  const nearConnection = await connect(connectionConfig);
  return nearConnection;
}

export async function tokenContract(contractId: string): Promise<any> {
  const nearConnection = await connectToNear();
  const account = await nearConnection.account("");
  const contractObj = new Contract(account, contractId, {
    viewMethods: ["ft_metadata"],
    changeMethods: [],
    useLocalViewExecution: false,
  });
  return contractObj;
}

export async function ftGetTokenMetadata(id: string): Promise<TokenMetadata> {
  const contract = await tokenContract(id);
  const metadata = await contract.ft_metadata({});
  return metadata;
}
