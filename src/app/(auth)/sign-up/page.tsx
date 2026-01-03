import { SignUp } from '@clerk/nextjs'

export default function SignIn() {
    return (
        <div className='h-screen flex items-center justify-center bg-transparent'  >
            <SignUp />
        </div>
    )
}