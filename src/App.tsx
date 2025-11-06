import { useMemo, useEffect, useState, useRef, useDeferredValue } from "react";
import { Activity } from "react"; // NOTE: New React feature, see https://react.dev/reference/react/use
import { Search } from "lucide-react";

import {
  AddPhraseForm,
  SearchBar,
  PhraseGrid,
  Footer,
  EmptyData,
} from "./components";
import {
  usePhrasesList,
  usePhrasesFilter,
  usePhrasesDelete,
} from "./hooks/usePhrases";
import sooft from "./assets/sooft.png";
import { REGEX_ESCAPE_SPECIAL_CHARACTERS } from "./constants";
import "./App.css"; // TODO: Consider use Tailwind CSS

// Escape special regex characters to prevent false positives
const escapeRegExp = (string: string): string => {
  return string.replace(REGEX_ESCAPE_SPECIAL_CHARACTERS, "\\$&");
};

function App() {
  const phrases = usePhrasesList();
  const { filter } = usePhrasesFilter();
  const deletePhrase = usePhrasesDelete();
  const [searchAnnouncement, setSearchAnnouncement] = useState("");
  const [deleteAnnouncement, setDeleteAnnouncement] = useState("");
  const prevPhrasesLength = useRef(phrases.length);
  const prevFilteredLength = useRef(0);

  // Defer filter value to keep UI responsive during filtering of large lists
  const deferredFilter = useDeferredValue(filter);

  // Case-insensitive filtering of phrases based on the deferred search term
  const filteredPhrases = useMemo(() => {
    if (!deferredFilter.trim()) return phrases;

    const searchRegex = new RegExp(escapeRegExp(deferredFilter), "i");
    return phrases.filter((phrase) => searchRegex.test(phrase.text));
  }, [phrases, deferredFilter]);

  // Announce search results when deferred filter changes
  useEffect(() => {
    if (deferredFilter && deferredFilter.trim().length >= 3) {
      const count = filteredPhrases.length;
      const message = `${count} result${count !== 1 ? "s" : ""} found`;
      if (prevFilteredLength.current !== count) {
        setSearchAnnouncement(message);
        prevFilteredLength.current = count;
      }
    } else {
      prevFilteredLength.current = 0;
      setSearchAnnouncement("");
    }
  }, [deferredFilter, filteredPhrases.length]);

  // Announce phrase deletion
  useEffect(() => {
    if (phrases.length < prevPhrasesLength.current) {
      setDeleteAnnouncement("Phrase deleted");
      // Clear announcement after a delay to allow screen reader to announce it
      const timer = setTimeout(() => setDeleteAnnouncement(""), 1000);
      return () => clearTimeout(timer);
    }
    prevPhrasesLength.current = phrases.length;
  }, [phrases.length]);

  return (
    <div className="app-container">
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {searchAnnouncement && <div key="search">{searchAnnouncement}</div>}
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {deleteAnnouncement && <div key="delete">{deleteAnnouncement}</div>}
      </div>
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
              <h2 className="phrases-title">All Phrases</h2>
              <SearchBar />
            </div>
            <div className="phrases-stats">
              {deferredFilter && (
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

          {/* Show EmptyData only when there is a filter active and no results */}
          <Activity
            mode={
              deferredFilter && filteredPhrases.length === 0
                ? "visible"
                : "hidden"
            }
          >
            <EmptyData
              icon={<Search size={48} className="gray-color" />}
              title="No results found"
              description="Try with other search terms"
            />
          </Activity>
          {/* Show PhraseGrid when there is no filter or when there are results */}
          <Activity
            mode={
              deferredFilter && filteredPhrases.length === 0
                ? "hidden"
                : "visible"
            }
          >
            <PhraseGrid phrases={filteredPhrases} onDelete={deletePhrase} />
          </Activity>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;
