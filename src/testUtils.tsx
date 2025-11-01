/* @refresh reset */
import React from "react";
import {
  render as rtlRender,
  screen,
  waitFor,
  type RenderOptions,
} from "@testing-library/react";
import { PhrasesProvider } from "./context/PhrasesContext";

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) =>
  rtlRender(ui, {
    wrapper: ({ children }) => <PhrasesProvider>{children}</PhrasesProvider>,
    ...options,
  });

export {
  customRender as render,
  rtlRender as renderWithoutProvider,
  screen,
  waitFor,
};
