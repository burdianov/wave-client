import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import LoadingButton from './components/LoadingButton';
import Waves from './components/Waves';

import background from './svg/ethereum.svg';

import wavePortalArtifact from './utils/WavePortal.json';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [waveCount, setWaveCount] = useState();
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState('');

  const contractAddress = '0x1a9c97E3348Aa6472763594cFF541501c47f9031';

  const contractABI = wavePortalArtifact.abi;

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllWaves();
  }, []);

  useEffect(() => {
    const onNewWave = (from, message, timestamp) => {
      console.log('NewWave', from, timestamp, message);

      const date = new Date(timestamp * 1000);

      setAllWaves((prevState) => [
        {
          address: from,
          timestamp: date.toLocaleString(),
          message
        },
        ...prevState
      ]);
    };

    let wavePortalContract;

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on('NewWave', onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewWave);
      }
    };
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have the metamask!');
      } else {
        console.log('We have the ethereum object');
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      setLoading(true);

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const waveTxn = await wavePortalContract.wave(
          message || 'Placeholder message',
          {
            gasLimit: 300000
          }
        );
        console.log('Mining...', waveTxn.hash);

        await waveTxn.wait();
        console.log('Mined -- ', waveTxn.hash);

        const count = await wavePortalContract.getTotalWaves();
        setWaveCount(count.toNumber());

        setMessage('');
      }
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];

        waves.forEach((wave) => {
          const date = new Date(wave.timestamp * 1000);
          wavesCleaned.push({
            address: wave.waver,
            timestamp: date.toLocaleString(),
            message: wave.message
          });
        });

        wavesCleaned.sort(function (a, b) {
          if (a.timestamp < b.timestamp) {
            return -1;
          }
          if (a.timestamp > b.timestamp) {
            return -1;
          }
          return 0;
        });

        setAllWaves(wavesCleaned);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const connectWalletButton = (
    <div
      style={{
        backgroundImage: `url(${background})`,
        height: '100vh'
      }}
      className="w-100 flex content-center items-center justify-center"
    >
      <div className="flex h-[94vh] overflow-auto min-w-[80vw] bg-gray-200 shadow-xl">
        <div className="w-[100%] text-center h-[100%] flex flex-col items-center justify-center">
          <button
            type="button"
            className="w-40 px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-green-500 hover:bg-green-400 transition ease-in-out duration-150"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );

  const { ethereum } = window;

  if (!ethereum) {
    return connectWalletButton;
  } else {
    return (
      <div
        style={{
          backgroundImage: `url(${background})`,
          height: '100vh'
        }}
        className="w-100 flex content-center items-center justify-center"
      >
        <div className="flex flex-col h-[94vh] bg-gray-200 shadow-xl">
          <div className="flex overflow-auto min-w-[80vw] scrollbar scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
            <div className="flex flex-col justify-between my-2 w-[100%]">
              <div className="flex-1">
                {allWaves && <Waves allWaves={allWaves} />}
              </div>
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="mt-2 mb-2 flex items-center w-[100%]">
            <input
              disabled={loading}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Type a message ..."
              id="message"
              className="flex-1 ml-4 mr-2 outline-none py-2 px-2 text-md border-[1px] rounded-md"
            />
            <LoadingButton loading={loading} wave={wave} />
          </div>
        </div>
      </div>
    );
  }
}
