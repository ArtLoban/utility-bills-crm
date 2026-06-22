import { parseAsInteger, SingleParserBuilder, useQueryStates } from "nuqs";
import { DATA_TABLE_PARAMS } from "@/components/data-table/types";
import { PAGE_DEFAULT } from "@/components/data-table/constants";
import { type DefaultValues, useForm, useWatch } from "react-hook-form";
import { getInitialValuesFromUrl } from "../utils/get-initial-values-from-url";
import { useEffect, useRef } from "react";

type TQueryFiltersOptions = {
  syncPage?: boolean;
};

export const useQueryFilters = <T extends Record<string, unknown>>(
  parsers: Record<string, SingleParserBuilder<string>>,
  initialValues: T,
  options?: TQueryFiltersOptions,
) => {
  const syncPage = options?.syncPage ?? true;

  const [query, setQuery] = useQueryStates(
    {
      ...parsers,
      ...(syncPage ? { [DATA_TABLE_PARAMS.PAGE]: parseAsInteger.withDefault(PAGE_DEFAULT) } : {}),
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
    void setQuery(syncPage ? { ...values, [DATA_TABLE_PARAMS.PAGE]: PAGE_DEFAULT } : values);
  }, [values, setQuery, syncPage]);

  const handleClear = () => form.reset(initialValues);
  const hasActiveFilters = (Object.keys(initialValues) as (keyof T)[]).some(
    (key) => values[key as keyof typeof values] !== initialValues[key],
  );

  return {
    form,
    values,
    handleClear,
    hasActiveFilters,
  };
};
