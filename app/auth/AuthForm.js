'use client'
import { useState } from 'react'
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { name }
          }
        })
        if (error) throw error
      }
      router.push('/roster')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-2xl font-semibold text-white mb-6">{isLogin ? 'Log In' : 'Sign Up'}</h3>
      {!isLogin && (
        <div className="relative">
          <FaUser className="absolute top-3 left-3 text-purple-300" />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white bg-opacity-20 rounded-lg py-2 px-10 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      )}
      <div className="relative">
        <FaEnvelope className="absolute top-3 left-3 text-purple-300" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white bg-opacity-20 rounded-lg py-2 px-10 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>
      <div className="relative">
        <FaLock className="absolute top-3 left-3 text-purple-300" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white bg-opacity-20 rounded-lg py-2 px-10 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-100 transition-colors duration-300"
      >
        {isLogin ? 'Log In' : 'Sign Up'}
      </button>
      <p className="text-white text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="ml-2 text-purple-200 hover:text-white transition-colors duration-300"
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </p>
    </form>
  )
}