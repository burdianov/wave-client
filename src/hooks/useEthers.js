import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import wavePortalArtifact from '../utils/WavePortal.json';

const useEthers = () => {
  const [waveCount, setWaveCount] = useState();
  const [loading, setLoading] = useState(false);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  const contractABI = wavePortalArtifact.abi;

  let provider;
  let signer;
  let wavePortalContract;

  useEffect(() => {
    init();
  });

  const wave = async () => {
    setLoading(true);

    const waveTxn = await wavePortalContract.wave();
    console.log('Mining...', waveTxn.hash);

    await waveTxn.wait();
    console.log('Mined -- ', waveTxn.hash);

    const count = await wavePortalContract.getTotalWaves();
    setWaveCount(count.toNumber());

    setLoading(false);
  };

  const init = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        provider = new ethers.providers.Web3Provider(ethereum);
        signer = provider.getSigner();
        wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const count = await wavePortalContract.getTotalWaves();
        setWaveCount(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const blockchainCall = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(
  //         contractAddress,
  //         contractABI,
  //         signer
  //       );

  //       const count = await wavePortalContract.getTotalWaves();
  //       setWaveCount(count.toNumber());
  //     } else {
  //       console.log("Ethereum object doesn't exist");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return [waveCount, wave, loading];
};

export default useEthers;
