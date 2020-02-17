import React from 'react'

import useVim from '../hooks/use-vim'
import './app.scss'

const App = () => {
  const { mode, text, cursor } = useVim()

  // TODO: check for mode to decide when to concat extra element

  return (
    <div className="screen">
      <div>
        {text.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.concat(null).map((char, colIndex) => {
              // TODO: classnames library
              let className = 'col'
              if (rowIndex === cursor.row && colIndex === cursor.col) {
                className = className.concat(' cursor')
              }
              return (
                <span className={className} key={colIndex}>
                  {char}
                </span>
              )
            })}
          </div>
        ))}
      </div>
      <div className="bottom-line">
        <span className="mode">{mode}</span>
        <span className="cursor-position">{cursor.row + 1}:{cursor.col + 1}</span>
      </div>
    </div>
  )
}

export default App
