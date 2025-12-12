import { useEffect, useState } from "react";
import { useNavigation } from "react-router";
import { Progress } from "~/components/ui/progress";

export function GlobalLoading() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const state = navigation.state;
    let timer: NodeJS.Timeout;

    if (state === "submitting" || state === "loading") {
      setProgress((p) => (p === 0 ? 10 : p)); // Start at 10% if at 0

      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) return 100;

          // Trickle logic: fast at first, slows down
          const increment = Math.max(0.5, (90 - oldProgress) / 10);
          return Math.min(90, oldProgress + increment);
        });
      }, 100);
    } else if (state === "idle" && progress > 0) {
      setProgress(100);

      const timeout = setTimeout(() => {
        setProgress(0);
      }, 500); // Wait for transition to finish

      return () => clearTimeout(timeout);
    }

    return () => clearInterval(timer);
  }, [navigation.state, progress]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress
        value={progress}
        className="h-1 w-full rounded-none bg-transparent"
      />
    </div>
  );
}
