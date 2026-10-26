import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("shows the image when the URL is valid", () => {
    render(<Avatar src="https://example.com/a.png" name="Dana Dev" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/a.png");
  });

  it("falls back to initials when the image fails to load (e.g. the old 502 avatar)", () => {
    render(<Avatar src="https://avatar.iran.liara.run/public/74.png" name="Dana Dev" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("DD")).toBeInTheDocument();
  });

  it("shows initials straight away when there is no URL", () => {
    render(<Avatar src="" name="priya" />);
    expect(screen.getByText("P")).toBeInTheDocument();
  });

  it("gives a NEW url a fresh chance after an earlier one failed", () => {
    const { rerender } = render(<Avatar src="https://bad.example/x.png" name="Dana Dev" />);
    fireEvent.error(screen.getByRole("img"));
    rerender(<Avatar src="https://good.example/y.png" name="Dana Dev" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://good.example/y.png");
  });

  it("survives a missing name", () => {
    render(<Avatar src="" />);
    expect(screen.getByText("N")).toBeInTheDocument();
  });
});
