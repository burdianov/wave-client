import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import wavePortalArtifact from '../utils/WavePortal.json';

const useContract = (onNewWave) => {
  const [contract, setContract] = useState();

  const contractAddress = '0x05f73dfa8cea5b9ff76e04b09593f980f81a47ef';

  const contractABI = wavePortalArtifact.abi;

  useEffect(() => {
    let wavePortalContract;

    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        wavePortalContract.on('NewWave', onNewWave);
        setContract(wavePortalContract);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewWave);
      }
    };
  }, []);

  return [contract];
};

export default useContract;
