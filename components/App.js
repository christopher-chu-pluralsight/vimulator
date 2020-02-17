import React from 'react'

import useVim from '../hooks/use-vim'

const App = () => {
  const [ mode, text ] = useVim()

  return (
    <>
      <div>
        Text: {text}
      </div>
      <div>
        Mode: {mode}
      </div>
    </>
  )
}

export default App
