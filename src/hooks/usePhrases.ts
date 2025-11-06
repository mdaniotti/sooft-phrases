import { useContext, useRef } from "react";
import {
  PhrasesContext,
  PhrasesDataContext,
  PhrasesFilterContext,
  PhrasesActionsContext,
} from "../context/phrasesCore";

/**
 * Base hook to access the phrases context
 * Prefer using specific selector hooks (usePhrasesFilter, usePhrasesList, etc.)
 * to avoid unnecessary rerenders
 */
const usePhrases = () => {
  const context = useContext(PhrasesContext);
  if (!context) {
    throw new Error("usePhrases must be used within PhrasesProvider");
  }
  return context;
};

/**
 * Selector hook for filter state
 * Only rerenders when filter or setFilter changes
 * Uses a separate context to avoid rerenders from other state changes
 *
 * Note: This hook will still cause a rerender when the provider rerenders,
 * but it ensures the returned value only changes when filter/setFilter actually change
 */
export const usePhrasesFilter = () => {
  const context = useContext(PhrasesFilterContext);
  if (!context) {
    throw new Error("usePhrasesFilter must be used within PhrasesProvider");
  }

  const prevValue = useRef<typeof context>(context);

  // Only update ref if filter or setFilter actually changed
  if (
    prevValue.current.filter !== context.filter ||
    prevValue.current.setFilter !== context.setFilter
  ) {
    prevValue.current = context;
  }

  return prevValue.current;
};

/**
 * Selector hook for phrases list
 * Only rerenders when phrases array reference changes
 * Uses a separate context to avoid rerenders from filter or action changes
 *
 * Note: This hook will still cause a rerender when the provider rerenders,
 * but it ensures the returned value only changes when phrases actually changes
 */
export const usePhrasesList = () => {
  const context = useContext(PhrasesDataContext);
  if (!context) {
    throw new Error("usePhrasesList must be used within PhrasesProvider");
  }

  const prevPhrases = useRef(context);

  // Only update ref if phrases actually changed
  if (prevPhrases.current !== context) {
    prevPhrases.current = context;
  }

  return prevPhrases.current;
};

/**
 * Selector hook for addPhrase action
 * Only rerenders when addPhrase function reference changes (should be stable)
 * Uses a separate context to avoid rerenders from state changes
 *
 * Note: This hook will still cause a rerender when the provider rerenders,
 * but it ensures the returned value only changes when addPhrase actually changes
 */
export const usePhrasesAdd = () => {
  const context = useContext(PhrasesActionsContext);
  if (!context) {
    throw new Error("usePhrasesAdd must be used within PhrasesProvider");
  }

  const prevAddPhrase = useRef(context.addPhrase);

  // Only update ref if addPhrase actually changed
  if (prevAddPhrase.current !== context.addPhrase) {
    prevAddPhrase.current = context.addPhrase;
  }

  return prevAddPhrase.current;
};

/**
 * Selector hook for deletePhrase action
 * Only rerenders when deletePhrase function reference changes (should be stable)
 * Uses a separate context to avoid rerenders from state changes
 *
 * Note: This hook will still cause a rerender when the provider rerenders,
 * but it ensures the returned value only changes when deletePhrase actually changes
 */
export const usePhrasesDelete = () => {
  const context = useContext(PhrasesActionsContext);
  if (!context) {
    throw new Error("usePhrasesDelete must be used within PhrasesProvider");
  }

  const prevDeletePhrase = useRef(context.deletePhrase);

  // Only update ref if deletePhrase actually changed
  if (prevDeletePhrase.current !== context.deletePhrase) {
    prevDeletePhrase.current = context.deletePhrase;
  }

  return prevDeletePhrase.current;
};

export default usePhrases;
