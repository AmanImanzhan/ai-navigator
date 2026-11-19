import { useCallback, useEffect, useState } from "react";

import { loadPaywallOffer, type PaywallOffer } from "@/lib/purchases";

type OfferState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; offer: PaywallOffer };

// Тарифы для экрана подписки: цены из App Store и право на пробный период.
// Не загрузились — status "error" и reload(), чтобы попробовать ещё раз.
export function usePaywallOffer(): OfferState & { reload: () => void } {
  const [state, setState] = useState<OfferState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    loadPaywallOffer()
      .then((offer) => {
        if (active) setState(offer ? { status: "ready", offer } : { status: "error" });
      })
      .catch((error: unknown) => {
        if (__DEV__) console.log("RevenueCat: тарифы не загрузились", error);
        if (active) setState({ status: "error" });
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }, []);

  return { ...state, reload };
}
