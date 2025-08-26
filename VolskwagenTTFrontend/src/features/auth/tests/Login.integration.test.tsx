import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as playerApi from "../services/playerApi";
import { toast } from "react-toastify";
import LoginPage from "../components/Login";


vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));


const loginMock = vi.fn();
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(() => ({ login: loginMock })),
}));


const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});



describe("LoginPage Integration Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillAndSubmitForm = async (username: string, password: string) => {
    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText("User"), { target: { value: username } });
    fireEvent.change(getByPlaceholderText("*******"), { target: { value: password } });

    fireEvent.click(getByRole("button", { name: /Login/i }));
  };

  it("should login successfully and navigate to /home", async () => {
    const fakeUser = { id: 1, username: "testuser", email: "test@email.com" };
    vi.spyOn(playerApi, "loginPlayer").mockResolvedValue(fakeUser);

    await fillAndSubmitForm("testuser", "password123");

    await waitFor(() => {
      expect(playerApi.loginPlayer).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Login successful!");
    expect(loginMock).toHaveBeenCalledWith(fakeUser);
    expect(mockedNavigate).toHaveBeenCalledWith("/home");
  });


  it("should show error toast on API error", async () => {
    const apiError = { error: "Invalid credentials" };
    vi.spyOn(playerApi, "loginPlayer").mockResolvedValue(apiError);

    await fillAndSubmitForm("wronguser", "wrongpass");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });

    expect(loginMock).not.toHaveBeenCalled();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
  

  it("should show error toast on unexpected exception", async () => {
    vi.spyOn(playerApi, "loginPlayer").mockRejectedValue(new Error("Network error"));

    await fillAndSubmitForm("user", "pass");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Unexpected error occurred");
    });

    expect(loginMock).not.toHaveBeenCalled();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
