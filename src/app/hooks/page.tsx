"use client"
import { useState, useEffect } from 'react'

export default function Click() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `You clicked ${count} times`
  }, [count])

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  )
}