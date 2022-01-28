import { useEffect, useState } from 'react';

import useEthers from './hooks/useEthers';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');

  const [waveCount, wave, loading] = useEthers();

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

  useEffect(() => {
    checkIfWalletIsConnected();
  });

  return (
    <div className="min-h-screen flex flex-col justify-center content-center text-center items-center">
      <div className="dataContainer">
        <h2 className="text-3xl font-bold mb-8">Welcome everybody!</h2>

        <p className="bio">Go ahead and click the button.</p>

        <h1 className="transition ease-in-out mt-4 mb-2 text-4xl font-bold text-green-700">
          {waveCount || '-'}
        </h1>
        <p className="text-green-600">click(s)</p>

        <div className="flex flex-col items-center">
          <button
            type="button"
            className="mt-10 inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150"
            disabled={loading}
            onClick={wave}
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? 'Mining...' : '👋 Wave at me!'}
          </button>

          {!currentAccount && (
            <button
              type="button"
              className="mt-4 inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-green-500 hover:bg-green-400 transition ease-in-out duration-150"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
