'use client'

interface ButtonProps {
    type: 'button' | 'submit' ;
    onclick?: () => void;
    label: string;
    color: 'success' | 'info' | 'error' | 'danger' | 'default';
    isloading?: boolean;
}

export default function Button ({type , onclick , label , color , isloading} : ButtonProps) {
    return (
        <button className={`w-full ${color == 'success' ? 'bg-green-600' : color == 'info' ? "bg-blue-600" : color == 'error' ? 'bg-red-600' : color == 'danger' ? 'bg-red-400' : color == 'default' ? 'bg-white' : null} ${color == 'default' ? 'text-black' : 'text-white'} font-bold p-2 rounded-md`} type={type} onClick={onclick}>{isloading == true ? 'Loading...'  : label}</button>
    )
}