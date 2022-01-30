export type Wave = {
  address: string;
  message: string;
  timestamp: string;
};

interface WavesProps {
  allWaves: Wave[];
}

const Waves = ({ allWaves }: WavesProps) => {
  return (
    <div>
      {allWaves.map((wave, index) => {
        return (
          <div
            key={index}
            className="mt-4 mx-4 flex flex-col rounded border-[1px] py-2 px-4 bg-green-100 shadow-lg"
          >
            <div className="text-gray-500">
              Sender: {wave.address.toString()}
            </div>
            <div className="text-lg">{wave.message.toString()}</div>
            <div className="ml-auto text-sm text-gray-500">
              {wave.timestamp.toString()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Waves;
