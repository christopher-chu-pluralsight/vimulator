import React from 'react'

import useVim from '../hooks/use-vim'

const App = () => {
  const { mode, text, cursor } = useVim()

  return (
    <>
      <div>
        Text: {text.map((row, index) => (
          <div key={index}>
            {row.map((char, index) => (
              <span key={index}>
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div>
        Mode: {mode} | {cursor.row}:{cursor.col}
      </div>
    </>
  )
}

export default App
