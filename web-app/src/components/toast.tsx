import React from "react";
import toast, { Toaster } from "react-hot-toast";

interface ToastProps {}
const showToast = toast;

const Toast = (props: ToastProps) => {
  return <Toaster containerClassName="capitalize" {...props} />;
};

export { showToast, Toast };
