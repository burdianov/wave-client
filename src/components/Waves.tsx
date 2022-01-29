export type Wave = {
  address: string;
  message: string;
  timestamp: string;
};

interface SingleWaveProps {
  label: string;
  value: string;
}

interface WavesProps {
  allWaves: Wave[];
}

const SingleWave = ({ label, value }: SingleWaveProps) => {
  return (
    <div className="flex justify-between">
      <div className="font-bold">{label}:</div>
      <div>{value}</div>
    </div>
  );
};

const Waves = ({ allWaves }: WavesProps) => {
  return (
    <>
      {allWaves.map((wave, index) => {
        return (
          <div
            key={index}
            className="mt-2 flex flex-col rounded border-[1px] py-2 px-4 w-[60vw] shadow-lg"
          >
            <SingleWave label="Address" value={wave.address.toString()} />
            <SingleWave label="Message" value={wave.message} />
            <SingleWave label="Time" value={wave.timestamp.toString()} />
          </div>
        );
      })}
    </>
  );
};

export default Waves;
