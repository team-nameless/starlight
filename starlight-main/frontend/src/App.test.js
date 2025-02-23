import { render, screen } from "@testing-library/react";

import SongPage from "./SongPage";

test("renders learn react link", () => {
    render(<SongPage />);
    const linkElement = screen.getByText(/Songs/i);
    expect(linkElement).toBeInTheDocument();
});
