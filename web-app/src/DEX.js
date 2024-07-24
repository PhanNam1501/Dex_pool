// src/components/DEX.js
import React, { useState, useEffect } from 'react';
/*import Web3Modal from 'web3modal';*/
import dexABI from './dexABI.json';
import tokenABI from './tokenABI.json';
import {ethers} from "ethers";

const dexAddress = '';
const tokenAAddress = '';
const tokenBAddress = '';


const DEX = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [dexContract, setDexContract] = useState(null);
  const [tokenAContract, setTokenAContract] = useState(null);
  const [tokenBContract, setTokenBContract] = useState(null);
  const [amountA1, setAmountA1] = useState('');
  const [amountB1, setAmountB1] = useState('');
  const [amountA2, setAmountA2] = useState('');
  const [amountB2, setAmountB2] = useState('');
  const [amountA3, setAmountA3] = useState('');
  const [amountB3, setAmountB3] = useState('');
  const [tokenABalance, setTokenABalance] = useState('');
  const [tokenBBalance, setTokenBBalance] = useState('');


  useEffect(() => {
    if (dexContract && tokenAContract && tokenBContract) {
      fetchBalances();
    }
  }, [dexContract, tokenAContract, tokenBContract]);

  const connectWallet = async () => {
    /*const web3Modal = new Web3Modal();
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    */
    let localProvider;
    let localSigner;

    if (window.ethereum) {
        try {
        localProvider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("MetaMask is installed. Accounts requested.");
        localSigner = await localProvider.getSigner();
        console.log("Signer obtained.");
        } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        }
    } else {
        console.log("MetaMask not installed; using read-only defaults.");
        localProvider = ethers.getDefaultProvider();
    }

    if (localProvider) {
        const dexContract = new ethers.Contract(dexAddress, dexABI, localSigner || localProvider);
        const tokenAContract = new ethers.Contract(tokenAAddress, tokenABI, localSigner || localProvider);
        const tokenBContract = new ethers.Contract(tokenBAddress, tokenABI, localSigner || localProvider);

        setProvider(localProvider);
        setSigner(localSigner);
        setDexContract(dexContract);
        setTokenAContract(tokenAContract);
        setTokenBContract(tokenBContract);
        console.log("Contracts initialized.");
    }
    fetchBalances();

  };
  const fetchBalances = async () => {
    try {
      // Assuming the DEX contract has functions to get the balances
      const tokenABalance = await dexContract.getTokenABalance();
      const tokenBBalance = await dexContract.getTokenBBalance();

      setTokenABalance(ethers.formatUnits(tokenABalance, 18));
      setTokenBBalance(ethers.formatUnits(tokenBBalance, 18));
    } catch (error) {
      console.error("Failed to fetch balances:", error);
    }
  };

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  const addLiquidity = async () => {
    await tokenAContract.approve(dexAddress, ethers.parseUnits(amountA1, 18));
    await sleep(15000);
    await tokenBContract.approve(dexAddress, ethers.parseUnits(amountB1, 18));
    await sleep(15000);
    await dexContract.addLiquidity(ethers.parseUnits(amountA1, 18), ethers.parseUnits(amountB1, 18));
    await sleep(20000);
    fetchBalances();
  };

  const withdrawLiquidity = async () => {
    await dexContract.withdrawLiquidity(ethers.parseUnits(amountA2, 18), ethers.parseUnits(amountB2, 18));
    await sleep(20000);
    fetchBalances();
  };

  const swapTokenAForTokenB = async () => {
    await tokenAContract.approve(dexAddress, ethers.parseUnits(amountA3, 18));
    await sleep(15000);
    await dexContract.swaptokenAtoB(ethers.parseUnits(amountA3, 18));
    await sleep(20000);
    fetchBalances();
  };

  const swapTokenBForTokenA = async () => {
    await tokenBContract.approve(dexAddress, ethers.parseUnits(amountB3, 18));
    await sleep(15000);
    await dexContract.swaptokenBtoA(ethers.parseUnits(amountB3, 18));
    await sleep(20000);
    fetchBalances();
  };

  return (
    <div>
      <h1>DEX Interface</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <div>
        <h2>Pool Balances</h2>
        <p>Token A Balance: {tokenABalance}</p>
        <p>Token B Balance: {tokenBBalance}</p>
      </div>
      <div>
        <h2>Add Liquidity</h2>
        <input type="number" placeholder="Amount of Token A" value={amountA1} onChange={(e) => setAmountA1(e.target.value)} />
        <input type="number" placeholder="Amount of Token B" value={amountB1} onChange={(e) => setAmountB1(e.target.value)} />
        <button onClick={addLiquidity}>Add Liquidity</button>
      </div>
      <div>
        <h2>Withdraw Liquidity</h2>
        <input type="number" placeholder="Amount of Token A" value={amountA2} onChange={(e) => setAmountA2(e.target.value)} />
        <input type="number" placeholder="Amount of Token B" value={amountB2} onChange={(e) => setAmountB2(e.target.value)} />
        <button onClick={withdrawLiquidity}>Withdraw Liquidity</button>
      </div>
      <div>
        <h2>Swap Tokens</h2>
        <input type="number" placeholder="Amount of Token A" value={amountA3} onChange={(e) => setAmountA3(e.target.value)} />
        <button onClick={swapTokenAForTokenB}>Swap Token A for Token B</button>
     </div>
     <div>
        <input type="number" placeholder="Amount of Token B" value={amountB3} onChange={(e) => setAmountB3(e.target.value)} />
        <button onClick={swapTokenBForTokenA}>Swap Token B for Token A</button>
      </div>
    </div>
  );
};

export default DEX;
