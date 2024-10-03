// File: app/roster/AddToRosterForm.js
'use client'
import { useState } from 'react'
import { useRoster } from '../context/RosterContext'
import { fetchInstagramInfo } from '../services/instagramService'
import { FaInstagram, FaMapMarkerAlt, FaTv, FaFilm, FaMusic, FaFutbol } from 'react-icons/fa'

export default function AddToRosterForm() {
  const [instagramHandle, setInstagramHandle] = useState('')
  const [instagramInfo, setInstagramInfo] = useState(null)
  const [dateCount, setDateCount] = useState(0)
  const [lastDateLocation, setLastDateLocation] = useState('')
  const [interests, setInterests] = useState({ shows: '', movies: '', music: '', sports: '' })
  const [isLoading, setIsLoading] = useState(false)
  const { addToRoster } = useRoster()

  const handleFetchInfo = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const info = await fetchInstagramInfo(instagramHandle)
      setInstagramInfo(info)
    } catch (error) {
      console.error('Error fetching Instagram info:', error)
    }
    setIsLoading(false)
  }

  const handleAddToRoster = () => {
    if (instagramInfo) {
      addToRoster({
        name: instagramInfo.fullName,
        instagramHandle: instagramInfo.username,
        bio: instagramInfo.bio,
        profilePicUrl: instagramInfo.profilePicUrl,
        dateCount: dateCount,
        lastDateLocation: lastDateLocation,
        interests: {
          shows: interests.shows.split(',').map(item => item.trim()),
          movies: interests.movies.split(',').map(item => item.trim()),
          music: interests.music.split(',').map(item => item.trim()),
          sports: interests.sports.split(',').map(item => item.trim()),
        }
      })
      setInstagramHandle('')
      setInstagramInfo(null)
      setDateCount(0)
      setLastDateLocation('')
      setInterests({ shows: '', movies: '', music: '', sports: '' })
    }
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-6 md:p-8 lg:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Add to Roster</h2>
        
        <form onSubmit={handleFetchInfo} className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <FaInstagram className="absolute top-3 left-3 text-pink-500" />
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@username"
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className={`bg-pink-500 text-white py-2 px-6 rounded-md hover:bg-pink-600 transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Fetching...' : 'Fetch Info'}
            </button>
          </div>
        </form>

        {instagramInfo && (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <img src={instagramInfo.profilePicUrl} alt={instagramInfo.fullName} className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6" />
              <div>
                <h3 className="text-2xl font-bold text-center md:text-left">{instagramInfo.fullName}</h3>
                <p className="text-gray-500 text-center md:text-left">@{instagramInfo.username}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Dates</label>
                <input
                  type="number"
                  value={dateCount}
                  onChange={(e) => setDateCount(Number(e.target.value))}
                  min="0"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="relative">
                <FaMapMarkerAlt className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  value={lastDateLocation}
                  onChange={(e) => setLastDateLocation(e.target.value)}
                  placeholder="Last Date Location"
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              {['shows', 'movies', 'music', 'sports'].map((interest) => (
                <div key={interest} className="relative">
                  {interest === 'shows' && <FaTv className="absolute top-3 left-3 text-gray-400" />}
                  {interest === 'movies' && <FaFilm className="absolute top-3 left-3 text-gray-400" />}
                  {interest === 'music' && <FaMusic className="absolute top-3 left-3 text-gray-400" />}
                  {interest === 'sports' && <FaFutbol className="absolute top-3 left-3 text-gray-400" />}
                  <input
                    type="text"
                    value={interests[interest]}
                    onChange={(e) => setInterests({...interests, [interest]: e.target.value})}
                    placeholder={`Favorite ${interest}`}
                    className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
            
            <button
              onClick={handleAddToRoster}
              className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors duration-300 mt-8"
            >
              Add to Roster
            </button>
          </div>
        )}
      </div>
    </div>
  )
}