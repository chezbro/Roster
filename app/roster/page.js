import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Roster() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Welcome to Your Roster</h1>
      <p className="text-xl text-white">You're logged in as: {session.user.email}</p>
      {/* Add more roster content here */}
    </div>
  )
}