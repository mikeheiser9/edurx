import React from "react";
import toast, { Toaster } from "react-hot-toast";

interface ToastProps {}
const useToast = toast;

const Toast = (props: ToastProps) => {
  return <Toaster {...props} />;
};

export { useToast, Toast };
