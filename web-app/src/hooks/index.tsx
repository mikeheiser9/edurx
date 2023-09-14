import { useEffect, useRef, useState } from "react";

const useModal = (): UseModalType => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return {
    isOpen,
    openModal,
    closeModal,
  };
};

const useDebounce = (value: string, milliSeconds: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, milliSeconds);

    return () => {
      clearTimeout(handler);
    };
  }, [value, milliSeconds]);

  return debouncedValue;
};

const useOutsideClick = (callback: () => void) => {
  const innerRef = useRef<any>(null);

  const handleClick = (e: MouseEvent) => {
    if (innerRef.current && !innerRef.current.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return innerRef;
};

export { useModal, useDebounce, useOutsideClick };
