import React, { useEffect, useState } from 'react'

import useKeyboard from '../hooks/use-keyboard'

const NORMAL = 'NORMAL'
const INSERT = 'INSERT'
const IGNORED_KEYS = ['Meta', 'Shift', 'Control', 'Alt']

export default function useVim() {
  const { key, keyDate } = useKeyboard()

  const [ mode, setMode ] = useState(NORMAL)
  const [ text, setText ] = useState([[]])
  const [ cursorRow, setCursorRow ] = useState(0)
  const [ cursorCol, setCursorCol ] = useState(0)

  useEffect(() => {
    if (!IGNORED_KEYS.includes(key)) {
      if (mode === NORMAL) {
        switch(key) {
          case 'i':
            setMode(INSERT)
            break
          default:
            break
        }
      } 
      else if (mode === INSERT) {
        switch(key) {
          case 'Escape':
            setMode(NORMAL)
            break
          case 'Backspace':
            deleteCharacter()
            break
          case 'Enter':
            insertRow()
            break
          case null:
            break
          default:
            addCharacter(key)
            break
        }
      }
    }

    return () => {}
  }, [ keyDate ]);

  return { 
    mode,
    text,
    cursor: { 
      row: cursorRow + 1,
      col: cursorCol + 1,
    },
  }

  function addCharacter(char) {
    // TODO: not immutable
    // TODO: figure out performance impact of index keys
    text[cursorRow] = text[cursorRow].concat(char)

    setCursorCol((prevCol) => prevCol + 1)
    setText(text)
  }

  function deleteCharacter() {
    if (cursorCol > 0) {
      // TODO: not immutable
      text[cursorRow] = text[cursorRow].slice(0, -1)
      setCursorCol((prevCol) => prevCol - 1)
      setText(text)
    } else {
      deleteRow()
    }
  }

  function deleteRow() {
    if (cursorRow > 0) {
      const currentRow = text[cursorRow]
      // TODO: carry over remaining contents to previous row
      //    text[cursorRow - 1] = text[cursorRow - 1].concat(currentRow)
      setCursorRow((prevRow) => prevRow - 1)
      setCursorCol(0)
      setText(text.filter((_value, index) => index !== cursorRow))
    }
  }

  function insertRow() {
    setText([ ...text, [] ])
    setCursorCol(0)
    setCursorRow((prevRow) => prevRow + 1)
  }
}
