import { memo, useCallback, useState } from "react";
import { Trash2 } from "lucide-react";

import type { Phrase } from "../context/phrasesCore";

interface PhraseCardProps {
  phrase: Phrase;
  onDelete: (id: number | string) => void;
}

const PhraseCard = memo(({ phrase, onDelete }: PhraseCardProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const confirmDelete = useCallback(() => {
    onDelete(phrase.id);
    setShowConfirm(false);
  }, [phrase.id, onDelete]);

  return (
    <div className="phrase-card">
      <p className="phrase-card-text gray-color">{phrase.text}</p>

      <div className="phrase-card-footer">
        <p className="phrase-card-date orange-color">
          Created at {new Date(phrase.createdAt).toLocaleDateString()}
        </p>

        {!showConfirm ? (
          <button
            onClick={handleDelete}
            className="phrase-card-delete-btn"
            aria-label="Delete phrase"
          >
            <Trash2 width={18} height={18} className="orange-color" />
          </button>
        ) : (
          <div className="phrase-card-confirm-actions">
            <button onClick={confirmDelete} className="button-confirm">
              Confirm
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="button-cancel"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

PhraseCard.displayName = "PhraseCard";

export default PhraseCard;
