import React, { useEffect, useState } from "react";

interface Props {
  progress: number;
  label: string;
  wrapperClass?: string;
  filledClass?: string;
  animateProgress?: boolean;
}

// read only progress bar
export const ProgressBar = ({
  label,
  progress = 0,
  wrapperClass,
  filledClass,
  animateProgress,
}: Props) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (!animateProgress) return;
    let intervalSpeed = 10;
    let incrementSpeed = 1;

    const progressInterval = setInterval(() => {
      if (currentProgress < progress) {
        setCurrentProgress((prev) => prev + incrementSpeed);
      } else {
        clearInterval(progressInterval);
      }
    }, intervalSpeed);

    return () => clearInterval(progressInterval);
  }, [progress, currentProgress]);

  return (
    <div
      className={
        wrapperClass ||
        "w-full bg-eduLightBlue rounded-md h-5 flex items-center"
      }
    >
      <span
        className={`${filledClass} ${
          !animateProgress && "animate-scale-in"
        } bg-eduYellow justify-center items-center transition-all ease-out duration-1000 relative flex z-10 h-full rounded-md`}
        style={{
          width: `${!animateProgress ? progress : currentProgress}%`,
        }}
      >
        <span className="truncate text-white mx-2 font-medium text-[8px]">
          {label}
        </span>
      </span>
    </div>
  );
};
