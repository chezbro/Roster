'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const RosterContext = createContext()

function RosterProviderComponent({ children }) {
  const [user, setUser] = useState(null)
  const [roster, setRoster] = useState([])

  useEffect(() => {
    // Check for existing user session on component mount
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    // Load user-specific roster when user changes
    if (user) {
      const storedRoster = localStorage.getItem(`roster_${user.phoneNumber}`)
      if (storedRoster) {
        setRoster(JSON.parse(storedRoster))
      } else {
        setRoster([])
      }
    } else {
      setRoster([])
    }
  }, [user])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    setRoster([])
  }

  const addToRoster = async (person) => {
    if (!user) return
    try {
      const response = await fetch('/api/roster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...person, userId: user.id })
      });
      const data = await response.json();
      if (data.success) {
        setRoster(prevRoster => [...prevRoster, { ...data.rosterItem, _id: data.rosterItem._id }]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error adding to roster:', error);
    }
  }

  const removeFromRoster = async (id) => {
    if (!user) return
    try {
      const response = await fetch(`/api/roster/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setRoster(prevRoster => prevRoster.filter(person => person._id !== id));
      }
    } catch (error) {
      console.error('Error removing from roster:', error);
    }
  }

  const addNote = async (id, note) => {
    if (!user) return
    try {
      const response = await fetch(`/api/roster/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      });
      const data = await response.json();
      if (data.success) {
        setRoster(prevRoster => prevRoster.map(person => 
          person._id === id ? { ...person, notes: [...(person.notes || []), note] } : person
        ));
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }

  const updateRosterItem = async (updatedPerson) => {
    if (!user) return
    try {
      const response = await fetch(`/api/roster/${updatedPerson._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPerson)
      });
      const data = await response.json();
      if (data.success) {
        setRoster(prevRoster => prevRoster.map(person => 
          person._id === updatedPerson._id ? updatedPerson : person
        ));
      }
    } catch (error) {
      console.error('Error updating roster item:', error);
    }
  }

  return (
    <RosterContext.Provider value={{ 
      user, 
      roster, 
      login, 
      logout, 
      addToRoster, 
      removeFromRoster, 
      addNote, 
      updateRosterItem 
    }}>
      {children}
    </RosterContext.Provider>
  )
}

export const RosterProvider = RosterProviderComponent
export const useRoster = () => useContext(RosterContext)