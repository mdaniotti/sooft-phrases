import { act } from "@testing-library/react";
import { render, screen, waitFor } from "../../testUtils";
import { PhraseGrid } from "../../components/PhraseGrid";
import type { Phrase } from "../../context/phrasesCore";

describe("PhraseGrid", () => {
  const mockPhrases: Phrase[] = [
    {
      id: 1,
      text: "First phrase",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      text: "Second phrase",
      createdAt: "2024-01-02T00:00:00.000Z",
    },
    {
      id: 3,
      text: "Third phrase",
      createdAt: "2024-01-03T00:00:00.000Z",
    },
  ];

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("should show loading initially", () => {
    render(<PhraseGrid phrases={mockPhrases} onDelete={mockOnDelete} />);

    expect(screen.getByText("Loading phrases...")).toBeInTheDocument();
  });

  it("should render all phrases after loading", async () => {
    render(<PhraseGrid phrases={mockPhrases} onDelete={mockOnDelete} />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.queryByText("Loading phrases...")).not.toBeInTheDocument();
      expect(screen.getByText("First phrase")).toBeInTheDocument();
      expect(screen.getByText("Second phrase")).toBeInTheDocument();
      expect(screen.getByText("Third phrase")).toBeInTheDocument();
    });
  });

  it("should render message when there are no phrases", async () => {
    render(<PhraseGrid phrases={[]} onDelete={mockOnDelete} />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText("No phrases yet")).toBeInTheDocument();
      expect(
        screen.getByText("Add your first inspirational phrase")
      ).toBeInTheDocument();
    });
  });
});
