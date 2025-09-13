import { useMemo } from "react";
import { useGlobalPendingState } from "remix-utils/use-global-navigation-state";
import { useNonce } from "~/contexts/nonce";

export function useHook() {
  const nonce = useNonce();
  const state = useGlobalPendingState();
  const isPending = useMemo(() => {
    return state === "pending";
  }, [state]);

  return { nonce, isPending };
}
