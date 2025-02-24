import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from './Home';
import About from './About';
import './App.css';
import { contractABI as safeSendABI, contractAddress as safeSendAddress } from './contractABIs';
import { contractABI as eduChainABI, contractAddress as eduChainAddress } from './contractABI';

function App() {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [learnMode, setLearnMode] = useState(false);
  const [network, setNetwork] = useState('SafeSend'); // Default to SafeSend
  const [transferType, setTransferType] = useState('Ethereum');

  const networks = {
    SafeSend: {
      chainId: '0xE708', // Linea Network
      rpcUrl: 'https://linea-mainnet.infura.io/v3/',
      explorerUrl: 'https://lineascan.build',
      contractABI: safeSendABI,
      contractAddress: safeSendAddress,
      currency: 'ETH',
      transferOptions: ['Ethereum', 'CROAK', 'eFrogs NFT'],
    },
    EduChain: {
      chainId: '0xA045C', // EduChain Sepolia
      rpcUrl: 'https://open-campus-codex-sepolia.drpc.org',
      explorerUrl: 'https://opencampus-codex.blockscout.com',
      contractABI: eduChainABI,
      contractAddress: eduChainAddress,
      currency: 'EDU',
      transferOptions: ['Edu'],
    },
  };

  useEffect(() => {
    if (network === 'EduChain') {
      setTransferType('Edu');
    } else {
      setTransferType('Ethereum'); // Default back to Ethereum when switching to Linea
    }
  }, [network]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        await checkNetwork(web3Instance);
        const contractInstance = new web3Instance.eth.Contract(
          networks[network].contractABI,
          networks[network].contractAddress
        );
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
    const selectedNetwork = networks[network];
    if (chainId !== parseInt(selectedNetwork.chainId, 16)) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: selectedNetwork.chainId }],
        });
        alert(`Network switched to ${network}`);
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: selectedNetwork.chainId,
                chainName: network,
                rpcUrls: [selectedNetwork.rpcUrl],
                blockExplorerUrls: [selectedNetwork.explorerUrl],
                nativeCurrency: {
                  name: selectedNetwork.currency,
                  symbol: selectedNetwork.currency,
                  decimals: 18,
                },
              }],
            });
            alert(`Network added and switched to ${network}`);
          } catch (addError) {
            console.error('Failed to add network', addError);
            alert(`Failed to add the ${network} network. Please try manually adding it.`);
          }
        } else {
          console.error('Failed to switch to the network', switchError);
          alert(`Failed to switch to the ${network} network. Please switch manually.`);
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

        <div className="network-selection">
          <label htmlFor="network">Select Network:</label>
          <select
            id="network"
            className="network-select"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          >
            <option value="SafeSend">Linea</option>
            <option value="EduChain">EduChain (Open Campus Codex)</option>
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
                contractAddress={networks[network].contractAddress} 
                contractABI={networks[network].contractABI}
                learnMode={learnMode} 
                network={network}  
                transferType={transferType} 
              />} 
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
