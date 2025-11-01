import { createContext } from "react";

export type Phrase = {
  id: number;
  text: string;
  createdAt: string;
};

export type PhrasesState = {
  phrases: Phrase[];
  filter: string;
};

export const ACTIONS = {
  ADD_PHRASE: "ADD_PHRASE",
  DELETE_PHRASE: "DELETE_PHRASE",
  SET_PHRASES: "SET_PHRASES",
  SET_FILTER: "SET_FILTER",
} as const;

export type PhrasesAction =
  | { type: typeof ACTIONS.ADD_PHRASE; payload: Phrase }
  | { type: typeof ACTIONS.DELETE_PHRASE; payload: number | string }
  | { type: typeof ACTIONS.SET_PHRASES; payload: Phrase[] }
  | { type: typeof ACTIONS.SET_FILTER; payload: string };

export const phrasesReducer = (
  state: PhrasesState,
  action: PhrasesAction
): PhrasesState => {
  switch (action.type) {
    case ACTIONS.ADD_PHRASE:
      return {
        ...state,
        phrases: [...state.phrases, action.payload],
      };
    case ACTIONS.DELETE_PHRASE:
      return {
        ...state,
        phrases: state.phrases.filter((p) => p.id !== action.payload),
      };
    case ACTIONS.SET_PHRASES:
      return {
        ...state,
        phrases: action.payload,
      };
    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    default:
      return state;
  }
};

export type PhrasesContextValue = {
  phrases: Phrase[];
  filter: string;
  addPhrase: (text: string) => void;
  deletePhrase: (id: number | string) => void;
  setFilter: (filter: string) => void;
};

export const PhrasesContext = createContext<PhrasesContextValue | null>(null);
