import React, { useEffect, useState } from 'react'

import useKeyboard from '../hooks/use-keyboard'

const NORMAL = 'NORMAL'
const INSERT = 'INSERT'
const IGNORED_KEYS = ['Meta', 'Shift', 'Control', 'Alt']

export default function useVim() {
  const { key, keyDate } = useKeyboard()

  const [ mode, setMode ] = useState(NORMAL)
  const [ text, setText ] = useState('')

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
          case null:
            break
          default:
            setText(text.concat(key))
            break
        }
      }
    }

    return () => {}
  }, [ keyDate ]);


  return [ mode, text ] 
}
