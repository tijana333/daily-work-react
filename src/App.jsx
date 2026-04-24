import EntryForm from "./components/EntryForm/EntryForm";

function App() {
  return (
    <div className="container">
      <header className="header">
        <div id="header-content">
          <h1 id="logo">Daily Work</h1>
          <p>Track your progress, one day at a time</p>
        </div>
      </header>

      <EntryForm />
    </div>
  );
}

export default App;
