type TSubmitLabelKey =
  | "actions.save"
  | "actions.saveAnyway"
  | "actions.submit"
  | "actions.submitAnyway";

export const readingSubmitLabelKey = (isEdit: boolean, hasWarning: boolean): TSubmitLabelKey => {
  if (isEdit) return hasWarning ? "actions.saveAnyway" : "actions.save";

  return hasWarning ? "actions.submitAnyway" : "actions.submit";
};
