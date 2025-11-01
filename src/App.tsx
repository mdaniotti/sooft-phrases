import { useMemo } from "react";
import { Search } from "lucide-react";

import { AddPhraseForm, SearchBar, PhraseGrid, Footer } from "./components";
import usePhrases from "./hooks/usePhrases";
import sooft from "./assets/sooft.png";
import "./App.css";

function App() {
  const { phrases, filter, deletePhrase } = usePhrases();

  const filteredPhrases = useMemo(() => {
    if (!filter.trim()) return phrases;

    const searchTerm = filter.toLowerCase();
    return phrases.filter((phrase) =>
      phrase.text.toLowerCase().includes(searchTerm)
    );
  }, [phrases, filter]);

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <header className="app-header">
          <img src={sooft} alt="Phrase manager" className="app-logo" />
          <h1 className="app-title gray-color">
            <span className="orange-color text-bold">Phrase</span> Manager
          </h1>
          <p className="app-subtitle">
            Organize and find your inspirational phrases
          </p>
        </header>

        <div className="content-card">
          <div className="form-section">
            <AddPhraseForm />
          </div>

          <div className="phrases-header">
            <div className="phrases-header-left">
              <h2 className="phrases-title">
                {filter ? "Results" : "All Phrases"}
              </h2>
              <SearchBar />
            </div>
            <div className="phrases-stats">
              {filter && (
                <span className="stat-badge">
                  {filteredPhrases.length} found
                  {filteredPhrases.length !== 1 ? "s" : ""}
                </span>
              )}
              <span className="gray-color">
                Total Phrases:{" "}
                <span className="text-bold">{phrases.length}</span>
              </span>
            </div>
          </div>

          {filter && filteredPhrases.length === 0 ? (
            <div className="phrase-grid-empty">
              <Search size={48} className="gray-color" />
              <h3 className="gray-color">No results found</h3>
              <p className="gray-color">Try with other search terms</p>
            </div>
          ) : (
            <PhraseGrid phrases={filteredPhrases} onDelete={deletePhrase} />
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;
