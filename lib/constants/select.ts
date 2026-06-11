// Radix Select forbids an empty-string item value, so a "clear" / "all" option needs a
// non-empty sentinel that consumers map back to `null` on change. Shared so the filter
// widgets that offer a clear item (select-input, date-range presets) agree on one value.
export const SELECT_CLEAR_VALUE = "__clear__";
