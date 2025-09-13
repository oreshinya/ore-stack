import * as React from "react";

const NonceContext = React.createContext<string>("");
export const NonceProvider = NonceContext.Provider;
export const useNonce = (): string => React.useContext(NonceContext);
