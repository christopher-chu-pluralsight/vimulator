import React, { useEffect, useState } from 'react'

export default function useKeyboard() {
  const [ key, setKey ] = useState(null)

  useEffect(() => {
    document.addEventListener('keydown', ({ key }) => setKey(key))
    
    return () => {
      document.removeEventListener('keydown', (_event) => setKey(null))
    }
  }, [])
  
  return key
}
