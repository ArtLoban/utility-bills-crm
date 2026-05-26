// Filter state types — UI-only, not from mock data.
// Keep here for colocation with the global meters list page.

export type TMeterStatus = "active" | "historical" | "all";

export type TFilterState = {
  property: string;
  service: string;
  status: TMeterStatus;
};
