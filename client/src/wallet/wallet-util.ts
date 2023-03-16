import { KmsEthersSigner } from "aws-kms-ethers-signer";
import BigNumber from "bignumber.js";
import * as ethers from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { Session, StsCredentials } from "../auth/AuthContext";
import { projectAbi, projectFactoryAbi, t3TokenAbi } from "./abis";

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

type ProjectCreatedEvent = {
  owner: string;
  projectAddress: string;
};

export function createProjectContract(
  session: Session,
  projectId: string,
  requiredToken: number,
  period: number
): Promise<ProjectCreatedEvent> {
  return new Promise((resolve, reject) => {
    const factoryContract = new ethers.Contract(
      import.meta.env.VITE_PROJECT_FACTORY_CONTRACT_ADDRESS,
      projectFactoryAbi,
      getSigner(session)
    );
    const filter = factoryContract.filters.ProjectCreated(
      session.address,
      projectId,
      null
    );
    factoryContract.on(filter, (address, projectId, projectAddress) => {
      console.log("event:", address, projectId, projectAddress);
      resolve({
        owner: address,
        projectAddress: projectAddress,
      });
    });

    try {
      factoryContract.createProject(
        projectId,
        " ", //(説明文はコントラクトに登録するにはかなり長いので登録しない),
        requiredToken,
        period,
        {
          gasLimit: 10000000,
        }
      );
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

export async function t3BalanceOf(
  session: Session,
  address: string
): Promise<number> {
  const contract = new ethers.Contract(
    import.meta.env.VITE_T3_TOKEN_CONTRACT_ADDRESS,
    t3TokenAbi,
    getSigner(session)
  );
  try {
    const balance = (await contract.balanceOf(address)) as ethers.BigNumber;
    return Number(formatEther(balance.toString()));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function voteT3Token(
  session: Session,
  projectAddress: string,
  value: number
) {
  const t3TokenContract = new ethers.Contract(
    import.meta.env.VITE_T3_TOKEN_CONTRACT_ADDRESS,
    t3TokenAbi,
    getSigner(session)
  );
  const wei = parseEther(value.toString());
  await t3TokenContract.approve(projectAddress, wei);
  const contract = new ethers.Contract(
    projectAddress,
    projectAbi,
    getSigner(session)
  );

  try {
    await contract.support(wei, {
      gasLimit: 10000000,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
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
