import React from 'react';

function About() {
  return (
    <div className="about">
      <h2>Welcome to SafeSend DApp</h2>


      <p>
        SafeSend is a smart contract solution designed to address a critical issue in the blockchain space: the loss of funds due to human errors like mistyped wallet addresses. This project, started as an idea in Linea Dev Cook-off Hackathon, adds an extra layer of security to the blockchain by allowing the sender to claim back their crypto if the receiver doesn’t receive it. The user interface is designed to educate people on how to send crypto correctly, helping to prevent these costly mistakes. With an estimated $3.8 billion in crypto lost last year due to such errors, this is an important problem to solve. Expanding the Linea Network with SafeSend not only educates users but also offers a practical solution to a major issue in the crypto world.
      </p>

      <h3>Purpose of SafeSend</h3>
      <p>
        The primary purpose of SafeSend is to teach users how to securely send and receive crypto tokens on the Linea Network blockchain. We understand that sending cryptocurrency can be daunting, especially if you’re worried about making a mistake that could result in lost funds. That’s why SafeSend includes features to ensure you can send crypto with confidence. If something goes wrong, our smart contract allows you to claim back your tokens, so your funds are never lost.
      </p>

      <h3>Key Features</h3>
      <ul>
        <li><strong>Send Crypto:</strong> Learn how to send tokens to any wallet address on the Linea Network. We guide you through every step, ensuring that you understand the importance of using the correct network and double-checking addresses.</li>
        <li><strong>Claim Crypto:</strong> In a typical cryptocurrency transaction, funds automatically appear in the receiver’s balance. However, SafeSend uses a smart contract where the receiver needs to claim their tokens manually. This extra step is a safety feature and a learning opportunity, showing you how to interact with smart contracts.</li>
        <li><strong>Claim Back Crypto:</strong> If your transaction didn’t go through as planned, don’t worry—your tokens are safe. Our smart contract allows you to claim back your tokens, offering peace of mind and a second chance to get it right.</li>
      </ul>

      <h3>Educational Mode</h3>
      <p>
        SafeSend includes a unique "Learn Mode" designed to educate users about the blockchain and cryptocurrency transactions. When Learn Mode is enabled, additional tutorials and guidance appear for each function. You’ll learn about:
      </p>
      <ul>
        <li><strong>Blockchain Basics:</strong> What blockchain networks are and why choosing the correct network is critical.</li>
        <li><strong>Transaction Security:</strong> How to ensure that you’re sending to the right address and what to do if something goes wrong.</li>
        <li><strong>Using Smart Contracts:</strong> Understand how smart contracts work and how they ensure the security and transparency of your transactions.</li>
      </ul>

      <h3>Smart Contract Information</h3>
      <p>
        The heart of SafeSend is a robust smart contract that manages all transactions. This contract is designed to handle multiple transactions simultaneously, storing all relevant details such as sender and receiver addresses, the amount of crypto transferred, and the transaction status. This ensures transparency, security, and the ability to track and claim back your tokens if needed.
      </p>
      <p>
        Additionally, the smart contract is protected by a feature known as <strong>ReentrancyGuard</strong>. This is a security mechanism that helps prevent reentrancy attacks, where a malicious user might try to exploit the contract by making recursive calls before the initial transaction is completed. By incorporating ReentrancyGuard, we ensure that your transactions are processed safely and securely, protecting your tokens from potential threats.
      </p>
      <p>
        You can view the smart contract on the Linea Network blockchain explorer: <a href="https://lineascan.build/address/0x46a60ed30b1ff8f99bb773bae217221c7ce19e02" target="_blank" rel="noopener noreferrer">SafeSend Smart Contract</a>.
      </p>

      <h3>Who We Are</h3>
      <p>
        SafeSend was created by Konstantinos Andreou, a passionate blockchain enthusiast dedicated to making cryptocurrency accessible to everyone. By combining educational resources with practical tools, SafeSend aims to empower users to explore the world of crypto with confidence.
      </p>

      <h3>Get in Touch</h3>
      <p>
        We’re always here to help! If you have any questions, feedback, or just want to learn more about SafeSend, feel free to reach out:
      </p>
      <p>LinkedIn: <a href="https://www.linkedin.com/in/andreou00/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/andreou00/</a></p>
      <p>Telegram: <a href="https://t.me/andreou00" target="_blank" rel="noopener noreferrer">https://t.me/andreou00</a></p>
    </div>
  );
}

export default About;
