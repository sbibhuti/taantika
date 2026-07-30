import noImage from "../../assets/no-image.png";

import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { IndianRupee } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  key = null,
}) {
  const saleCondition =
    product?.salePrice > 0 && product?.salePrice !== product?.price;

  return (
    <Card key={key} className="w-full max-w-sm mx-auto rounded-none border-0">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image ? product?.image : noImage}
            alt={product?.title}
            className="w-full h-75 object-cover"
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
              <span className="text-sm">{`(${product?.discount}% Off)`}</span>
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
            className="w-full rounded-none bg-accent"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
