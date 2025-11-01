import { memo } from "react";
import { FileX2 } from "lucide-react";

import withLoadingState from "../hoc/LoadingState";
import type { Phrase } from "../context/phrasesCore";
import { PhraseCard } from ".";

interface PhraseGridProps {
  phrases: Phrase[];
  onDelete: (id: number | string) => void;
}

const PhraseGridBase = memo(({ phrases, onDelete }: PhraseGridProps) => {
  if (phrases.length === 0) {
    return (
      <div className="phrase-grid-empty">
        <FileX2 width={48} height={48} className="gray-color" />
        <h3 className="gray-color">No phrases yet</h3>
        <p className="gray-color">Add your first inspirational phrase</p>
      </div>
    );
  }

  return (
    <div className="phrase-grid">
      {phrases.map((phrase) => (
        <PhraseCard key={phrase.id} phrase={phrase} onDelete={onDelete} />
      ))}
    </div>
  );
});

PhraseGridBase.displayName = "PhraseGridBase";

export const PhraseGrid = withLoadingState(PhraseGridBase);
