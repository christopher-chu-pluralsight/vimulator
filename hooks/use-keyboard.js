import React, { useEffect, useState } from 'react'

export default function useKeyboard() {
  const [ keyWithDate, setKey ] = useState({})

  useEffect(() => {
    document.addEventListener('keydown', ({ key }) => setKey({ 
      key,
      keyDate: new Date(), // hack to force re-render on keypress
    }))
    
    return () => {
      document.removeEventListener('keydown', (_event) => setKey({}))
    }
  }, [])
  
  return keyWithDate
}
