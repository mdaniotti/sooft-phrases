import userEvent from "@testing-library/user-event";
import { render as customRender, screen, waitFor } from "../../testUtils";
import { fireEvent, act } from "@testing-library/react";
import SearchBar from "../../components/SearchBar";
import { DEBOUNCE_TIME } from "../../constants";
import { usePhrasesFilter } from "../../hooks/usePhrases";

jest.mock("../../hooks/usePhrases");

const mockSetFilter = jest.fn();
const mockUsePhrasesFilter = usePhrasesFilter as jest.MockedFunction<
  typeof usePhrasesFilter
>;

describe("SearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePhrasesFilter.mockReturnValue({
      filter: "",
      setFilter: mockSetFilter,
    });
  });

  it("should render the search input", () => {
    customRender(<SearchBar />);

    const input = screen.getByLabelText("Search phrases");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Search phrases ...");
  });

  it("should update the input value when the user types", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<SearchBar />);

    const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
    await user.type(input, "test search");

    expect(input.value).toBe("testsearch");
  });

  it("should show the clear button when there is text", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<SearchBar />);

    const input = screen.getByLabelText("Search phrases");
    await user.type(input, "test");

    const clearButton = screen.getByLabelText("Clear search");
    expect(clearButton).toBeInTheDocument();
  });

  it("should hide the clear button when there is no text", () => {
    customRender(<SearchBar />);

    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
  });

  it("should clear the input when clicking the clear button", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<SearchBar />);

    const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
    await user.type(input, "test");
    await user.click(screen.getByLabelText("Clear search"));

    expect(input.value).toBe("");
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
  });

  describe("Debounce", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();
    });

    it("should not call setFilter before debounce time expires", async () => {
      const user = userEvent.setup({
        delay: null,
        advanceTimers: jest.advanceTimersByTime,
      });
      customRender(<SearchBar />);

      // Clear initial call from mount
      mockSetFilter.mockClear();

      const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
      await user.type(input, "test");

      expect(mockSetFilter).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_TIME - 1);
      });

      await waitFor(() => {
        expect(mockSetFilter).not.toHaveBeenCalled();
      });
    });

    it("should call setFilter after debounce time expires", async () => {
      const user = userEvent.setup({
        delay: null,
        advanceTimers: jest.advanceTimersByTime,
      });
      customRender(<SearchBar />);

      // Clear initial call from mount
      mockSetFilter.mockClear();

      const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
      await user.type(input, "test");

      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_TIME);
      });

      await waitFor(() => {
        expect(mockSetFilter).toHaveBeenCalledWith("test");
      });
    });

    it("should reset debounce timer when user continues typing", async () => {
      const user = userEvent.setup({
        delay: null,
        advanceTimers: jest.advanceTimersByTime,
      });
      customRender(<SearchBar />);

      // Clear initial call from mount
      mockSetFilter.mockClear();

      const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
      await user.type(input, "te");

      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_TIME - 100);
      });
      expect(mockSetFilter).not.toHaveBeenCalled();

      await user.type(input, "st");
      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_TIME - 100);
      });
      expect(mockSetFilter).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(100);
      });
      await waitFor(() => {
        expect(mockSetFilter).toHaveBeenCalledTimes(1);
        expect(mockSetFilter).toHaveBeenCalledWith("test");
      });
    });
  });

  describe("MinLength validation", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();
    });

    it("should not filter when input has less than 3 characters", async () => {
      const user = userEvent.setup({
        delay: null,
        advanceTimers: jest.advanceTimersByTime,
      });
      customRender(<SearchBar />);

      // Clear initial call from mount
      mockSetFilter.mockClear();

      const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
      await user.type(input, "te");

      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_TIME);
      });

      await waitFor(() => {
        expect(mockSetFilter).toHaveBeenCalledWith("");
      });
    });

    it("should show warning message when input has less than 3 characters", async () => {
      const user = userEvent.setup({ delay: null });
      customRender(<SearchBar />);

      const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
      await user.type(input, "te");

      const hint = screen.getByText(/Enter at least 3 characters \(2\/3\)/);
      expect(hint).toBeInTheDocument();
    });

    it("should filter when input has exactly 3 characters", async () => {
      const user = userEvent.setup({
        delay: null,
        advanceTimers: jest.advanceTimersByTime,
      });
      customRender(<SearchBar />);

      // Clear initial call from mount
      mockSetFilter.mockClear();

      const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
      await user.type(input, "tes");

      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_TIME);
      });

      await waitFor(() => {
        expect(mockSetFilter).toHaveBeenCalledWith("tes");
      });
    });

    it("should filter when input has more than 3 characters", async () => {
      const user = userEvent.setup({
        delay: null,
        advanceTimers: jest.advanceTimersByTime,
      });
      customRender(<SearchBar />);

      // Clear initial call from mount
      mockSetFilter.mockClear();

      const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
      await user.type(input, "test");

      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_TIME);
      });

      await waitFor(() => {
        expect(mockSetFilter).toHaveBeenCalledWith("test");
      });
    });

    it("should hide warning message when input has 3 or more characters", async () => {
      const user = userEvent.setup({ delay: null });
      customRender(<SearchBar />);

      const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
      await user.type(input, "test");

      expect(screen.queryByText(/Enter at least/)).not.toBeInTheDocument();
    });
  });

  describe("Special characters handling", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();
    });

    it("should handle regex special characters correctly", async () => {
      customRender(<SearchBar />);

      // Clear initial call from mount
      mockSetFilter.mockClear();

      const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
      const specialChars = ".*+?^${}()|[\\]";
      fireEvent.change(input, { target: { value: specialChars } });

      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_TIME);
      });

      await waitFor(() => {
        expect(mockSetFilter).toHaveBeenCalledWith(specialChars);
      });
    });

    it("should remove all spaces from input", async () => {
      const user = userEvent.setup({
        delay: null,
        advanceTimers: jest.advanceTimersByTime,
      });
      customRender(<SearchBar />);

      // Clear initial call from mount
      mockSetFilter.mockClear();

      const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
      await user.type(input, "test search with spaces");

      expect(input.value).toBe("testsearchwithspaces");

      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_TIME);
      });

      await waitFor(() => {
        expect(mockSetFilter).toHaveBeenCalledWith("testsearchwithspaces");
      });
    });

    it("should handle mix of special characters and normal text", async () => {
      customRender(<SearchBar />);

      // Clear initial call from mount
      mockSetFilter.mockClear();

      const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
      const mixedText = "test.*+?^${}()|[\\]search";
      fireEvent.change(input, { target: { value: mixedText } });

      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_TIME);
      });

      await waitFor(() => {
        expect(mockSetFilter).toHaveBeenCalledWith(mixedText);
      });
    });
  });
});
