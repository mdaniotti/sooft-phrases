import userEvent from "@testing-library/user-event";
import { render as customRender, screen, waitFor } from "../../testUtils";
import AddPhraseForm from "../../components/AddPhraseForm";
import { MAX_LENGTH_PHRASE } from "../../constants";

describe("AddPhraseForm", () => {
  it("should have the button disabled when the input is empty", () => {
    customRender(<AddPhraseForm />);

    const button = screen.getByLabelText("Add phrase");
    expect(button).toBeDisabled();
  });

  it("should enable the button when there is text", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<AddPhraseForm />);

    const textarea = screen.getByLabelText("New phrase");
    const button = screen.getByLabelText("Add phrase");

    await user.type(textarea, "New phrase");

    expect(button).not.toBeDisabled();
  });

  it("should keep the button disabled when there are only spaces", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<AddPhraseForm />);

    const textarea = screen.getByLabelText("New phrase");
    await user.type(textarea, "   ");

    const button = screen.getByLabelText("Add phrase");
    expect(button).toBeDisabled();
  });

  it("should show error when the phrase exceeds the character limit", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<AddPhraseForm />);

    const textarea = screen.getByLabelText("New phrase");
    const longText = "a".repeat(MAX_LENGTH_PHRASE + 1);
    await user.type(textarea, longText);

    const button = screen.getByLabelText("Add phrase");
    await user.click(button);

    expect(
      screen.getByText(
        `The phrase cannot exceed ${MAX_LENGTH_PHRASE} characters`
      )
    ).toBeInTheDocument();
  });

  it("should clear the input after adding a valid phrase", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<AddPhraseForm />);

    const textarea = screen.getByLabelText("New phrase") as HTMLTextAreaElement;
    const button = screen.getByLabelText("Add phrase");

    await user.type(textarea, "New test phrase");
    await user.click(button);

    await waitFor(() => {
      expect(textarea.value).toBe("");
    });
  });

  it("should clear the error when writing again", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<AddPhraseForm />);

    const textarea = screen.getByLabelText("New phrase");
    // First write something valid to enable the button and be able to click
    await user.type(textarea, "test");

    const button = screen.getByLabelText("Add phrase");
    expect(button).not.toBeDisabled();

    // Clear and write only spaces (disables the button)
    await user.clear(textarea);
    await user.type(textarea, "   ");
    expect(button).toBeDisabled();

    // Write valid text again
    await user.clear(textarea);
    await user.type(textarea, "New phrase");

    expect(button).not.toBeDisabled();
    expect(
      screen.queryByText("The phrase cannot be empty")
    ).not.toBeInTheDocument();
  });
});
