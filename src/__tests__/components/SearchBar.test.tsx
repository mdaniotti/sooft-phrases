import userEvent from "@testing-library/user-event";
import { render as customRender, screen } from "../../testUtils";
import SearchBar from "../../components/SearchBar";

describe("SearchBar", () => {
  it("should render the search input", () => {
    customRender(<SearchBar />);

    const input = screen.getByLabelText("Search phrases");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Search");
  });

  it("should update the input value when the user types", async () => {
    const user = userEvent.setup({ delay: null });
    customRender(<SearchBar />);

    const input = screen.getByLabelText("Search phrases") as HTMLInputElement;
    await user.type(input, "test search");

    expect(input.value).toBe("test search");
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
});
