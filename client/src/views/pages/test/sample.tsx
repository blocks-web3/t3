import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { CognitoAuthApi } from "../../../auth/auth-api";
import { clearSession, useSession } from "../../../auth/AuthContext";
import {
  displayEtherFromWei,
  etherToWei,
  getSigner,
  sendNativeToken,
} from "../../../wallet/wallet-util";
import { LoadingMask } from "../../components/LoadingMask";

export default function Sample() {
  const { session } = useSession();
  const [balance, setBalance] = useState<BigNumber | null>();
  const [gasPrice, setGasPrice] = useState<BigNumber | null>();
  const [inputToAddress, setInputToAddress] = useState<string>("");
  const [inputSendValue, setInputSendValue] = useState<string>("");

  function onLogout() {
    clearSession();
    location.assign(CognitoAuthApi.logoutUrl());
  }
  const getBalance = useCallback(async () => {
    if (session) {
      const num = await getSigner(session).getBalance();
      setBalance(num);
    }
  }, [session]);

  const getGasPrice = useCallback(async () => {
    if (session) {
      const num = await getSigner(session).getGasPrice();
      setGasPrice(num);
    }
  }, [session]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendToken = async (event: any) => {
    event.preventDefault();
    const sendValue = etherToWei(inputSendValue);
    console.log(inputToAddress, sendValue);
    if (session && inputToAddress && sendValue) {
      const response = await sendNativeToken(
        session,
        inputToAddress,
        sendValue
      );
      console.log(response);
    }
  };

  useEffect(() => {
    getBalance();
    getGasPrice();
  }, [getBalance, getGasPrice]);

  if (!session) {
    return <LoadingMask></LoadingMask>;
  }
  return (
    <>
      <div>
        <p>userId: {session?.userId}</p>
        <p>address: {session?.address}</p>
        <p>balance: {displayEtherFromWei(balance)}</p>
        <p>gasPrice: {displayEtherFromWei(gasPrice)}</p>
      </div>
      <div>
        <button onClick={onLogout}>logout</button>
      </div>
      <div>
        <button onClick={getBalance}>getBalance</button>
      </div>
      <div>
        <form onSubmit={sendToken}>
          <label>
            toAddress:
            <input
              type="text"
              name="toAddress"
              value={inputToAddress}
              onChange={(event) => {
                setInputToAddress(event.target.value);
              }}
            ></input>
          </label>
          <label>
            sendValue:
            <input
              type="text"
              name="sendValue"
              value={inputSendValue}
              onChange={(event) => {
                setInputSendValue(event.target.value);
              }}
            ></input>
          </label>
          <div>
            <button type="submit">送金実行</button>
          </div>
        </form>
      </div>
    </>
  );
}
