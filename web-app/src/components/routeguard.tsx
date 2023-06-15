"use client"
export default function RouteGuard({children}:{children:React.ReactNode}):JSX.Element{
   let allow:boolean=true;
   return  allow ? children as JSX.Element: <h1>Login First</h1>
}