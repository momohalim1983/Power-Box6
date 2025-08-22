import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { logDatabaseError } from "@/lib/error-handler";

interface GalleryImage {
  url: string;
  title: string;
  alt: string;
}

interface ProductGalleryData {
  title: string;
  images: GalleryImage[];
}

interface ProductGalleryContextType {
  productGalleryData: ProductGalleryData;
  updateProductGalleryData: (data: Partial<ProductGalleryData>) => void;
  isLoading: boolean;
}

const defaultProductGalleryData: ProductGalleryData = {
  title: "See What's Inside Your Box",
  images: [
    {
      url: "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F79d471e5bc56457eb2c3b1c3eb6586ae?format=webp&width=800",
      title: "Complete Collection",
      alt: "Nutritious Snack Box with Breakfast Bars and Delicious Chips - 42 Count",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F05b5599b733643de9ed02db80950feb9?format=webp&width=800",
      title: "Inside View",
      alt: "Inside view of snack box",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2Fec2c685b6b9d438f97083ea2cdb4458b?format=webp&width=800",
      title: "Beautiful Packaging",
      alt: "Outside box view",
    },
  ],
};

const ProductGalleryContext = createContext<
  ProductGalleryContextType | undefined
>(undefined);

export function ProductGalleryProvider({ children }: { children: ReactNode }) {
  const [productGalleryData, setProductGalleryData] =
    useState<ProductGalleryData>(defaultProductGalleryData);
  const [isLoading, setIsLoading] = useState(true);

  const loadProductGalleryData = async () => {
    try {
      const { data, error } = await supabase
        .from("product_gallery")
        .select("*")
        .single();

      if (error) {
        if (error.code === "PGRST116" || error.code === "42P01") {
          console.info("Product gallery table not found, using default data");
        } else {
          logDatabaseError("Error loading product gallery data", error);
        }
        return;
      }

      if (data && data.content) {
        setProductGalleryData({
          ...defaultProductGalleryData,
          ...data.content,
        });
      }
    } catch (error) {
      console.info(
        "Using default product gallery data due to database connection issue",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductGalleryData = (newData: Partial<ProductGalleryData>) => {
    setProductGalleryData((prev) => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    loadProductGalleryData();

    // Set up real-time subscription
    const channel = supabase
      .channel("product_gallery_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "product_gallery",
        },
        (payload) => {
          console.log("Product gallery updated:", payload);
          if (payload.new && payload.new.content) {
            setProductGalleryData({
              ...defaultProductGalleryData,
              ...payload.new.content,
            });
          }
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ProductGalleryContext.Provider
      value={{ productGalleryData, updateProductGalleryData, isLoading }}
    >
      {children}
    </ProductGalleryContext.Provider>
  );
}

export function useProductGallery() {
  const context = useContext(ProductGalleryContext);
  if (context === undefined) {
    throw new Error(
      "useProductGallery must be used within a ProductGalleryProvider",
    );
  }
  return context;
}
