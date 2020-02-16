import React, { useEffect, useState } from 'react'

import useKeyboard from '../hooks/use-keyboard'

const MODES = {
  NORMAL: 'NORMAL',
  INSERT: 'INSERT',
}

function useVim(key) {
  const [ mode, setMode ] = useState(MODES.NORMAL)

  useEffect(() => {
    switch(key) {
      case 'i':
        setMode(MODES.INSERT)
        break;
      case 'Escape':
        setMode(MODES.NORMAL)
        break;
      default:
        break;
    }

    return () => {}
  }, [ key ]);


  return mode  
}

const App = () => {
  const key = useKeyboard()

  const mode = useVim(key)

  return (
    <div>
      Key: {key}
      <br/>
      Mode: {mode}
    </div>
  )
}

export default App
