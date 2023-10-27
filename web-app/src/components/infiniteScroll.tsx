import { useCallback, useEffect, useRef, useState } from "react";
import { Loader } from "@/app/signup/commonBlocks";
import React from "react";

interface InfiniteScrollProps {
  className?: string;
  callBack: () => Promise<void>;
  children: React.ReactNode;
  hasMoreData: boolean;
  showLoading?: boolean;
}

const InfiniteScroll = ({
  children,
  className,
  callBack,
  hasMoreData,
  showLoading,
}: InfiniteScrollProps) => {
  const [processAlreadyRunning, setProcessAlreadyRunning] = useState(false);
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onScroll = useCallback(async () => {
    if (processAlreadyRunning || !hasMoreData || infiniteLoader) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      setProcessAlreadyRunning(true);
      setInfiniteLoader(true);
      try {
        await callBack();
      } catch (error) {
        console.log("Error calling callBack | Infinite Scrolling" + error);
      } finally {
        setInfiniteLoader(false);
        setProcessAlreadyRunning(false);
      }
    }
  }, [processAlreadyRunning, infiniteLoader, hasMoreData, callBack]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", onScroll);
      return () => {
        container.removeEventListener("scroll", onScroll);
      };
    }
  }, [onScroll]);

  return (
    <div ref={containerRef} className={className} style={{ overflow: "auto" }}>
      {children}
      {!hasMoreData || infiniteLoader && (
        <div className="flex justify-center items-center">
          <span className=" text-eduBlack text-xs font-body">No data available</span>
        </div>
      )}
      {infiniteLoader && showLoading && (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
