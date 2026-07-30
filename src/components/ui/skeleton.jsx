import { cn } from "@/lib/utils";

const Skeleton = ({ text = "Loading...", className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-9999 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-4">
        {/** Spinner */}
        <div className="relative h-14 w-14 sm:h-16 sm:w-16">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary" />
        </div>
        {/** Text */}
        <p className="text-sm sm:text-base font-medium text-muted-foreground">
          {text}
        </p>
      </div>
    </div>
  );
};

export { Skeleton };
