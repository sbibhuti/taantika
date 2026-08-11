import React, { useEffect, useState } from "react";
import { Heart, Trash2, ShoppingCart, ArrowLeft, Star } from "lucide-react";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import EmptyList from "@/components/shopping-view/empty-list";
import {
  clearWislist,
  fetchAllWishlist,
  setRemoveWishlist,
  wishlistRemove,
} from "@/store/shop/wishlist-slice";
import LoadingContent from "@/components/common/loading-content";
import { toast } from "@/components/ui/use-toast";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { wishlist, pagination, isLoading } = useSelector(
    (state) => state.shopWishlist,
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  // const [wishlist, setWishlist] = useState([]);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [loadonClear, setLoadonClear] = useState({
    loader: false,
    productId: null,
  });

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  const clearAll = () => {
    dispatch(clearWislist({ userId: user?.id }));
  };

  function removeItemFromWishlist(evt, productId) {
    evt.stopPropagation();
    setLoadonClear({ loader: true, productId: productId });
    dispatch(wishlistRemove({ userId: user?.id, productId }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(setRemoveWishlist({ productId }));

          // setAllProducts((prevProducts) =>
          //   prevProducts.map((product) =>
          //     product._id === productId
          //       ? { ...product, wishlist: !product.wishlist }
          //       : product,
          //   ),
          // );

          toast({
            title: data?.payload?.message,
          });
          setLoadonClear((prev) => ({ ...prev, loader: false }));
        } else {
          toast({
            title: data?.payload?.message,
            variant: "destructive",
          });
          setLoadonClear((prev) => ({ ...prev, loader: false }));
        }
      })
      .catch((err) => {
        console.error(err);
        setLoadonClear((prev) => ({ ...prev, loader: false }));
        toast({
          title: "Failed to wishlist",
          variant: "destructive",
        });
      });
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId,
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllWishlist({ userId: user?.id, page: 1, limit: 10 }));
  }, [user]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  if (isLoading)
    return <LoadingContent fullPage loaderText="Loading your loved products" />;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between border-b border-border pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              My Wishlist
              <span className="text-lg font-semibold text-muted-foreground h-8 w-8 flex justify-center items-center bg-muted rounded-full">
                {wishlist.length}
              </span>
            </h1>
          </div>

          {wishlist.length > 0 && (
            <Button
              variant="link"
              onClick={clearAll}
              className="mt-4 md:mt-0 p-0 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear Wishlist
            </Button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <EmptyList
            icon={Heart}
            title="Your wishlist is empty"
            description="Explore our collections and tap the heart icon to save items you love for later."
            buttonText="Start Exploring"
            onClick={() => navigate("/shop/listing")}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
            {wishlist.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
                removeItemFromWishlist={removeItemFromWishlist}
                isRemoving={loadonClear}
              />
            ))}
          </div>
        )}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}
