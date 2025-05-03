'use client'

interface FormFieldProps {
    label: string;
    type: 'text' | 'password' | 'date';
    onchange: (p: any) => void;
    variant?: 'primary' | 'light';
}

export default function FormField ({label , type , onchange , variant} : FormFieldProps) {
    return (
        <div className="my-3 flex flex-col space-y-2">
        <label >{label}</label>
        <input type={type}  className={`w-full border  p-2 ${variant == 'light' ? 'bg-white border-black text-black rounded-md placeholder:text-black' : 'bg-blue-800  text-white border-blue-500 rounded-md placeholder:text-white '}`}  placeholder={label.toLowerCase()} required onChange={onchange} />
    </div>
    )
}