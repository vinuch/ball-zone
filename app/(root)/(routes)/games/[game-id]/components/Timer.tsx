// components/Timer.js
import { Pause, PlayArrow, Replay, ResetTv, Stop } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

type TimerProps = {
  toggleNextSetModal: (value: boolean) => void;
  setIsFinished: Dispatch<SetStateAction<boolean>>;
  isFinished: boolean;
}
export default function Timer({toggleNextSetModal, setIsFinished, isFinished}: TimerProps) {
  const [time, setTime] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [isFinished, setIsFinished] = useState(false);


  useEffect(() => {
    let timer : any;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if(prevTime - 1 === 0){
            setIsFinished(true)
            setIsRunning(false);
          }
         return prevTime - 1
        });
      }, 1000); // Increment every second
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTime(10);
  };
  const handleTimeChange = (event: any) => {
    const newTime = parseInt(event.target.value, 10);
    if (!isNaN(newTime)) setTime(newTime);
  };

  const {minutes, seconds} = formatTime(time)
  const handleTimeClick = () => setIsEditing(true);
  const handleTimeSubmit = () => setIsEditing(false);
  return (
    <div>
      <div
        className="text-center text-6xl font-bold my-4 font-ds_digi"
        style={{ fontFamily: "ds_digital" }}
      >
              <div onClick={handleTimeClick}>
        {isEditing ? (
          <TextField
            type="number"
            value={time}
            onChange={handleTimeChange}
            onBlur={handleTimeSubmit}
            inputProps={{ min: 0 }}
            autoFocus
          />
        ) : (
          <span>
            {isFinished && !isRunning ? "GAME" : minutes}:
            <span className="text-red-600"> {isFinished && !isRunning ? "OVER" : seconds}</span>
          </span>
        )}
      </div>
        {/* {isFinished && !isRunning ? 'GAME': minutes}:<span className="text-red-600">{isFinished && !isRunning ? 'OVER' : seconds}</span> */}
      </div>
      {time === 10 ? (
        <div className="flex justify-center my-2">
          <Button
            className="bg-white text-black px-4 text-md"
            size="large"
            onClick={startTimer}
          >
            START
          </Button>
        </div>
      ) : !isRunning && isFinished ? (
        <div className="flex justify-center gap-4 my-2">
        <Button
          className="bg-white text-black px-4 text-md"
          size="large"
          onClick={() => toggleNextSetModal(true)}
        >
          NEXT SET
        </Button>
        <div className="group inline-block">
           <Button
          className="bg-white text-black px-4 text-md transition-all duration-100"
          size="large"
          onClick={() => resetTimer()}
        >
          <Replay /> <span className="ml-2 hidden group-hover:inline-block transition-all duration-100">Rematch</span> 
        </Button>
        </div>
       
      </div>
      ) : (
        <div className="flex justify-center gap-x-4 my-2">
          <Button onClick={pauseTimer} disabled={!isRunning}>
            <Pause fontSize="large" />{" "}
          </Button>
          <Button onClick={startTimer} disabled={isRunning}>
            <PlayArrow fontSize="large" />{" "}
          </Button>
          <Button onClick={resetTimer}>
            <Stop fontSize="large" />{" "}
          </Button>
        </div>
      )}
    </div>
  );
}

function formatTime(seconds: any) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');
  return { minutes, seconds: remainingSeconds };
}
