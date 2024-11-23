import { ethers } from 'ethers';
import { croakTokenAddress, efrogsNFTAddress, croakTokenABI, efrogsNFTABI, contractABI, contractAddress } from './contractABIs';

// Helper function to get the provider and signer
const getSigner = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Ethereum provider not found. Please install MetaMask or another wallet.');
  }
  
  // Request accounts if necessary
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
};

// CROAK approval function
export const approveCROAK = async (amountInWei) => {
  const signer = await getSigner();
  const croakContract = new ethers.Contract(croakTokenAddress, croakTokenABI, signer);

  // Check the current allowance
  const currentAllowance = await croakContract.allowance(await signer.getAddress(), contractAddress);

  // If the current allowance is less than the amount to be sent, request approval
  if (currentAllowance.lt(amountInWei)) {
    const tx = await croakContract.approve(contractAddress, amountInWei);
    await tx.wait();
    return tx;
  }

  // No need for approval, already approved
  return null;
};

// eFrogs NFT approval function
export const approveEfrogsNFT = async (tokenId) => {
  const signer = await getSigner();
  const efrogsContract = new ethers.Contract(efrogsNFTAddress, efrogsNFTABI, signer);

  // Check if the contract is already approved to transfer the NFT
  const approvedAddress = await efrogsContract.getApproved(tokenId);

  // If the SafeSend contract is not approved, request approval
  if (approvedAddress !== contractAddress) {
    const tx = await efrogsContract.approve(contractAddress, tokenId);
    await tx.wait();
    return tx;
  }

  // No need for approval, already approved
  return null;
};

// Send ETH, CROAK, or eFrogs NFT
export const sendTransaction = async (transferType, receiver, amount, account) => {
  const signer = await getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    if (transferType === 'Ethereum') {
      const tx = await contract.sendEther(receiver, { value: ethers.utils.parseEther(amount) });
      await tx.wait();
      return 'ETH sent successfully!';
    } else if (transferType === 'CROAK') {
      const croakContract = new ethers.Contract(croakTokenAddress, croakTokenABI, signer);
      const decimals = await croakContract.decimals();
      const amountInWei = ethers.utils.parseUnits(amount, decimals);

      // First, approve the contract for transferring CROAK if necessary
      await approveCROAK(amountInWei);

      // Send CROAK tokens
      const tx = await contract.sendCROAK(receiver, amountInWei.toString());
      await tx.wait();
      return '$CROAK sent successfully!';
    } else if (transferType === 'eFrogs NFT') {
      // First, approve the contract for transferring the eFrogs NFT if necessary
      await approveEfrogsNFT(amount); // `amount` is the tokenId for NFTs

      // Send the eFrogs NFT
      const tx = await contract.sendEfrogs(receiver, amount);
      await tx.wait();
      return 'eFrogs NFT sent successfully!';
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to send ${transferType}. ${error.message}`);
  }
};

// Claim ETH, CROAK, or eFrogs NFT
export const claimTransaction = async (transferType, senderAddr, account) => {
  const signer = await getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    if (transferType === 'Ethereum') {
      const tx = await contract.claimEther(senderAddr);
      await tx.wait();
      return 'ETH claimed successfully!';
    } else if (transferType === 'CROAK') {
      const tx = await contract.claimCROAK(senderAddr);
      await tx.wait();
      return '$CROAK claimed successfully!';
    } else if (transferType === 'eFrogs NFT') {
      const tx = await contract.claimEfrogs(senderAddr);
      await tx.wait();
      return 'eFrogs NFT claimed successfully!';
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to claim ${transferType}. ${error.message}`);
  }
};

// Claim back ETH, CROAK, or eFrogs NFT
export const claimBackTransaction = async (transferType, account) => {
  const signer = await getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    if (transferType === 'Ethereum') {
      const tx = await contract.claimBackEther();
      await tx.wait();
      return 'ETH claimed back successfully!';
    } else if (transferType === 'CROAK') {
      const tx = await contract.claimBackCROAK();
      await tx.wait();
      return '$CROAK claimed back successfully!';
    } else if (transferType === 'eFrogs NFT') {
      const tx = await contract.claimBackEfrogs();
      await tx.wait();
      return 'eFrogs NFT claimed back successfully!';
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to claim back ${transferType}. ${error.message}`);
  }
};
