"use client";
import React, { useState } from "react";
import { Form, Formik, FormikErrors, useFormik } from "formik";
import * as yup from "yup";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/Button";
import { validateAdmin } from "@/service/admin.service";
import { TypeAdminLogin } from "@/types/auth";
import { useDispatch } from "react-redux";
import { setToken, setUserDetail } from "@/redux/ducks/user.duck";
import { useRouter } from "next/navigation";
import { EMAIL_VALIDATION } from "@/util/constant";

const login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const YupStringPreFix = yup.string().trim();
  const validationSchema = yup.object().shape({
    email: YupStringPreFix.required("E-mail is Required").matches(
      EMAIL_VALIDATION,
      { message: "Invalid Email Address" }
    ),
    password: YupStringPreFix.required("Password is required"),
  });

  const handleSubmit = async (
    values: TypeAdminLogin,
    { setErrors }: { setErrors: (errors: FormikErrors<TypeAdminLogin>) => void }
  ) => {
    setIsLoading(true);
    const res = await validateAdmin(values);

    if (res) {
      if (res.data?.response_type === "success") {
        dispatch(setToken(res.data.data.token));
        dispatch(setUserDetail(res.data.data.details))
        router.push("/manage/accounts");
      } else {
        setErrors({
          password: res.data.message,
        });
      }
    } else {
      setErrors({
        password: "Oops..Something went Wrong",
      });
    }
    setIsLoading(false);
  };
  
  return (
    <div className="bg-[#c0c0c2] min-h-screen flex items-center justify-center ">
      <div>
        <div className="w-[700px] p-5 shadow-login rounded-[10px]">
          <div className="flex justify-center text-[30px] py-2">
            <h1>Login EduRx Admin</h1>
          </div>
          <div className="px-4 py-2 text-zinc-500">
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <Form autoComplete="off">
                <div className="p-4 flex-col justify-center">
                  <Input
                    name="email"
                    label="Email"
                    required
                    labelClassName="text-black"
                  />
                  <PasswordInput
                    name="password"
                    label={"Password"}
                    required
                    parentClassName="text-black"
                  />
                  <div className="grid grid-cols-1 pt-6 self-center text-center">
                    <Button
                      title={"LOGIN"}
                      type="submit"
                      variant="filled"
                      bg="bg-black"
                      hoverBg="black"
                      text="white"
                      hoverText="white"
                      border="dark"
                      hoverBorder="dark"
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
