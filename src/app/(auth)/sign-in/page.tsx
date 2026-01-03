import { SignIn } from '@clerk/nextjs'

export default function Home() {
    return (
        <div className='h-screen flex items-center justify-center data-theme' >
            <SignIn />
        </div>)
}