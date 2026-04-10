import Image from "next/image";
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import RegisterForm from "@/components/auth/registerForm";


export default function Page() {
    return (
        <main>
            <RegisterForm />
        </main>
    );
}
