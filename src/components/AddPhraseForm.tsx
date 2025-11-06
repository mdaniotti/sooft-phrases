import { useState, useCallback, memo } from "react";

import { usePhrasesAdd } from "../hooks/usePhrases";
import { MAX_LENGTH_PHRASE } from "../constants";

const AddPhraseForm = memo(() => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const addPhrase = usePhrasesAdd();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmedText = text.trim();

      if (!trimmedText) {
        setError("The phrase cannot be empty");
        return;
      }

      if (trimmedText.length > MAX_LENGTH_PHRASE) {
        setError(`The phrase cannot exceed ${MAX_LENGTH_PHRASE} characters`);
        return;
      }

      addPhrase(trimmedText);
      setText("");
      setError("");
    },
    [text, addPhrase]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      setError("");
    },
    []
  );

  const remaining = MAX_LENGTH_PHRASE - text.length;
  // Changes the counter style when there are less than 50 characters remaining
  const isNearLimit = remaining < 50;

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form-row">
          <div className="form-input-wrapper">
            <textarea
              value={text}
              onChange={handleChange}
              placeholder="Write an inspirational phrase ..."
              rows={3}
              className={`form-textarea ${error ? "error" : ""}`}
              aria-label="New phrase"
              aria-invalid={!!error}
            />
            <div
              className={`form-char-counter ${isNearLimit ? "near-limit" : ""}`}
            >
              {remaining}
            </div>
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className="button-primary"
            aria-label="Add phrase"
          >
            Add Phrase
          </button>
        </form>
        {error && <div className="form-error">{error}</div>}
      </div>
    </div>
  );
});

AddPhraseForm.displayName = "AddPhraseForm";

export default AddPhraseForm;
