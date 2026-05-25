import { createContext, useContext } from "react";

export const createSafeContext = <T>(name: string) => {
  const Ctx = createContext<T | null>(null);
  Ctx.displayName = name;

  const useSafeContext = (): T => {
    const value = useContext(Ctx);
    if (value === null) {
      throw new Error(`use${name} must be used within <${name}Context>`);
    }
    return value;
  };

  return [Ctx.Provider, useSafeContext] as const;
};
