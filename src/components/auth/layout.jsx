import { Outlet } from "react-router-dom";
import leftBanner from "../../assets/login-left-banner.png";

function AuthLayout() {
  return (
    <div className="flex min-h-screen md:py-24 md:px-44 bg-background">
      <div className="flex flex-row-reverse w-full flex-1 bg-muted shadow-md transition-all duration-300 rounded-xl  hover:shadow-xl">
        <div className="hidden lg:flex lg:flex-col items-center justify-center bg-primary w-1/2 rounded-r-xl [clip-path:polygon(0_0,_100%_0,_100%_100%,_10%_100%)]">
          <div className="space-y-6 text-left text-primary-foreground">
            <h1 className="text-4xl font-extrabold tracking-tight">Taantika</h1>
          </div>
          <img src={leftBanner} className="h-3/4" />
        </div>
        <div className="flex flex-1 items-center justify-center bg-muted px-4 py-12 sm:px-6 lg:px-8 rounded-l-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
