import React from 'react'
import { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import ErrorMessage from './ErrorMessage';
const Main = () => {
  const  { connectWallet, sendTransaction, handleChange, inputFormData, errorMessage } = useContext(TransactionContext);
  
  const handleSubmit = async () => {
    const { addressTo, amount } = inputFormData;
    if (addressTo == "" || amount == "") {
      return;
    } else {
      sendTransaction();
    }
  };
  return (
    <div className="mainContainer">
      {/* エラーメッセージの表示 */}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <div className="contentRow"> {/* このdivで包む */}
      {/* 左側欄 */}
      <div className="cryptContainer">
        <h1 className="title">ようこそ</h1>

        <button type="button">
          <p className="buttonText" onClick={connectWallet}>ウォレット連携</p>
        </button>
      </div>
      {/* 右側のInput */}
      <div className="inputContainer">
        <input 
          type="text" 
          placeholder="アドレス" 
          name="addressTo" 
          onChange={(e) => handleChange(e, "addressTo")} 
          /> 
        <input
            placeholder="通貨(ETH)"
            name="amount"
            type="number"
            step="0.0001" 
            onChange={(e) => handleChange(e, "amount")} 
          />
        <button type="button" onClick={ handleSubmit }>
            送信
        </button>
      </div>
    </div>  
  </div>
  );
};

export default Main