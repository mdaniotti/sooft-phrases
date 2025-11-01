import { render, screen } from "../../testUtils";
import userEvent from "@testing-library/user-event";
import PhraseCard from "../../components/PhraseCard";
import type { Phrase } from "../../context/phrasesCore";

describe("PhraseCard", () => {
  const mockPhrase: Phrase = {
    id: 1,
    text: "Test phrase",
    createdAt: "2024-01-01T00:00:00.000Z",
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the phrase correctly", () => {
    render(<PhraseCard phrase={mockPhrase} onDelete={mockOnDelete} />);

    expect(screen.getByText("Test phrase")).toBeInTheDocument();
    expect(screen.getByText(/Created at/)).toBeInTheDocument();
  });

  it("should show the delete button initially", () => {
    render(<PhraseCard phrase={mockPhrase} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByLabelText("Delete phrase");
    expect(deleteButton).toBeInTheDocument();
  });

  it("should show confirmation when clicking delete", async () => {
    const user = userEvent.setup();
    render(<PhraseCard phrase={mockPhrase} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByLabelText("Delete phrase");
    await user.click(deleteButton);

    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.queryByLabelText("Delete phrase")).not.toBeInTheDocument();
  });

  it("should call onDelete when deletion is confirmed", async () => {
    const user = userEvent.setup();
    render(<PhraseCard phrase={mockPhrase} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByLabelText("Delete phrase");
    await user.click(deleteButton);

    const confirmButton = screen.getByText("Confirm");
    await user.click(confirmButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("should cancel deletion when clicking Cancel", async () => {
    const user = userEvent.setup();
    render(<PhraseCard phrase={mockPhrase} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByLabelText("Delete phrase");
    await user.click(deleteButton);

    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Delete phrase")).toBeInTheDocument();
    expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
  });
});
