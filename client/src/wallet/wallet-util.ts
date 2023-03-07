import { KmsEthersSigner } from "aws-kms-ethers-signer";
import * as ethers from "ethers";
import { StsCredentials } from "../auth/AuthContextProvider";

export async function getAddress(
  userId: string,
  credentials: StsCredentials
): Promise<string> {
  const rpcUrl = "http://localhost:8501";
  const provider = ethers.getDefaultProvider(
    import.meta.env.VITE_ALCHEMY_ASTAR_ENDPOINT
  );
  const keyId = `alias/${userId}`;
  const signer = getSigner(keyId, credentials);
  //   signer.connect(provider);
  return await signer.getAddress();
}

export function getSigner(keyId: string, credentials: StsCredentials) {
  const config = {
    credentials: credentials,
    region: import.meta.env.VITE_REGION,
  };

  return new KmsEthersSigner({
    keyId,
    kmsClientConfig: config,
  });
}
