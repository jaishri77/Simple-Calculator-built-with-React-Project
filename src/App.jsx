
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')
  const [previous, setPrevious] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waiting, setWaiting] = useState(false)

  const formatNumber = (number) => {
    if (!Number.isFinite(number)) return 'Error'
    return String(Number(number.toFixed(10)))
  }

  const inputDigit = (digit) => {
    if (display === 'Error') {
      setDisplay(digit)
      setWaiting(false)
      return
    }

    if (waiting) {
      setDisplay(digit)
      setWaiting(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (display === 'Error' || waiting) {
      setDisplay('0.')
      setWaiting(false)
      return
    }

    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const clearAll = () => {
    setDisplay('0')
    setPrevious(null)
    setOperator(null)
    setWaiting(false)
  }

  const deleteLast = () => {
    if (display === 'Error' || waiting) {
      setDisplay('0')
      setWaiting(false)
      return
    }

    setDisplay(display.length > 1 ? display.slice(0, -1) : '0')
  }

  const calculate = (first, second, op) => {
    switch (op) {
      case '+': return first + second
      case '-': return first - second
      case '×': return first * second
      case '÷': return second === 0 ? 'Error' : first / second
      default: return second
    }
  }

  const chooseOperator = (nextOperator) => {
    if (display === 'Error') return

    const inputValue = Number(display)

    if (operator && !waiting) {
      const result = calculate(previous, inputValue, operator)

      if (result === 'Error') {
        setDisplay('Error')
        setPrevious(null)
        setOperator(null)
        setWaiting(true)
        return
      }

      const formatted = formatNumber(result)
      setDisplay(formatted)
      setPrevious(result)
    } else {
      setPrevious(inputValue)
    }

    setOperator(nextOperator)
    setWaiting(true)
  }

  const performCalculation = () => {
    if (operator === null || previous === null || display === 'Error') return

    const result = calculate(previous, Number(display), operator)
    setDisplay(formatNumber(result))
    setPrevious(null)
    setOperator(null)
    setWaiting(true)
  }

  const percentage = () => {
    if (display === 'Error') return
    setDisplay(formatNumber(Number(display) / 100))
    setWaiting(false)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key

      if (/^[0-9]$/.test(key)) inputDigit(key)
      else if (key === '.') inputDecimal()
      else if (key === '+') chooseOperator('+')
      else if (key === '-') chooseOperator('-')
      else if (key === '*') chooseOperator('×')
      else if (key === '/') {
        event.preventDefault()
        chooseOperator('÷')
      }
      else if (key === 'Enter' || key === '=') performCalculation()
      else if (key === 'Backspace') deleteLast()
      else if (key === 'Escape') clearAll()
      else if (key === '%') percentage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const buttons = [
    { label: 'AC', type: 'utility', action: clearAll },
    { label: 'DEL', type: 'utility', action: deleteLast },
    { label: '%', type: 'utility', action: percentage },
    { label: '÷', type: 'operator', action: () => chooseOperator('÷') },

    { label: '7', action: () => inputDigit('7') },
    { label: '8', action: () => inputDigit('8') },
    { label: '9', action: () => inputDigit('9') },
    { label: '×', type: 'operator', action: () => chooseOperator('×') },

    { label: '4', action: () => inputDigit('4') },
    { label: '5', action: () => inputDigit('5') },
    { label: '6', action: () => inputDigit('6') },
    { label: '-', type: 'operator', action: () => chooseOperator('-') },

    { label: '1', action: () => inputDigit('1') },
    { label: '2', action: () => inputDigit('2') },
    { label: '3', action: () => inputDigit('3') },
    { label: '+', type: 'operator', action: () => chooseOperator('+') },

    { label: '00', action: () => inputDigit('0') && inputDigit('0') },
    { label: '0', action: () => inputDigit('0') },
    { label: '.', action: inputDecimal },
    { label: '=', type: 'equals', action: performCalculation }
  ]

  return (
    <main className="app-container">
      <div className="calculator">

        <header className="calc-header">
          <div className="brand">
            <div className="brand-icon">✦</div>
            <div>
              <h1>CALCIFY</h1>
              <p>SMART CALCULATOR</p>
            </div>
          </div>
          <span className="status-dot"></span>
        </header>

        <section className="display-section">
          <p className="display-label">CURRENT VALUE</p>
          <div className="display">
            <span className="display-number">{display}</span>
          </div>
          <div className="display-bottom">
            <span>STANDARD MODE</span>
            <span>● READY</span>
          </div>
        </section>

        <section className="button-grid">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`calc-button ${button.type || ''} ${
                button.type === 'operator' && operator === button.label
                  ? 'active'
                  : ''
              }`}
              onClick={button.action}
              aria-label={button.label}
            >
              {button.label}
            </button>
          ))}
        </section>

        <footer className="calc-footer">
          <p>DESIGNED & DEVELOPED BY</p>
          <h3>Jayasree T S</h3>
          <span>Register No: YOUR REGISTER NUMBER</span>
          <div className="footer-line"></div>
          <small>© 2026 CALCIFY · ALL RIGHTS RESERVED</small>
        </footer>

      </div>
    </main>
  )
}

export default App
