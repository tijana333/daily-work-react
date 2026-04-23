import EntryForm from "./components/EntryForm/EntryForm";
import EntriesList from "./components/EntriesList/EntriesList";
import EntryCard from "./components/EntryCard/EntryCard";
import EntryModal from "./components/EntryModal/EntryModal";
import Heatmap from "./components/Heatmap/Heatmap";

function App() {
  return (
    <div>
      <h1>Daily Work</h1>

      <EntryForm />
      <EntriesList />
      <EntryCard />
      <EntryModal />
      <Heatmap />
    </div>
  );
}

export default App;
