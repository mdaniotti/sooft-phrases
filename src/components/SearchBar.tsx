import { useState, useCallback, useEffect, startTransition, memo } from "react";
import { useDebounce } from "use-debounce";
import { Search, X } from "lucide-react";

import { usePhrasesFilter } from "../hooks/usePhrases";
import { DEBOUNCE_TIME, REGEX_ALL_SPACES } from "../constants";

const MIN_SEARCH_LENGTH = 3;

const SearchBar = memo(() => {
  const { filter, setFilter } = usePhrasesFilter();
  const [localValue, setLocalValue] = useState(filter);
  const [debouncedValue] = useDebounce(localValue, DEBOUNCE_TIME);

  // Synchronize the debounced value with the global context using startTransition to mark filter updates as non-urgent and keep UI responsive
  useEffect(() => {
    startTransition(() => {
      setFilter(
        debouncedValue.length >= MIN_SEARCH_LENGTH ? debouncedValue : ""
      );
    });
  }, [debouncedValue, setFilter]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = e.target.value.replace(REGEX_ALL_SPACES, "");
    setLocalValue(normalized);
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue("");
    startTransition(() => {
      setFilter("");
    });
  }, [setFilter]);

  const needsMoreChars =
    localValue.length > 0 && localValue.length < MIN_SEARCH_LENGTH;

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar-container">
        <div className="search-bar-icon">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder="Search phrases ..."
          className={`search-bar-input ${
            needsMoreChars ? "search-bar-input-warning" : ""
          }`}
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
      {needsMoreChars && (
        <div className="search-bar-hint">
          Enter at least {MIN_SEARCH_LENGTH} characters ({localValue.length}/
          {MIN_SEARCH_LENGTH})
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
