// @vitest-environment jsdom

import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------------
// Hoisted mocks — created before vi.mock factories run
// ---------------------------------------------------------------------------

const { mockSaveGlobalCms, mockToastSuccess, mockToastError } = vi.hoisted(() => ({
  mockSaveGlobalCms: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("sonner", () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}));

// Mock @/features/landing-cms/actions — hooks import save actions from this path directly.
// The schemas are imported from @/features/landing-cms/schema (no DB deps, no mock needed).
vi.mock("@/features/landing-cms/actions", () => ({
  saveGlobalCms: mockSaveGlobalCms,
  saveHomeCms: vi.fn(),
  saveAboutCms: vi.fn(),
  saveProjectCms: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports — after mock setup
// ---------------------------------------------------------------------------

import { useGlobalForm } from "../_components/landing-cms-client/hooks/use-global-form";
import { GlobalTab } from "../_components/landing-cms-client/components/global-tab";
import { INITIAL_GLOBAL } from "../_components/landing-cms-client/constants";

// ---------------------------------------------------------------------------
// Test wrapper — combines the hook with the tab component (mirrors real usage)
// ---------------------------------------------------------------------------

const GlobalFormWrapper = () => {
  const { form, handleSave } = useGlobalForm(INITIAL_GLOBAL);
  return <GlobalTab form={form} onSave={handleSave} />;
};

// SaveRow renders two save buttons (desktop + mobile); either one drives the same submit.
const getSaveButton = () => screen.getAllByRole("button", { name: /save changes/i })[0]!;
// Fields are addressed by their accessible label: the form shell owns the generated id,
// so there is no stable id to target, and a label lookup fails loudly when it misses.
const getInput = (label: RegExp) => screen.getByLabelText(label);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("GlobalTab wiring", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSaveGlobalCms.mockResolvedValue({ ok: true, value: undefined });
  });

  afterEach(() => {
    cleanup();
  });

  it("Save button is disabled when no fields are changed", () => {
    render(<GlobalFormWrapper />);
    expect(getSaveButton().hasAttribute("disabled")).toBe(true);
  });

  it("Save button becomes enabled after editing a URL field", async () => {
    render(<GlobalFormWrapper />);

    const linkedinInput = getInput(/linkedin url/i);
    await user.clear(linkedinInput);
    await user.type(linkedinInput, "https://linkedin.com/in/newprofile");

    expect(getSaveButton().hasAttribute("disabled")).toBe(false);
  });

  it("shows inline validation error when an invalid URL is submitted — no success toast", async () => {
    render(<GlobalFormWrapper />);

    const linkedinInput = getInput(/linkedin url/i);
    await user.clear(linkedinInput);
    await user.type(linkedinInput, "not-a-valid-url");

    await user.click(getSaveButton());

    await waitFor(() => {
      expect(screen.queryByText("Enter a valid LinkedIn URL.")).toBeTruthy();
    });

    // Server action NOT called — client-side Zod blocked submit
    expect(mockSaveGlobalCms).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it("on valid submit: calls action, shows success toast, and resets dirty state", async () => {
    render(<GlobalFormWrapper />);

    const githubInput = getInput(/github profile url/i);
    await user.clear(githubInput);
    await user.type(githubInput, "https://github.com/newuser");

    expect(getSaveButton().hasAttribute("disabled")).toBe(false);

    await user.click(getSaveButton());

    await waitFor(() => {
      expect(mockSaveGlobalCms).toHaveBeenCalledOnce();
      expect(mockToastSuccess).toHaveBeenCalledWith("Global settings saved.");
    });

    // Dirty state resets after successful save → Save button disabled again
    await waitFor(() => {
      expect(getSaveButton().hasAttribute("disabled")).toBe(true);
    });
  });
});
