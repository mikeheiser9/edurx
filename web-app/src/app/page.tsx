"use client"
import InputField from "@/components/input";
import { setToken, setUserDetail } from "@/redux/ducks/user.duck";
import { login } from "@/service/auth.service";
import { validateField } from "@/util/interface/constant";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup"
export default function SignIn(){
  const dispatch=useDispatch();
    const {stringPrefixJoiValidation}=validateField
    return (
        <Formik initialValues={{email:"", password:""}}
            validationSchema={Yup.object({
                email:stringPrefixJoiValidation.email().required(),
                password:stringPrefixJoiValidation.required()
            })}
            onSubmit={async(values,{setSubmitting})=>{
                const res=await login(values)
                if(res.data.response_type=="success")
                {
                    setSubmitting(false)
                    dispatch(setToken(res.data?.token))
                    dispatch(setUserDetail(res.data.details))
                }
        }}
            >{
                ({isSubmitting})=>(
                    <div className="flex justify-center ">
                    <Form autoComplete="off">
                        <h1>Sign in</h1>
                        <InputField
                            name="email"
                            placeholder="Email address"
                            type="text"
                        />
                        <InputField
                            name="password"
                            placeholder="Password"
                            type="password"
                        />
                        <button className="border border-slate-300 hover:border-indigo-300" type="submit" disabled={isSubmitting}>Sign in</button>
                    </Form>
                    </div>
                    )
            }
        </Formik>
    )
}