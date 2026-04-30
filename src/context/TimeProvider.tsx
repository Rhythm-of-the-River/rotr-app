import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react';

const DEBUG_STORAGE_KEY = 'rotr.debug';

/**
 * The dev time simulator is shown when `?debug=true` is in the URL. The flag
 * is sticky for the rest of the session so navigating around the SPA doesn't
 * lose it. Use `?debug=false` to clear it.
 */
function isDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const flag = params.get('debug');
  if (flag === 'true') {
    sessionStorage.setItem(DEBUG_STORAGE_KEY, '1');
    return true;
  }
  if (flag === 'false') {
    sessionStorage.removeItem(DEBUG_STORAGE_KEY);
    return false;
  }
  return sessionStorage.getItem(DEBUG_STORAGE_KEY) === '1';
}

interface TimeContextValue {
  /** Current "now" in epoch seconds, possibly simulated in dev. */
  now: number;
  /** True if a simulated time override is active. Always false in production. */
  isSimulated: boolean;
  /** Override the clock with a fixed epoch second value (dev only). */
  setSimulatedNow: (epochSeconds: number | null) => void;
  /** True only when running the Vite dev server. */
  devMode: boolean;
}

const TimeContext = createContext<TimeContextValue | null>(null);

const TICK_MS = 5000;

export function TimeProvider({ children }: { children: ReactNode }) {
  const devMode = isDebugEnabled();
  const [simulatedNow, setSimulatedNowState] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Math.floor(Date.now() / 1000));
  const simulatedRef = useRef<number | null>(null);
  const baseRealRef = useRef<number>(Math.floor(Date.now() / 1000));

  useEffect(() => {
    simulatedRef.current = simulatedNow;
    baseRealRef.current = Math.floor(Date.now() / 1000);
    if (simulatedNow !== null) setNow(simulatedNow);
  }, [simulatedNow]);

  useEffect(() => {
    const tick = () => {
      const realNow = Math.floor(Date.now() / 1000);
      if (simulatedRef.current === null) {
        setNow(realNow);
      } else {
        // Advance simulated clock at real-time pace from the moment it was set.
        const delta = realNow - baseRealRef.current;
        setNow(simulatedRef.current + delta);
      }
    };
    const id = window.setInterval(tick, TICK_MS);
    tick();
    return () => window.clearInterval(id);
  }, []);

  const setSimulatedNow = useCallback(
    (epochSeconds: number | null) => {
      if (!devMode) return;
      setSimulatedNowState(epochSeconds);
    },
    [devMode]
  );

  const value = useMemo<TimeContextValue>(
    () => ({
      now,
      isSimulated: simulatedNow !== null,
      setSimulatedNow,
      devMode
    }),
    [now, simulatedNow, setSimulatedNow, devMode]
  );

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
}

export function useTime(): TimeContextValue {
  const ctx = useContext(TimeContext);
  if (!ctx) throw new Error('useTime must be used inside <TimeProvider>');
  return ctx;
}
