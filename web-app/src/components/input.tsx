"use client"
import { useField } from "formik"

interface InputFieldType{
    label?:string,
    name:string,
    type:string,
    placeholder:string
}
export default function InputField({label,...props}:InputFieldType){
    const [field,meta]=useField(props)
    return (
        <>
            <div>
                {label  && <label>{label}</label>}
                <input  {...props} {...field} className="border border-slate-300"/>
                {meta.touched && meta.error ? <div className="text-red-600">{meta.error}</div> :null}
            </div>
        </>
    )
}