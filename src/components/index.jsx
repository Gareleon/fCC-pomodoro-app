import { useState, useEffect, useRef } from "react";
import "../components/styles.css";
import { flushSync } from "react-dom";

export default function PomodoroApp() {
  const [breakLength, setBreakLength] = useState(300);
  const [sessionLength, setSessionLength] = useState(1500);
  const [startStop, setStartStop] = useState(false);
  const [timer, setTimer] = useState(sessionLength);
  const [isSession, setIsSession] = useState(true);
  const beepRef = useRef(null);

  function handleStartStop() {
    setStartStop(!startStop);
  }

  function formatTime(seconds, returnMinutesOnly = false) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (returnMinutesOnly) {
      return String(minutes).padStart(1);
    }

    return `${String(minutes).padStart(1)}:${String(secs).padStart(2, "0")}`;
  }

  function handleReset() {
    setBreakLength(300); // Default break length: 5 minutes
    setSessionLength(1500); // Default session length: 25 minutes
    setTimer(1500); // Reset the timer to the initial session length
    setStartStop(false); // Stop the timer
    setIsSession(true); // Reset to session mode
    if (beepRef.current) {
      beepRef.current.pause(); // Stop audio
      beepRef.current.currentTime = 0; // Rewind the audio
    }
  }

  function handleIncrementDecrement(event) {
    switch (event.currentTarget.id) {
      case "break-increment":
        setBreakLength((prevBreakLength) =>
          prevBreakLength === 3600 ? prevBreakLength : prevBreakLength + 60
        );
        break;
      case "break-decrement":
        setBreakLength((prevBreakLength) =>
          prevBreakLength === 60 ? prevBreakLength : prevBreakLength - 60
        );
        break;
      case "session-increment":
        setSessionLength((prevSessionLength) =>
          prevSessionLength === 3600
            ? prevSessionLength
            : prevSessionLength + 60
        );
        break;
      case "session-decrement":
        setSessionLength((prevSessionLength) =>
          prevSessionLength === 60 ? prevSessionLength : prevSessionLength - 60
        );
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    let interval = null;

    if (startStop) {
      interval = setInterval(() => {
        setTimer((prevTimer) => Math.max(prevTimer - 1, 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [startStop]);

  useEffect(() => {
    if (timer === 0) {
      if (beepRef.current) {
        beepRef.current.play();
      }

      if (isSession) {
        setTimer(breakLength);
        setIsSession(false);
      } else {
        setTimer(sessionLength);
        setIsSession(true);
      }
    }
  }, [timer, isSession, breakLength, sessionLength]);

  useEffect(() => {
    if (!startStop) {
      setTimer(sessionLength);
    }
  }, [sessionLength]);

  return (
    <div
      id="app-container"
      className="h-[100vh] w-full p-[15rem] m-0 bg-orange-600 overflow-hidden"
    >
      {/*TITLE PREVIEW*/}
      <div className="bg-red-600 text-white text-center p-5 absolute top-0 left-[50%] translate-x-[-50%] rounded-[8px] shadow-lg">
        <h1 className="text-3xl font-bold">Pomodoro App</h1>
      </div>
      {/*START OF THE APP PREVIEW*/}
      <div
        id="pomodoro-app"
        className="bg-rose-800 h-[25rem] w-[35rem] absolute top-[50%] left-[50%] 
        translate-x-[-50%] translate-y-[-50%] rounded-[5px] shadow-2xl shadow-rose-950
        py-4 px-3"
      >
        <div id="preview-container" className="text-white text-center">
          <div className="inline-grid grid-cols-2 gap-[7rem] align-middle pr-6">
            {/*BREAK LENGTH PREVIEW*/}
            <div id="break-label" className="h-fit w-fit relative">
              <div className="inline-block">
                <div id="break-display">
                  <p className="text-xl">Break Length: </p>
                  <div id="break-length" className="text-5xl p-2">
                    {formatTime(breakLength, true)}
                  </div>
                </div>
              </div>

              <div className="inline-grid gap-1 w-fit h-fit absolute top-9">
                <button
                  id="break-increment"
                  className="border-2 w-fit h-fit active:shadow active:shadow-gray-700 active:scale-95"
                  onClick={handleIncrementDecrement}
                >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14m-7 7V5"
                    />
                  </svg>
                </button>
                <button
                  id="break-decrement"
                  className="border-2 w-fit h-fit active:shadow active:shadow-gray-700 active:scale-95"
                  onClick={handleIncrementDecrement}
                >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/*SESSION LENGTH PREVIEW*/}
            <div id="session-label" className="h-fit w-fit relative">
              <div className="inline-block">
                <div id="session-display">
                  <p className="text-xl">Session Length: </p>
                  <div id="session-length" className="text-5xl p-2">
                    {formatTime(sessionLength, true)}
                  </div>
                </div>
              </div>
              <div className="inline-grid gap-1 w-fit h-fit absolute top-9">
                <button
                  id="session-increment"
                  className="border-2 w-fit active:shadow active:shadow-gray-700 active:scale-95"
                  onClick={handleIncrementDecrement}
                >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14m-7 7V5"
                    />
                  </svg>
                </button>
                <button
                  id="session-decrement"
                  className="border-2 w-fit active:shadow active:shadow-gray-700 active:scale-95"
                  onClick={handleIncrementDecrement}
                >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/*TIMER PREVIEW*/}
          <div className="p-2 mt-3">
            <p id="timer-label" className="text-2xl text-emerald-400">
              {isSession ? "Session" : "Break"}
            </p>
            <div id="time-left" className="text-[6rem] font-bold">
              {formatTime(timer)}
            </div>
            {/*CONTROLS PREVIEW*/}
            <div className="text-3xl flex justify-center align-middle gap-3">
              <button
                id="start_stop"
                onClick={handleStartStop}
                className="border-2 w-fit h-fit active:shadow active:shadow-gray-700 active:scale-95 active:cursor-none"
              >
                {startStop ? (
                  <svg
                    className="w-10 h-10 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-10 h-10 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <button
                id="reset"
                className=" border-2 w-fit h-fit active:shadow active:shadow-gray-700 active:scale-95 active:cursor-none"
                onClick={handleReset}
              >
                <svg
                  class="w-10 h-10 text-gray-800 dark:text-white active:animate-spin"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*AUDIO !!!! PREVIEW*/}
      <audio
        ref={beepRef}
        id="beep"
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
        className="clip"
        preload="auto"
      ></audio>
      <div
        id="copyright"
        className="text-white absolute top-[76%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      >
        Made by:{" "}
        <a
          className="text-purple-800 italic font-bold"
          href="https://github.com/Gareleon"
        >
          Gareleon!
        </a>
      </div>
    </div>
  );
}
