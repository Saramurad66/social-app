
import { createContext, type ReactNode } from "react";

type CounterContextType = Record<string, never>;

export const CounterCountext = createContext<CounterContextType>({});

export default function CounterContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CounterCountext.Provider value={{}}>
      {children}
    </CounterCountext.Provider>
  );
}
