import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Search, X } from "lucide-react";

import usePhrases from "../hooks/usePhrases";
import { DEBOUNCE_TIME } from "../constants";

const SearchBar = () => {
  const { filter, setFilter } = usePhrases();
  const [localValue, setLocalValue] = useState(filter);
  const [debouncedValue] = useDebounce(localValue, DEBOUNCE_TIME);

  useEffect(() => {
    setFilter(debouncedValue);
  }, [debouncedValue, setFilter]);

  const handleClear = useCallback(() => {
    setLocalValue("");
    setFilter("");
  }, [setFilter]);

  return (
    <div className="search-bar-container">
      <div className="search-bar-icon">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search"
        className="search-bar-input"
        aria-label="Search phrases"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="search-bar-clear-btn"
          aria-label="Clear search"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

SearchBar.displayName = "SearchBar";

export default SearchBar;
