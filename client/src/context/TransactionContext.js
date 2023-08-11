import React, { createContext, useEffect, useState } from 'react'; // <- createContextをインポートする
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/connect";

export const TransactionContext = createContext();
const { ethereum } = window;
//スマートコントラクトのインスタンスを取得する関数
const getSmarContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    );
    console.log(transactionContract);
    
    return transactionContract;

};

export const TransactionProvider = ({ children }) => {
    const [ currentAccount, setCurrentAccount ] = useState("");
    const [ inputFormData, setInputFormData ] = useState({
        addressTo: "",
        amount: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e, name) => {
        setInputFormData((prevInputFormData) => ({  
            ...prevInputFormData,
            [name]: e.target.value,
        }));
    };
    // メタマスクをレットと連携しているのかをまず確認する
    const checkMetamaskWalletConnected = async () => {
      try {
        if (!ethereum) return alert("メタマスクをインストールしてください");
  
        //メタマスクのアカウントIDを取得
        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log("これがアカウントIDたちです");
        console.log(accounts);
         //アカウントIDの表示
  
        //すでにメタマスクのアカウントを１つでも持っているなら
        if (accounts.length) {
          setCurrentAccount(accounts[0]);
          //getAllTransactions();
        } else {
          console.log("アカウントが見つかりませんでした");
        }
      } catch (err) {
        console.log(err);
        throw new Error("イーサリアムオブジェクトがありません。");
      }
    };

    //メタマスクウォレットと連携する関数
    const connectWallet = async () => {
        if (!ethereum) return alert("Please install Metamask");

        //メタマスクを持っていれば接続を開始する
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        console.log(accounts);
        // console.log(accounts[0]);
        console.log("2アカウントはある");
        setCurrentAccount(accounts[0]);
    };

    // 実際に通貨のやり取りを行う関数
//     const sendTransaction = async () => {
//         if (!ethereum) return alert("Please install Metamask");
        
//         const { addressTo, amount } = inputFormData;
//         console.log(addressTo, amount)
//         console.log('sendTransaction');
//         const parsedAmount = ethers.utils.parseEther(amount);
        
//         const transactionContract = getSmarContract();
        
//         // const transactionParameters = {
//         //     from: currentAccount,
//         //     to: addressTo,
//         //     value: parsedAmount._hex, //0.00001
//         //     gas: "0x22710",
//         // };
//         // console.log(parsedAmount._hex);

//         // await ethereum.request({
//         //     method: "eth_sendTransaction",
//         //     params: [transactionParameters],
//         // });
        
//         const txHash = await ethereum.request({
//             method: 'eth_sendTransaction',
//             params: [
//               {
//                 from: currentAccount,
//                 to: addressTo, 
//                 value: parsedAmount._hex, 
// //                   gas: '0x22710', 
//               },
//             ],
//         });

//         const transactionHash = await transactionContract.addToBlockChain(
//             addressTo,
//             parsedAmount
//         );
//         console.log(`ロード中....${transactionHash.hash}`);
//         await transactionHash.wait();
//         console.log(`送金に成功！${transactionHash.hash}`);
//     };


const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("メタマスクをインストールしてください");

      const { addressTo, amount } = inputFormData;
      console.log(addressTo);
      console.log(amount);
      if (isNaN(parseFloat(amount))) {
        throw new Error("無効な金額が入力されています。");
      }
      if (parseFloat(amount) <= 0) {
        throw new Error("金額は正の値である必要があります。");
      }
      const decimalPart = amount.split(".")[1];
      if (decimalPart && decimalPart.length > 18) {
          throw new Error("金額は小数点以下18桁までの値である必要があります。");
      }
      const transactionContract = getSmarContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      console.log(parsedAmount._hex);
      

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            value: parsedAmount._hex, //0.00001
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockChain(
        addressTo,
        parsedAmount,
      );
      setIsLoading(true);
      console.log(`ローディング - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`成功 - ${transactionHash.hash}`);

      // const transactionCount = await transactionContract.getTransactionCount();

      // setCurrentAccount(transactionCount.toNumber());
    } catch (err) {
      // console.log(err);
      // console.error("エラーが発生しました。", err);
      // throw new Error("イーサリアムオブジェクトがありません。");
      if (err.code === 4001) {
        console.log("トランザクションが拒否されました。");
      } else {
        console.error("トランザクションエラー:", err);
      }
    }

  };
    useEffect(() => {
        checkMetamaskWalletConnected();
    }, []);
    return (
        <TransactionContext.Provider value={{ connectWallet, sendTransaction, handleChange, inputFormData}}>
            {children}
        </TransactionContext.Provider>
    )
};