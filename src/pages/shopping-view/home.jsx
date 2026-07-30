import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, MoveRight } from "lucide-react";

import bannerOne from "../../assets/banner-1.png";
import bannerTwo from "../../assets/banner-2.png";
import bannerThree from "../../assets/banner-3.png";
import bannerFour from "../../assets/banner-4.png";
import cardAccessories from "../../assets/card-accessories.png";
import cardKids from "../../assets/card-kids.png";
import cardMan from "../../assets/card-man.png";
import cardShoes from "../../assets/card-shoes.png";
import cardWoman from "../../assets/card-woman.png";
import cardAdidas from "../../assets/card-adidas.jpg";
import cardNike from "../../assets/card-nike.jpg";
import cardPuma from "../../assets/card-puma.jpg";
import cardLevis from "../../assets/card-levis.jpg";
import cardHilfiger from "../../assets/card-hilfiger.jpg";
import cardHAM from "../../assets/card-HAM.jpg";
import cardLacoste from "../../assets/card-lacoste.jpg";
import cardSolly from "../../assets/card-allensolly.jpg";
import cardHRX from "../../assets/card-hrx.png";
import cardRedtape from "../../assets/card-redtape.jpg";
import cardArmour from "../../assets/card-underarmour.jpg";
import cardSuperdry from "../../assets/card-superdry.jpg";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  resetProductList,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { getFeatureImages } from "@/store/common-slice";
import { getTenRandomItems } from "@/lib/utils";

import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

const featureImageList = [bannerOne, bannerTwo, bannerThree, bannerFour];

const categoriesWithIcon = [
  { id: "men", label: "Men", image: cardMan },
  { id: "women", label: "Women", image: cardWoman },
  { id: "kids", label: "Kids", image: cardKids },
  { id: "accessories", label: "Accessories", image: cardAccessories },
  { id: "footwear", label: "Footwear", image: cardShoes },
];

const brandsWithIcon = [
  { id: "hrx", label: "HRX", image: cardHRX },
  { id: "nike", label: "Nike", image: cardNike },
  { id: "adidas", label: "Adidas", image: cardAdidas },
  { id: "puma", label: "Puma", image: cardPuma },
  { id: "levis", label: "Levi's", image: cardLevis },
  { id: "h&m", label: "H&M", image: cardHAM },
  { id: "redtape", label: "Redtape", image: cardRedtape },
  { id: "tommyhilfiger", label: "Tommy Hilfiger", image: cardHilfiger },
  { id: "lacoste", label: "Lacoste", image: cardLacoste },
  { id: "allensolly", label: "Allen Solly", image: cardSolly },
  { id: "superdry", label: "Superdry", image: cardSuperdry },
  { id: "underarmour", label: "Under Armour", image: cardArmour },
];

const ShopTileSection = ({ title, cardType, list, cardAction }) => (
  <section className="py-12 bg-muted">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl text-muted-foreground font-bold text-center mb-8">
        {title}
      </h2>
      <div
        className={`grid grid-cols-2 md:grid-cols-3 ${cardType === "category" ? "lg:grid-cols-5" : "lg:grid-cols-6"} gap-4`}
      >
        {list.map((item) => (
          <Card
            key={item?.id}
            onClick={() => cardAction(item, cardType)}
            className="relative h-80 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-card text-card-foreground group"
          >
            <img
              src={item.image}
              alt={item.label}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-background/20 group-hover:bg-background/30 transition-colors duration-300" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background/90 via-background/40 to-transparent" />
            <CardContent className="absolute bottom-0 left-0 right-0 z-10 p-5">
              <h3 className="text-center text-2xl font-bold text-foreground">
                {item.label}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts,
  );
  // const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    dispatch(resetProductList());
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row">
          <div className="relative lg:w-3/5 h-150 overflow-hidden">
            {featureImageList && featureImageList.length > 0
              ? featureImageList.map((slide, index) => (
                  <img
                    src={slide}
                    key={index}
                    className={`${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    } absolute w-full h-full object-cover transition-opacity duration-1000`}
                  />
                ))
              : null}
          </div>
          <div className="p-4 lg:w-2/5 my-auto">
            <p className="text-3xl mb-8">
              We poured our hearts into selecting every single piece.
            </p>
            <Button onClick={() => navigate(`/shop/listing`)}>
              <p className="mr-2">Discover the range</p>
              <MoveRight />
            </Button>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length,
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length,
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <ShopTileSection
        title="Shop by Category"
        cardType="category"
        list={categoriesWithIcon}
        cardAction={handleNavigateToListingPage}
      />
      <ShopTileSection
        title="Shop by Brand"
        cardType="brand"
        list={brandsWithIcon}
        cardAction={handleNavigateToListingPage}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {productList && productList.length > 0
              ? getTenRandomItems(productList).map((productItem) => (
                  <ShoppingProductTile
                    key={productItem?.name}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
