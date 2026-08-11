import noImage from "../../assets/no-image.png";

import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Heart, IndianRupee, Loader2, Trash2 } from "lucide-react";
import { useLocation } from "react-router-dom";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  addItemToWishlist,
  removeItemFromWishlist,
  isRemoving,
}) {
  const location = useLocation();
  const saleCondition =
    product?.salePrice > 0 && product?.salePrice !== product?.price;

  return (
    <Card className="relative w-full max-w-sm mx-auto rounded-none border-0">
      {isRemoving?.loader && isRemoving?.productId === product?._id && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image ? product?.image : noImage}
            alt={product?.title}
            className="w-full h-50 md:h-75 object-cover"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground hover:bg-secondary/60">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground hover:bg-destructive/60">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : saleCondition ? (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground hover:bg-accent/60">
              Sale
            </Badge>
          ) : null}
          {location?.pathname === "/shop/wishlist" ? (
            <Button
              variant="link"
              onClick={(e) => removeItemFromWishlist(e, product?._id)}
              className="absolute top-2 right-3 p-0 h-auto rounded-full hover:bg-transparent"
              aria-label="Remove item"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="link"
              onClick={(e) =>
                product.wishlist
                  ? removeItemFromWishlist(e, product?._id)
                  : addItemToWishlist(e, product?._id)
              }
              className="absolute top-2 right-3 p-0 h-auto rounded-full hover:bg-transparent"
              aria-label="Wishlist item"
            >
              <Heart
                className={`w-5 h-5 ${product.wishlist && "fill-primary"}`}
              />
            </Button>
          )}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2 truncate">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] font-semibold text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-left gap-2 items-center mb-2">
            {saleCondition ? (
              <span className="flex items-center text-lg font-bold text-primary">
                <IndianRupee size={16} />
                {product?.salePrice}
              </span>
            ) : null}
            <span
              className={`${
                saleCondition ? "line-through" : "font-bold"
              } flex items-center text-lg text-primary`}
            >
              <IndianRupee size={16} />
              {product?.price}
            </span>
            {saleCondition && product?.discount > 0 && (
              <span className="hidden md:block text-sm">{`(${product?.discount}% Off)`}</span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed rounded-none">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full rounded-none"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
