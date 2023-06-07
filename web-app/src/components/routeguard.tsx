"use client"
export default function RouteGuard({children}:{children:React.ReactNode}){
   let allow:boolean=true;
   return  allow ?  children :<><h1>Login First</h1></>
}