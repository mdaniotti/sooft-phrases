import userEvent from "@testing-library/user-event";
import { render as customRender, screen, waitFor } from "../testUtils";
import App from "../App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should show the total phrases", async () => {
    customRender(<App />);

    await waitFor(
      () => {
        expect(screen.getByText(/Total Phrases:/)).toBeInTheDocument();
        expect(screen.getByText("0")).toBeInTheDocument();
      },
      { timeout: 400 }
    );
  });

  it("should add a new phrase", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<App />);

    await waitFor(
      () => {
        expect(
          screen.queryByText("Loading phrases...")
        ).not.toBeInTheDocument();
      },
      { timeout: 400 }
    );

    const textarea = screen.getByLabelText("New phrase");
    const button = screen.getByLabelText("Add phrase");

    await user.type(textarea, "New test phrase");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("New test phrase")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument(); // Total Phrases: 1
    });
  });

  it("should filter phrases correctly", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<App />);

    await waitFor(
      () => {
        expect(
          screen.queryByText("Loading phrases...")
        ).not.toBeInTheDocument();
      },
      { timeout: 400 }
    );

    const textarea = screen.getByLabelText("New phrase");
    const addButton = screen.getByLabelText("Add phrase");

    await user.type(textarea, "First phrase");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("First phrase")).toBeInTheDocument();
    });

    await user.type(textarea, "Second phrase");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Second phrase")).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText("Search phrases");
    await user.type(searchInput, "First");

    await waitFor(() => {
      expect(screen.getByText("First phrase")).toBeInTheDocument();
      expect(screen.queryByText("Second phrase")).not.toBeInTheDocument();
      expect(screen.getByText("1 found")).toBeInTheDocument();
    });
  });

  it("should show message when there are no search results", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<App />);

    await waitFor(
      () => {
        expect(
          screen.queryByText("Loading phrases...")
        ).not.toBeInTheDocument();
      },
      { timeout: 400 }
    );

    const textarea = screen.getByLabelText("New phrase");
    const addButton = screen.getByLabelText("Add phrase");

    await user.type(textarea, "Test phrase");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Test phrase")).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText("Search phrases");
    await user.type(searchInput, "xyz123");

    await waitFor(() => {
      expect(screen.getByText("No results found")).toBeInTheDocument();
      expect(
        screen.getByText("Try with other search terms")
      ).toBeInTheDocument();
    });
  });
});
