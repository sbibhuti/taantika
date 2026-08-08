import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Sprout,
  UserCog,
} from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

import { logoutUser } from "@/store/auth-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { shoppingViewHeaderMenuItems } from "@/config";

import UserCartWrapper from "./cart-wrapper";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`),
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 items-start lg:items-center lg:gap-4 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 rounded-md"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function Cart({ variant = "outline", buttonClass }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user?.id]);

  return (
    <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
      <Button
        onClick={() => setOpenCartSheet(true)}
        variant={variant}
        size="icon"
        className={`relative ${buttonClass}`}
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-1.25 -right-1.25">
          <p className=" bg-foreground text-background flex h-5 w-5 items-center justify-center rounded-full font-medium text-[10px]">
            {cartItems?.items?.length || 0}
          </p>
        </span>
        <span className="sr-only">User cart</span>
      </Button>
      <UserCartWrapper
        setOpenCartSheet={setOpenCartSheet}
        cartItems={
          cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items
            : []
        }
      />
    </Sheet>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Cart />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          sideOffset={6}
          className="w-56 bg-background"
        >
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/shop/order-history")}>
            <Package className="mr-2 h-4 w-4" />
            Orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/shop/wishlist")}>
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-accent" />
          <span className="font-bold text-primary">Taantika</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <p className="p-2 border-b font-bold text-foreground">
              Logged in as {user?.userName}
            </p>
            <div className="border-b pl-2">
              <SheetClose>
                <MenuItems />
              </SheetClose>
            </div>
            <div className="flex items-start flex-col border-b">
              <SheetClose asChild>
                <Button
                  variant="link"
                  onClick={() => navigate("/shop/account")}
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Account
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="link"
                  onClick={() => navigate("/shop/order-history")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="link"
                  onClick={() => navigate("/shop/wishlist")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
              </SheetClose>
            </div>
            <div className="flex justify-between py-4 pr-2">
              <Button
                className="text-foreground"
                variant="link"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 w-6 h-6" />
                Logout
              </Button>
              <Cart variant="link" buttonClass="text-foreground" />
            </div>
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
