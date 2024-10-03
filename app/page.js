import Link from 'next/link'
import { FaHeart, FaClipboardList, FaLock } from 'react-icons/fa'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-white">Roster</h1>
          <div className="space-x-4">
            <Link href="/auth/login" className="text-white hover:text-purple-200 transition-colors duration-300">
              Login
            </Link>
            <Link href="/auth/register" className="bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition-colors duration-300">
              Register
            </Link>
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Manage Your Dating Life with Ease
            </h2>
            <p className="text-xl text-white mb-8">
              Add people to your roster, keep notes, and stay organized. Roster is your personal dating assistant.
            </p>
            <Link href="/auth/register" className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-purple-100 transition-all duration-300 transform hover:scale-105">
              Get Started
            </Link>
          </div>
          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: FaHeart, title: "Track Dates", description: "Keep a record of your dating history and experiences." },
              { icon: FaClipboardList, title: "Organize Contacts", description: "Manage your connections in one place." },
              { icon: FaLock, title: "Private & Secure", description: "Your data is encrypted and never shared." },
              { icon: FaHeart, title: "Find Compatibility", description: "Discover shared interests and potential matches." },
            ].map((feature, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
                <feature.icon className="text-white text-3xl mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}