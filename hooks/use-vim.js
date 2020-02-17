import React, { useEffect, useState } from 'react'

import useKeyboard from '../hooks/use-keyboard'

const NORMAL = 'NORMAL'
const INSERT = 'INSERT'
const IGNORED_KEYS = ['Meta', 'Shift', 'Control', 'Alt', 'Tab']

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

          case 'a':
            setMode(INSERT)
            setCursorCol((prevCol) => prevCol + 1)
            break

          case 'o':
            insertNewRowBelow()
            setMode(INSERT)
            break

          case 'O':
            insertNewRowAbove()
            setMode(INSERT)
            break

          case 'ArrowLeft':
          case 'h':
            moveCursorLeft()
            break

          case 'ArrowDown':
          case 'j':
            moveCursorDown()
            break

          case 'ArrowUp':
          case 'k':
            moveCursorUp()
            break

          case 'ArrowRight':
          case 'l':
            moveCursorRight()
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
            insertRowBelow()
            break

          case 'ArrowLeft':
            moveCursorLeft()
            break

          case 'ArrowDown':
            moveCursorDown()
            break

          case 'ArrowUp':
            moveCursorUp()
            break

          case 'ArrowRight':
            moveCursorRight()
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
      row: cursorRow,
      col: cursorCol,
    },
  }

  function addCharacter(char) {
    // TODO: not immutable
    // TODO: figure out performance impact of index keys
    text[cursorRow].splice(cursorCol, 0, char)

    setCursorCol((prevCol) => prevCol + 1)
    setText(text)
  }

  function deleteCharacter() {
    if (cursorCol > 0) {
      // TODO: not immutable
      text[cursorRow].splice(cursorCol - 1, 1)
      setCursorCol((prevCol) => prevCol - 1)
      setText(text)
    } else {
      deleteRow()
    }
  }

  function deleteRow() {
    if (cursorRow > 0) {
      const currentRow = text[cursorRow]
      const rowAbove = text[cursorRow - 1]
      // TODO: carry over remaining contents to previous row
      text[cursorRow - 1] = text[cursorRow - 1].concat(currentRow)
      setCursorRow((prevRow) => prevRow - 1)
      setCursorCol(rowAbove.length)
      setText(text.filter((_value, index) => index !== cursorRow))
    }
  }

  function insertRowBelow() {
    const currentRow = text[cursorRow]
    if (cursorCol < currentRow.length) {
      const leftHalf = currentRow.slice(0, cursorCol)
      const rightHalf = currentRow.slice(cursorCol)
      text[cursorRow] = leftHalf
      text.splice(cursorRow + 1, 0, rightHalf)
      setText(text)
      setCursorCol(0)
      setCursorRow((prevRow) => prevRow + 1)
    } else {
      insertNewRowBelow()
    }
  }

  function insertNewRowBelow() {
    text.splice(cursorRow + 1, 0, [])
    setText(text)
    setCursorCol(0)
    setCursorRow((prevRow) => prevRow + 1)
  }

  function insertNewRowAbove() {
    text.splice(cursorRow, 0, [])
    setText(text)
    setCursorCol(0)
  }

  function moveCursorLeft() {
    if (cursorCol > 0) {
      setCursorCol((prevCol) => prevCol - 1)
    }
  }

  function moveCursorUp() {
    if (cursorRow > 0) {
      const rowAbove = text[cursorRow - 1]
      setCursorCol((prevCol) => Math.min(rowAbove.length, prevCol))
      setCursorRow((prevRow) => prevRow - 1)
    }
  }

  function moveCursorDown() {
    if (cursorRow < text.length - 1) {
      const rowBelow = text[cursorRow + 1]
      setCursorCol((prevCol) => Math.min(rowBelow.length, prevCol))
      setCursorRow((prevRow) => prevRow + 1)
    }
  }

  function moveCursorRight() {
    if (cursorCol < text[cursorRow].length) {
      setCursorCol((prevCol) => prevCol + 1)
    }
  }
}
