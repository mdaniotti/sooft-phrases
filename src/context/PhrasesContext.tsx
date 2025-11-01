import React, { useReducer, useEffect, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  ACTIONS,
  PhrasesContext,
  phrasesReducer,
  type Phrase,
  type PhrasesState,
} from "./phrasesCore";

export const PhrasesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [persistedPhrases, setPersistedPhrases] = useLocalStorage<Phrase[]>(
    "phrases",
    []
  );

  const initialState: PhrasesState = {
    phrases: persistedPhrases,
    filter: "",
  };

  const [state, dispatch] = useReducer(phrasesReducer, initialState);

  // Sync con localStorage
  useEffect(() => {
    setPersistedPhrases(state.phrases);
  }, [state.phrases, setPersistedPhrases]);

  const addPhrase = useCallback((text: string) => {
    const newPhrase = {
      id: Date.now() + Math.random(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: ACTIONS.ADD_PHRASE, payload: newPhrase });
  }, []);

  const deletePhrase = useCallback((id: number | string) => {
    dispatch({ type: ACTIONS.DELETE_PHRASE, payload: id });
  }, []);

  const setFilter = useCallback((filter: string) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: filter });
  }, []);

  const value = {
    phrases: state.phrases,
    filter: state.filter,
    addPhrase,
    deletePhrase,
    setFilter,
  };

  return (
    <PhrasesContext.Provider value={value}>{children}</PhrasesContext.Provider>
  );
};
