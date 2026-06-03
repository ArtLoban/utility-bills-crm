export const getInitialValuesFromUrl = <T>(
  query: Record<string, unknown>,
  fields: (keyof T)[],
  initialValues: T,
): T => {
  return fields.reduce((acc, key) => {
    const value = query[key as string];

    acc[key] = (value ?? initialValues[key]) as T[typeof key];

    return acc;
  }, {} as T);
};
