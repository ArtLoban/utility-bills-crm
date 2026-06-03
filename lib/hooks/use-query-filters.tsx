import { parseAsInteger, SingleParserBuilder, useQueryStates } from "nuqs";
import { DATA_TABLE_PARAMS } from "@/components/data-table/types";
import { PAGE_DEFAULT } from "@/components/data-table/constants";
import { type DefaultValues, useForm, useWatch } from "react-hook-form";
import { getInitialValuesFromUrl } from "../utils/get-initial-values-from-url";
import { useEffect, useRef } from "react";

export const useQueryFilters = <T extends Record<string, unknown>>(
  parsers: Record<string, SingleParserBuilder<string>>,
  initialValues: T,
) => {
  const [query, setQuery] = useQueryStates(
    {
      ...parsers,
      [DATA_TABLE_PARAMS.PAGE]: parseAsInteger.withDefault(PAGE_DEFAULT),
    },
    { history: "replace", shallow: false },
  );

  const form = useForm<T>({
    defaultValues: getInitialValuesFromUrl(
      query,
      Object.keys(parsers),
      initialValues,
    ) as DefaultValues<T>,
  });

  const values = useWatch({
    control: form.control,
  });

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    void setQuery({
      ...values,
      [DATA_TABLE_PARAMS.PAGE]: PAGE_DEFAULT,
    });
  }, [values, setQuery]);

  const handleClear = () => form.reset(initialValues);
  const hasActiveFilters = Object.values(values).some(Boolean);

  return {
    form,
    values,
    handleClear,
    hasActiveFilters,
  };
};
