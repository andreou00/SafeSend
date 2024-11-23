import React, { useState } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from './Home';
import About from './About';
import './App.css';
import { contractABI, contractAddress } from './contractABIs';

function App() {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [learnMode, setLearnMode] = useState(false);
  const [transferType, setTransferType] = useState('Ethereum');  // Added state for Transfer Type

  const lineaChainId = '0xE708'; // Linea Sepolia Network

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        await checkNetwork(web3Instance);
        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('User denied account access or error occurred', error);
      }
    } else {
      console.error('No Ethereum provider detected');
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setWeb3(null);
    setContract(null);
    alert('Wallet disconnected');
  };

  const checkNetwork = async (web3Instance) => {
    const chainId = await web3Instance.eth.getChainId();
    if (chainId !== parseInt(lineaChainId, 16)) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: lineaChainId }],
        });
        alert('Network switched to Linea');
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: lineaChainId,
                chainName: 'Linea Mainnet',
                rpcUrls: ['https://linea-mainnet.infura.io/v3/'],
                blockExplorerUrls: ['https://lineascan.build'],
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
              }],
            });
            alert('Network added and switched to Linea');
          } catch (addError) {
            console.error('Failed to add network', addError);
            alert('Failed to add the Linea network. Please try manually adding it.');
          }
        } else {
          console.error('Failed to switch to the network', switchError);
          alert('Failed to switch to the Linea network. Please switch manually.');
        }
      }
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="logo-container">
            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="SafeSend Logo" className="logo" />
            <h1>SafeSend DApp</h1>
          </div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <div className="learn-mode-toggle">
              <label className="learn-mode-label">Learn Mode</label>
              <input 
                type="checkbox" 
                id="learnModeSwitch" 
                checked={learnMode} 
                onChange={() => setLearnMode(!learnMode)} 
              />
              <label className="switch" htmlFor="learnModeSwitch"></label>
            </div>
          </nav>
          {account ? (
            <div>
              <p>Connected account: {account}</p>
              <button className="disconnect-button" onClick={disconnectWallet}>Disconnect Wallet</button>
            </div>
          ) : (
            <button className="connect-button" onClick={connectWallet}>Connect Wallet</button>
          )}
        </header>
        
        <div className="transfer-type-container">
          <label className="transfer-type-label" htmlFor="transferType">Transfer Type:</label>
          <select
            id="transferType"
            className="transfer-type-select"
            value={transferType}
            onChange={(e) => setTransferType(e.target.value)}
          >
            <option value="Ethereum">Ethereum</option>
            <option value="CROAK">$CROAK</option>
            <option value="eFrogs NFT">eFrogs NFT</option>
          </select>
        </div>


        <Routes>
          <Route 
            exact 
            path="/" 
            element={
              <Home 
                web3={web3} 
                account={account} 
                contract={contract} 
                contractAddress={contractAddress} 
                contractABI={contractABI}
                learnMode={learnMode} 
                transferType={transferType}  // Pass transfer type to Home component
              />} 
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
