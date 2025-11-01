import { useState, useCallback } from "react";

import usePhrases from "../hooks/usePhrases";
import { MAX_LENGTH_PHRASE } from "../constants";

const AddPhraseForm = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const { addPhrase } = usePhrases();

  const handleSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && e.ctrlKey) {
        handleSubmit(e as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    },
    [handleSubmit]
  );

  const remaining = MAX_LENGTH_PHRASE - text.length;
  const isNearLimit = remaining < 50;

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="form-row">
          <div className="form-input-wrapper">
            <textarea
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
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
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="button-primary"
            aria-label="Add phrase"
          >
            Add Phrase
          </button>
        </div>
        {error && <div className="form-error">{error}</div>}
      </div>
    </div>
  );
};

AddPhraseForm.displayName = "AddPhraseForm";

export default AddPhraseForm;
