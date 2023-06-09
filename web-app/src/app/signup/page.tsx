"use client";
import CommonUI from "@/components/commonUI";
import { useRouter } from "next/navigation";
import { useRef } from "react";
export default function ChooseAccountType() {
  const registrationType = useRef(null);
  const router = useRouter();

  function handleClick(type: string) {
    router.push(`/signup/${type}`);
  }

  return (
    <CommonUI
      title="Create Account"
      type="Register for Edu-Rx"
      fields={
        <>
          <label>Please make a selection</label>
          <div>
            <button
              type="button"
              className="border border-slate-300 hover:border-indigo-300"
              ref={registrationType.current}
              onClick={() => handleClick("professional")}
            >
              Professional Account
            </button>
            <button
              type="button"
              className="border border-slate-300 hover:border-indigo-300"
              ref={registrationType}
              onClick={() => handleClick("student")}
            >
              Student Account
            </button>
          </div>
        </>
      }
    />
  );
}
