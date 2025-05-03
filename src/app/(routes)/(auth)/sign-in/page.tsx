'use client'

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import Button from "~/app/_components/button"
import FormField from "~/app/_components/form-field"

export default function SignInPage () {
    const [loading , setLoading] = useState<boolean>(false)
    const [username , setUsername] = useState<string>('')
    const [password , setPassword] = useState<string>('')
    const router = useRouter()

    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault()
        try{
            setLoading(true)
            await signIn('credentials' , {username , password , redirect:false}).then(() => {
                setLoading(false)
                router.push('/dashboard')
            }).catch((e) => {
                setLoading(false)
                toast.error(e.message)
            })
        }catch(err) {
            setLoading(false)
            console.log(err)
        }
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-blue-800 text-white w-[400px]  rounded-md shadow-lg">
               <div className="m-4">
               <h1 className="text-center text-2xl text-white font-bold">SIGN IN</h1>
                <form onSubmit={handleSignIn}>
                   <FormField label="Username" onchange={(e) =>  {setUsername(e.target.value)}} type="text" variant="light"/>
                   <FormField label="Password" onchange={(e) =>  {setPassword(e.target.value)}} type="password" variant="light"/>
                    <div className="mt-4">
                        <Button  label="Sign In" type="submit" color="default" isloading={loading}/>
                    </div>
                </form>
                <div className="flex justify-center">
                <small className="text-white text-center mt-2">{"Don't have an account? "} <Link href={'/sign-up'} className="font-bold">Sign Up </Link>here</small>

                </div>
               </div>
            </div>
        </div>
    )
}