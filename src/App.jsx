import { useState } from "react";
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1> Counter test</h1>
      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default App;
