import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { CognitoAuthApi } from "../../../auth/auth-api";
import { clearSession, useSession } from "../../../auth/AuthContext";
import {
  displayEtherFromWei,
  displayValue,
  etherToWei,
  getSigner,
  sendNativeToken,
  t3BalanceOf,
} from "../../../wallet/wallet-util";
import { LoadingMask } from "../../components/LoadingMask";

export default function Sample() {
  const { session } = useSession();
  const [balance, setBalance] = useState<BigNumber | null>();
  const [t3Balance, setT3Balance] = useState<number | null>();
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

  const getT3Balance = useCallback(async () => {
    if (session) {
      const num = await t3BalanceOf(session, session.address);
      setT3Balance(num);
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
  const reload = useCallback(() => {
    getBalance();
    getT3Balance();
    getGasPrice();
  }, [getBalance, getGasPrice, getT3Balance]);

  useEffect(() => {
    reload();
  }, [reload]);

  if (!session) {
    return <LoadingMask></LoadingMask>;
  }
  return (
    <>
      <div>
        <p>userId: {session?.userId}</p>
        <p>address: {session?.address}</p>
        <p>balance: {displayEtherFromWei(balance)}</p>
        <p>t3Balance: {displayValue(t3Balance?.toString())}</p>
        <p>gasPrice: {displayEtherFromWei(gasPrice)}</p>
      </div>
      <div>
        <button onClick={onLogout}>logout</button>
      </div>
      <div>
        <button onClick={reload}>reload</button>
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
