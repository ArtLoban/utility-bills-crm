export const getInitialValuesFromUrl = <T>(
  query: Partial<Record<keyof T, unknown>>,
  fields: (keyof T)[],
  initialValues: T,
): T => {
  return fields.reduce((acc, key) => {
    const value = query[key];

    acc[key] = (value ?? initialValues[key]) as T[typeof key];

    return acc;
  }, {} as T);
};
