import { useEffect, useRef, useState } from 'react';

import useContract from './hooks/useContract';
import LoadingButton from './components/LoadingButton';
import Waves from './components/Waves';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [waveCount, setWaveCount] = useState();
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState('');

  const [contract] = useContract();

  useEffect(() => {
    checkIfWalletIsConnected();
    if (contract) {
      getAllWaves();
    }
  }, [contract]);

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

      if (contract) {
        const waveTxn = await contract.wave(message || 'Placeholder message');
        console.log('Mining...', waveTxn.hash);

        await waveTxn.wait();
        console.log('Mined -- ', waveTxn.hash);

        const count = await contract.getTotalWaves();
        setWaveCount(count.toNumber());

        getAllWaves();
        setMessage('');
      }

      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const getAllWaves = async () => {
    try {
      const waves = await contract.getAllWaves();

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
      setWaveCount(wavesCleaned.length);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col content-center text-center items-center">
      <div className="dataContainer">
        <h2 className="text-3xl font-bold mb-8">Message Board</h2>

        <h1 className="transition ease-in-out mt-4 mb-2 text-4xl font-bold text-green-700">
          {waveCount}
        </h1>
        <p className="text-green-600">message(s)</p>

        <p className="my-4">Type a message and send me a wave.</p>

        <div className="flex flex-col items-center my-2">
          <div className="flex items-center w-[100%] justify-between">
            <div className="flex flex-1 mr-2 items-center">
              <label htmlFor="message" className="text-lx">
                Message:
              </label>
              <input
                disabled={loading}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="Type your message ..."
                id="message"
                className="flex-1 ml-2 outline-none py-2 px-2 text-md border-[1px] rounded-md"
              />
            </div>
            <LoadingButton loading={loading} wave={wave} />
          </div>

          {!currentAccount && (
            <button
              type="button"
              className="mt-4 inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-green-500 hover:bg-green-400 transition ease-in-out duration-150"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}

          {allWaves && <Waves allWaves={allWaves} />}
        </div>
      </div>
    </div>
  );
}
