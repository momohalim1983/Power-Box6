import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { logDatabaseError } from "@/lib/error-handler";

interface SellerInfo {
  name: string;
  rating: number;
  reviews_count: number;
}

interface WalmartInfo {
  text: string;
  subtext: string;
}

interface GuaranteeInfo {
  text: string;
  subtext: string;
}

interface TrustData {
  title: string;
  seller_info: SellerInfo;
  walmart_info: WalmartInfo;
  guarantee: GuaranteeInfo;
}

interface TrustContextType {
  trustData: TrustData;
  updateTrustData: (data: Partial<TrustData>) => void;
  isLoading: boolean;
}

const defaultTrustData: TrustData = {
  title: "Why Trust Us",
  seller_info: {
    name: "Pro Seller",
    rating: 4.75,
    reviews_count: 570,
  },
  walmart_info: {
    text: "Official Walmart Seller",
    subtext: "Secure checkout and fast delivery",
  },
  guarantee: {
    text: "Free 90-Day Returns",
    subtext: "Shop with confidence - easy returns",
  },
};

const TrustContext = createContext<TrustContextType | undefined>(undefined);

export function TrustProvider({ children }: { children: ReactNode }) {
  const [trustData, setTrustData] = useState<TrustData>(defaultTrustData);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrustData = async () => {
    try {
      const { data, error } = await supabase
        .from("trust_section")
        .select("*")
        .single();

      if (error) {
        if (error.code === "PGRST116" || error.code === "42P01") {
          console.info("Trust section table not found, using default data");
        } else {
          logDatabaseError("Error loading trust data", error);
        }
        return;
      }

      if (data && data.content) {
        setTrustData({ ...defaultTrustData, ...data.content });
      }
    } catch (error) {
      console.info("Using default trust data due to database connection issue");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrustData = (newData: Partial<TrustData>) => {
    setTrustData((prev) => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    loadTrustData();

    // Set up real-time subscription
    const channel = supabase
      .channel("trust_section_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trust_section",
        },
        (payload) => {
          console.log("Trust section updated:", payload);
          if (payload.new && payload.new.content) {
            setTrustData({ ...defaultTrustData, ...payload.new.content });
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
    <TrustContext.Provider value={{ trustData, updateTrustData, isLoading }}>
      {children}
    </TrustContext.Provider>
  );
}

export function useTrust() {
  const context = useContext(TrustContext);
  if (context === undefined) {
    throw new Error("useTrust must be used within a TrustProvider");
  }
  return context;
}
