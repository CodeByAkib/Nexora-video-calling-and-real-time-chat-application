import { Profiler } from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("../lib/api", () => ({
  getUserFriends: vi.fn(),
  getRecommendedUsers: vi.fn(),
  getOutgoingFriendReqs: vi.fn(),
  sendFriendRequest: vi.fn(),
}));

vi.mock("react-hot-toast", () => {
  const toast = Object.assign(vi.fn(), { error: vi.fn(), success: vi.fn() });
  return { default: toast };
});

import toast from "react-hot-toast";
import * as api from "../lib/api";
import HomePage from "./HomePage";

// Safety valve: a healthy page renders a handful of times. If something loops, abort the
// tree after MAX_RENDERS so the test fails with a clear message instead of freezing.
const MAX_RENDERS = 200;

const renderHome = (onRender = () => {}) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Profiler
          id="home"
          onRender={() => {
            onRender();
          }}
        >
          <HomePage />
        </Profiler>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("HomePage", () => {
  let consoleError;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    api.getUserFriends.mockResolvedValue([]);
    api.getRecommendedUsers.mockResolvedValue([]);
  });

  afterEach(() => consoleError.mockRestore());

  it("does not re-render endlessly while the outgoing-requests query is still pending", async () => {
    // A query that never settles keeps `data` undefined, which is exactly when a
    // fresh `[]` default used to retrigger the effect on every render.
    api.getOutgoingFriendReqs.mockReturnValue(new Promise(() => {}));

    let renders = 0;
    renderHome(() => {
      renders += 1;
      if (renders > MAX_RENDERS) throw new Error(`render loop detected (${renders} renders)`);
    });

    await new Promise((resolve) => setTimeout(resolve, 400));

    const depthWarning = consoleError.mock.calls.some((args) =>
      String(args[0]).includes("Maximum update depth exceeded")
    );
    expect(depthWarning).toBe(false);
    expect(renders).toBeLessThan(30);
  });

  it("does not re-render endlessly when the outgoing-requests query fails", async () => {
    api.getOutgoingFriendReqs.mockRejectedValue(new Error("boom"));

    let renders = 0;
    renderHome(() => {
      renders += 1;
      if (renders > MAX_RENDERS) throw new Error(`render loop detected (${renders} renders)`);
    });

    await new Promise((resolve) => setTimeout(resolve, 400));

    const depthWarning = consoleError.mock.calls.some((args) =>
      String(args[0]).includes("Maximum update depth exceeded")
    );
    expect(depthWarning).toBe(false);
    expect(renders).toBeLessThan(30);
  });

  it("marks a recommended user as 'Request Sent' once an outgoing request exists", async () => {
    api.getRecommendedUsers.mockResolvedValue([
      { _id: "u1", fullName: "Dana Dev", role: "Designer", interests: ["Music"], bio: "hi", location: "Pune" },
    ]);
    api.getOutgoingFriendReqs.mockResolvedValue([{ _id: "r1", recipient: { _id: "u1" } }]);

    renderHome();

    expect(await screen.findByText("Request Sent")).toBeInTheDocument();
  });

  it("shows the server's error message when sending a friend request fails", async () => {
    api.getRecommendedUsers.mockResolvedValue([
      { _id: "u2", fullName: "Eli Engineer", role: "Student", interests: [], bio: "", location: "" },
    ]);
    api.getOutgoingFriendReqs.mockResolvedValue([]);
    api.sendFriendRequest.mockRejectedValue({
      response: { data: { message: "A friend request already exists between you and this user" } },
    });

    renderHome();

    fireEvent.click(await screen.findByRole("button", { name: /send friend request/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "A friend request already exists between you and this user"
      )
    );
  });
});
