import { useContext } from "react";
import { PhrasesContext } from "../context/phrasesCore";

const usePhrases = () => {
  const context = useContext(PhrasesContext);
  if (!context) {
    throw new Error("usePhrases must be used within PhrasesProvider");
  }
  return context;
};

export default usePhrases;
