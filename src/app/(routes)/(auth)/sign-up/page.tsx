'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import Button from "~/app/_components/button"
import FormField from "~/app/_components/form-field"
import { api } from "~/trpc/react"

export default function SignUpPage () {
    const [loading , setLoading] = useState<boolean>(false);
    const [name , setName] = useState<string>('')
    const [username , setUsername] = useState<string>('')
    const [password , setPassword] = useState<string>('')
    const [confirmationPassword , setConfirmationPassword] = useState<string>('')
    const router = useRouter()

    
    const signUpMutation = api.user.signUp.useMutation({
        onSuccess: () => {
            setLoading(false)
            toast.success('Registration success!')
            router.push('/sign-in')

        },

        onError:  (e) => {
            setLoading(false)
            toast.error(e.message)
        }
    })

    const handleRegistration = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if(confirmationPassword !== password) {
            setLoading(false)
        } else {
            signUpMutation.mutate({name , username , password})
        }
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-blue-800 text-white w-[400px]  rounded-md shadow-lg">
               <div className="m-4">
               <h1 className="text-center text-2xl text-white font-bold">SIGN UP</h1>
                <form onSubmit={handleRegistration}>
                   <FormField label="Name" onchange={(e) =>  {setName(e.target.value)}} type="text" variant="light"/>
                   <FormField label="Username" onchange={(e) =>  {setUsername(e.target.value)}} type="text" variant="light"/>
                   <FormField label="Password" onchange={(e) =>  {setPassword(e.target.value)}} type="password" variant="light"/>
                   <FormField label="Confirmation Password" onchange={(e) =>  {setConfirmationPassword(e.target.value)}} type="password" variant='light' />
                    <div className="mt-4">
                        <Button label="Sign Up" type="submit" color="default" isloading={loading} />
                    </div>
                </form>

                <div className="flex justify-center">
                <small className="text-white text-center mt-2">{"Have an account? "} <Link href={'/sign-in'} className="font-bold">Sign In  </Link>here</small>

                </div>
               </div>
            </div>
        </div>
    )
}