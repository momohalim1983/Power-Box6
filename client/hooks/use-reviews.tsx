import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { logDatabaseError } from "@/lib/error-handler";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

interface ReviewsData {
  title: string;
  overall_rating: number;
  total_reviews: number;
  reviews: Review[];
}

interface ReviewsContextType {
  reviewsData: ReviewsData;
  updateReviewsData: (data: Partial<ReviewsData>) => void;
  isLoading: boolean;
}

const defaultReviewsData: ReviewsData = {
  title: "What Our Customers Say",
  overall_rating: 4.6,
  total_reviews: 23,
  reviews: [
    {
      name: "Sarah M.",
      rating: 5,
      text: "Amazing variety! Perfect for our office team. Everyone loved the selection of snacks.",
      date: "2 weeks ago",
      verified: true,
    },
    {
      name: "Mike D.",
      rating: 5,
      text: "Great gift idea! Sent this to my college son and he was thrilled with all the different snacks.",
      date: "1 month ago",
      verified: true,
    },
    {
      name: "Lisa K.",
      rating: 4,
      text: "Good quality snacks and fast delivery. Would definitely order again.",
      date: "3 weeks ago",
      verified: true,
    },
  ],
};

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviewsData, setReviewsData] =
    useState<ReviewsData>(defaultReviewsData);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviewsData = async () => {
    try {
      const { data, error } = await supabase
        .from("customer_reviews")
        .select("*")
        .single();

      if (error) {
        if (error.code === "PGRST116" || error.code === "42P01") {
          console.info("Customer reviews table not found, using default data");
        } else {
          logDatabaseError("Error loading reviews data", error);
        }
        return;
      }

      if (data && data.content) {
        setReviewsData({ ...defaultReviewsData, ...data.content });
      }
    } catch (error) {
      logDatabaseError("Catch block - reviews error", error);
      console.info(
        "Using default reviews data due to database connection issue",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateReviewsData = (newData: Partial<ReviewsData>) => {
    setReviewsData((prev) => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    loadReviewsData();

    // Set up real-time subscription
    const channel = supabase
      .channel("customer_reviews_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "customer_reviews",
        },
        (payload) => {
          console.log("Customer reviews updated:", payload);
          if (payload.new && payload.new.content) {
            setReviewsData({ ...defaultReviewsData, ...payload.new.content });
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
    <ReviewsContext.Provider
      value={{ reviewsData, updateReviewsData, isLoading }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
