import { Loader } from "lucide-react";
import React from "react";

function LoadingContent({ loaderText, fullPage = false }) {
  return (
    <div
      className={`${fullPage && "min-h-[calc(100vh-68px)]"} w-full bg-background flex flex-col gap-4 justify-center items-center`}
    >
      <div className="bg-card flex flex-col gap-4 justify-center items-center p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-border transform transition-all">
        <Loader className="animate-spin animation-duration-[3s] h-16 w-16 text-primary" />
        <p className="text-muted-foreground text-xl">{loaderText}...</p>
      </div>
    </div>
  );
}

export default LoadingContent;
