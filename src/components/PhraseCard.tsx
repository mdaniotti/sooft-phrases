import { memo, useCallback, useState } from "react";
import { Trash2 } from "lucide-react";

import type { Phrase } from "../context/phrasesCore";
import ConfirmDialog from "./ConfirmDialog";

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

  const handleClose = useCallback(() => {
    setShowConfirm(false);
  }, []);

  return (
    <>
      <div className="phrase-card">
        <p className="phrase-card-text gray-color">{phrase.text}</p>

        <div className="phrase-card-footer">
          <p className="phrase-card-date orange-color">
            Created at {new Date(phrase.createdAt).toLocaleDateString()}
          </p>

          <button
            onClick={handleDelete}
            className="phrase-card-delete-btn"
            aria-label="Delete phrase"
          >
            <Trash2 width={18} height={18} className="orange-color" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={handleClose}
        onConfirm={confirmDelete}
        title="Confirm deletion"
        message={`Are you sure you want to delete the phrase "${phrase.text}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
});

PhraseCard.displayName = "PhraseCard";

export default PhraseCard;
