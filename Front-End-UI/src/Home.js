import React, { useState } from 'react';
import './Home.css';
import croakLogo from './public/croak_logo.png';
import efrogsLogo from './public/efrogs_logo.png';

// Import the necessary functions from safesend.js
import { sendTransaction, claimTransaction, claimBackTransaction } from './safesend';

function Home({ transferType, learnMode, account }) {
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [senderAddr, setSenderAddr] = useState('');
  const [activeTutorial, setActiveTutorial] = useState('');

  // Handle the send transaction
  const handleSend = async () => {
    try {
      const result = await sendTransaction(transferType, receiver, amount, account);
      alert(result);
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle the claim transaction
  const handleClaim = async () => {
    try {
      const result = await claimTransaction(transferType, senderAddr, account);
      alert(result);
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle the claim back transaction
  const handleClaimBack = async () => {
    try {
      const result = await claimBackTransaction(transferType, account);
      alert(result);
    } catch (error) {
      alert(error.message);
    }
  };

  const renderLogo = () => {
    if (transferType === 'CROAK') {
      return <img src={croakLogo} alt="CROAK Logo" className="transfer-logo" />;
    } else if (transferType === 'eFrogs NFT') {
      return <img src={efrogsLogo} alt="eFrogs Logo" className="transfer-logo" />;
    }
    return null;
  };

  const renderTutorial = () => {
    switch (activeTutorial) {
      case 'send':
        return (
          <div className="tutorial">
            <h3>How to Send {transferType}</h3>
            <p>Sending {transferType} involves transferring value across the blockchain. This is an essential skill for anyone using cryptocurrencies. Here’s a step-by-step guide:</p>

            <h4>Step 1: Understand Blockchain Networks</h4>
            <p>
              Blockchain networks are like different highways. When you send {transferType}, you need to make sure you’re on the right highway (Linea). 
              If you use the wrong network, your transaction could get lost.
            </p>
            <img src={`${process.env.PUBLIC_URL}/images/blockchain_networks.jpg`} alt="Blockchain Networks" className="tutorial-image" />

            <h4>Step 2: Double-Check the Receiver’s Address</h4>
            <p>
              The receiver’s address is a unique identifier for the wallet you are sending {transferType} to. It’s a long string of letters and numbers that acts like a digital mailbox. 
              If even one character is wrong, your {transferType} might end up in the wrong mailbox. 
              You can find the receiver’s address in their wallet app—ask them to copy and share it with you directly to avoid errors.
            </p>
            <img src={`${process.env.PUBLIC_URL}/images/check_address.jpg`} alt="Check Receiver Address" className="tutorial-image" />
            <p>
              After verifying the receiver's address, type the amount of {transferType} you want to send and click "Send {transferType}."
            </p>
            
            <h4>Step 3: Account for Transaction Fees</h4>
            <p>
              Every transaction on the blockchain costs a small fee. Make sure you have enough funds to cover this fee.
            </p>
            <img src={`${process.env.PUBLIC_URL}/images/transaction_fee.png`} alt="Transaction Fee" className="tutorial-image" />

            <h4>Step 4: Confirm and Send</h4>
            <p>
              Once everything is correct, click “Send {transferType}”. Your transaction will be broadcasted to the network. However, in this dApp, the receiver must manually claim the {transferType} to complete the transfer.
            </p>
          </div>
        );
      case 'claim':
        return (
          <div className="tutorial">
            <h3>How to Claim {transferType}</h3>
            <p>Claiming {transferType} means accepting the tokens/NFT that someone else has sent to you. Normally in cryptocurrency transactions, the funds would automatically appear in your wallet. However, in this dApp, you need to manually claim the funds using the sender’s address.</p>

            <h4>Step 1: Obtain the Sender’s Address</h4>
            <p>You’ll need the address of the person who sent you the {transferType}. This is unusual in most crypto transactions, but it’s necessary here to ensure extra security.</p>

            <h4>Step 2: Verify the Transaction</h4>
            <p>Enter the sender’s address into the provided field and click “Claim {transferType}”. The dApp will verify that you are the intended recipient of the funds.</p>

            <h4>Step 3: Check Your Balance</h4>
            <p>After claiming, the {transferType} should appear in your wallet. You can view your balance directly in your wallet app.</p>
          </div>
        );
      case 'claimBack':
        return (
          <div className="tutorial">
            <h3>Failed to Send {transferType}? Don’t Worry, Your Crypto is Safe!</h3>
            <p>If your transaction didn’t go through as planned, don’t panic. This dApp allows you to claim back your {transferType} safely.</p>
            
            <img src={`${process.env.PUBLIC_URL}/images/claim_back.png`} alt="Transaction Fee" className="tutorial-image" />

            <h4>Step 1: Check the Receiver's Address</h4>
            <p>One common reason transactions fail is an incorrect receiver’s address. Double-check that you’ve entered the correct address. If the address was wrong, the {transferType} wouldn’t reach the intended recipient, but they are still safely within the smart contract.</p>

            <h4>Step 2: Network Issues</h4>
            <p>Occasionally, network congestion or using the wrong network can prevent a transaction from being processed. Ensure that you’re connected to Linea and that the network is functioning smoothly.</p>

            <h4>Step 3: Claim Back Your {transferType}</h4>
            <p>If something went wrong, you can reclaim your {transferType} by clicking “Claim Back {transferType}”. This feature ensures that even if a mistake was made, your funds remain secure and can be easily recovered.</p>
          </div>
        );
      default:
        return <p>Select an action to learn more.</p>;
    }
  };

  return (
    <main className="main-container">
      <div className="functions-container">
        <section className="card">
          <div className="logo-text-wrapper">
            {renderLogo()}
            <h2>Send {transferType}</h2>
          </div>
          <input
            type="text"
            placeholder="Receiver address"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <input
            type="text"
            placeholder={`Amount in ${transferType === 'Ethereum' ? 'ETH' : transferType === 'CROAK' ? '$CROAK' : 'Token ID'}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="action-button" onClick={handleSend}>Send {transferType}</button>
          {learnMode && <button className="learn-button" onClick={() => setActiveTutorial('send')}>Learn How to Send</button>}
        </section>
        <section className="card">
          <div className="logo-text-wrapper">
            {renderLogo()}
            <h2>Claim {transferType}</h2>
          </div>
          <input
            type="text"
            placeholder="Sender address"
            value={senderAddr}
            onChange={(e) => setSenderAddr(e.target.value)}
          />
          <button className="action-button" onClick={handleClaim}>Claim {transferType}</button>
          {learnMode && <button className="learn-button" onClick={() => setActiveTutorial('claim')}>Learn How to Claim</button>}
        </section>
        <section className="card">
          <div className="logo-text-wrapper">
            {renderLogo()}
            <h2>Claim Back {transferType}</h2>
          </div>
          <button className="action-button" onClick={handleClaimBack}>Claim Back {transferType}</button>
          {learnMode && <button className="learn-button" onClick={() => setActiveTutorial('claimBack')}>Learn Why It Failed</button>}
        </section>
      </div>

      {learnMode && (
        <section className="tutorial-section">
          {renderTutorial()}
        </section>
      )}
    </main>
  );
}

export default Home;
