import Link from 'next/link'
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'
import AuthForm from './AuthForm'

export default function Auth() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-12">
          <Link href="/" className="text-3xl font-bold text-white">Roster</Link>
        </nav>

        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Join Roster Today
            </h2>
            <p className="text-xl text-white mb-8">
              Sign up or log in to start managing your dating life with ease. Your personal dating assistant awaits!
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 transform transition-all duration-300 hover:scale-105">
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}