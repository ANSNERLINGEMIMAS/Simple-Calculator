
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [history, setHistory] = useState([]);

  const formatNumber = (number) => {
    if (!Number.isFinite(number)) return "Error";
    return String(Number(number.toPrecision(12)));
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? "Error" : a / b;
      default:
        return b;
    }
  };

  const inputDigit = (digit) => {
    if (display === "Error") {
      setDisplay(digit);
      setWaiting(false);
      return;
    }

    if (waiting) {
      setDisplay(digit);
      setWaiting(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (display === "Error" || waiting) {
      setDisplay("0.");
      setWaiting(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
    setWaiting(false);
  };

  const deleteLast = () => {
    if (display === "Error" || waiting) {
      setDisplay("0");
      setWaiting(false);
      return;
    }

    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  };

  const chooseOperator = (nextOperator) => {
    if (display === "Error") return;

    const value = Number(display);

    if (operator && !waiting) {
      const result = calculate(previous, value, operator);

      if (result === "Error") {
        setDisplay("Error");
        setPrevious(null);
        setOperator(null);
        setWaiting(true);
        return;
      }

      setDisplay(formatNumber(result));
      setPrevious(result);
    } else {
      setPrevious(value);
    }

    setOperator(nextOperator);
    setWaiting(true);
  };

  const performCalculation = () => {
    if (
      operator === null ||
      previous === null ||
      display === "Error" ||
      waiting
    ) return;

    const second = Number(display);
    const result = calculate(previous, second, operator);

    setHistory((items) =>
      [`${previous} ${operator} ${second} = ${formatNumber(result)}`, ...items].slice(0, 4)
    );

    setDisplay(formatNumber(result));
    setPrevious(null);
    setOperator(null);
    setWaiting(true);
  };

  const percentage = () => {
    if (display === "Error") return;
    setDisplay(formatNumber(Number(display) / 100));
    setWaiting(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (/^[0-9]$/.test(key)) inputDigit(key);
      else if (key === ".") inputDecimal();
      else if (key === "+") chooseOperator("+");
      else if (key === "-") chooseOperator("-");
      else if (key === "*") chooseOperator("×");
      else if (key === "/") {
        event.preventDefault();
        chooseOperator("÷");
      } else if (key === "Enter" || key === "=") {
        performCalculation();
      } else if (key === "Backspace") {
        deleteLast();
      } else if (key === "Escape") {
        clearAll();
      } else if (key === "%") {
        percentage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const buttons = [
    { label: "AC", type: "utility", action: clearAll },
    { label: "DEL", type: "utility", action: deleteLast },
    { label: "%", type: "utility", action: percentage },
    { label: "÷", type: "operator", action: () => chooseOperator("÷") },

    { label: "7", action: () => inputDigit("7") },
    { label: "8", action: () => inputDigit("8") },
    { label: "9", action: () => inputDigit("9") },
    { label: "×", type: "operator", action: () => chooseOperator("×") },

    { label: "4", action: () => inputDigit("4") },
    { label: "5", action: () => inputDigit("5") },
    { label: "6", action: () => inputDigit("6") },
    { label: "-", type: "operator", action: () => chooseOperator("-") },

    { label: "1", action: () => inputDigit("1") },
    { label: "2", action: () => inputDigit("2") },
    { label: "3", action: () => inputDigit("3") },
    { label: "+", type: "operator", action: () => chooseOperator("+") },

    {
      label: "00",
      action: () => {
        inputDigit("0");
        inputDigit("0");
      },
    },
    { label: "0", action: () => inputDigit("0") },
    { label: ".", action: inputDecimal },
    { label: "=", type: "equals", action: performCalculation },
  ];

  return (
    <main className="app-container">
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>

      <div className="workspace">
        <aside className="intro-panel">
          <div className="logo-mark">A</div>

          <p className="eyebrow">SMART TOOLS / 01</p>
          <h1>
            A little
            <br />
            more <span>precise.</span>
          </h1>

          <p className="intro-description">
            A simple space for everyday calculations.
            Designed to feel clear, calm and effortless.
          </p>

          <div className="feature-list">
            <div>
              <span className="feature-number">01</span>
              <span>Quick calculations</span>
            </div>
            <div>
              <span className="feature-number">02</span>
              <span>Keyboard support</span>
            </div>
            <div>
              <span className="feature-number">03</span>
              <span>Recent results</span>
            </div>
          </div>

          <div className="intro-bottom">
            <span>BUILT FOR EVERYDAY MATH</span>
            <span>↗</span>
          </div>
        </aside>

        <section className="calculator">
          <header className="calc-header">
            <div>
              <p className="calc-label">AEROCALC</p>
              <p className="calc-subtitle">STANDARD CALCULATOR</p>
            </div>
            <div className="live-indicator">
              <span></span> READY
            </div>
          </header>

          <div className="display-section">
            <p className="display-label">YOUR RESULT</p>

            <div className="expression">
              {previous !== null && operator
                ? `${formatNumber(previous)} ${operator}`
                : "Let's calculate"}
            </div>

            <div className="display">
              <span>{display}</span>
            </div>
          </div>

          <div className="button-grid">
            {buttons.map((button) => (
              <button
                key={button.label}
                className={`calc-button ${button.type || ""} ${
                  button.type === "operator" && operator === button.label
                    ? "active"
                    : ""
                }`}
                onClick={button.action}
                aria-label={button.label}
              >
                {button.label}
              </button>
            ))}
          </div>

          <section className="history-section">
            <div className="history-heading">
              <h2>Recent</h2>
              <button onClick={() => setHistory([])}>Clear</button>
            </div>

            {history.length === 0 ? (
              <p className="empty-history">Your results will appear here.</p>
            ) : (
              history.map((item, index) => (
                <p className="history-item" key={index}>{item}</p>
              ))
            )}
          </section>
        </section>
      </div>

      <footer className="page-footer">
        <div>
          <span className="footer-label">DESIGNED & DEVELOPED BY</span>
          <strong>Ans Nerling Emima S</strong>
        </div>

        <div className="footer-register">
          <span className="footer-label">212224040027</span>
          <strong>212224040027</strong>
        </div>

        <span className="footer-copyright">AEROCALC © 2026</span>
      </footer>
    </main>
  );
}

export default App;
