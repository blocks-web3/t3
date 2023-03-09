import { KmsEthersSigner } from "aws-kms-ethers-signer";
import BigNumber from "bignumber.js";
import * as ethers from "ethers";
import { Session, StsCredentials } from "../auth/AuthContextProvider";

export async function getAddress(
  userId: string,
  credentials: StsCredentials
): Promise<string> {
  const signer = getSignerWithoutConnect(userId, credentials);
  return await signer.getAddress();
}

export async function sendNativeToken(
  session: Session,
  to: string,
  sendWeiValue: ethers.BigNumber
) {
  return await getSigner(session).sendTransaction({
    to,
    value: sendWeiValue,
  });
}

export function getSigner(session: Session) {
  return getSignerWithoutConnect(session.userId, session.credentials).connect(
    getAstarProvider()
  );
}

function toBigNumber(
  value: ethers.BigNumber | string | null | undefined
): BigNumber | null {
  if (!value) {
    return null;
  }
  const number = BigNumber(value.toString());
  return number.isNaN() ? null : number;
}

export function displayValue(
  value: ethers.BigNumber | string | null | undefined,
  defaultValue = "-"
): string {
  const num = toBigNumber(value);
  return num ? num.toFormat() : defaultValue;
}

export function displayEtherFromWei(
  wei: ethers.BigNumber | string | null | undefined,
  defaultValue = "-"
) {
  const num = toBigNumber(wei);
  if (!num) {
    return defaultValue;
  }
  const etherValue = ethers.utils.formatEther(num.toString());
  return displayValue(etherValue);
}

export function etherToWei(
  etherNumber: ethers.BigNumber | string | null | undefined
): ethers.BigNumber | null {
  const num = toBigNumber(etherNumber);
  if (!num) {
    return null;
  }
  return ethers.utils.parseEther(num.toString());
}

function getAstarProvider() {
  return new ethers.providers.JsonRpcProvider(
    import.meta.env.VITE_ALCHEMY_ASTAR_ENDPOINT
  );
}

function getSignerWithoutConnect(userId: string, credentials: StsCredentials) {
  const config = {
    credentials: credentials,
    region: import.meta.env.VITE_REGION,
  };

  return new KmsEthersSigner({
    keyId: `alias/${userId}`,
    kmsClientConfig: config,
  });
}
