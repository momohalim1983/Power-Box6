import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Save, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

interface CustomerReview {
  name: string;
  image: string;
  rating: number;
  comment: string;
}

interface CustomerReviewsData {
  title: string;
  subtitle: string;
  reviews: CustomerReview[];
  footer: {
    text: string;
    rating: number;
  };
}

const defaultCustomerReviewsData: CustomerReviewsData = {
  title: "What Our Customers Say",
  subtitle:
    "Join thousands of satisfied customers who love our nutritious snack boxes",
  reviews: [
    {
      name: "Sarah Johnson",
      image:
        "https://images.pexels.com/photos/8872492/pexels-photo-8872492.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      comment:
        "Amazing variety of snacks! Perfect for my office team. The breakfast bars are especially delicious and the packaging is so professional.",
    },
    {
      name: "Michael Chen",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      comment:
        "Great value for 42 snacks! My college daughter loves these. Fast delivery and everything arrived in perfect condition.",
    },
    {
      name: "Emily Rodriguez",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      comment:
        "The perfect gift! Sent this to my brother in college and he was thrilled. Quality snacks and beautiful presentation with the greeting card.",
    },
    {
      name: "David Thompson",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      comment:
        "Ordered for my team at work. Everyone loved the variety - from healthy options to tasty treats. Will definitely order again!",
    },
    {
      name: "Jessica Martinez",
      image:
        "https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      comment:
        "Exceeded my expectations! The box is beautifully packaged and the snacks are high quality. Perfect for busy days when I need quick energy.",
    },
    {
      name: "Robert Wilson",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      comment:
        "Fantastic service from start to finish. The snacks arrived quickly and were exactly as described. Great for keeping in the car for long trips!",
    },
  ],
  footer: {
    text: "Based on verified customer reviews",
    rating: 4.8,
  },
};

export default function Testimonials() {
  const [reviewsData, setReviewsData] = useState<CustomerReviewsData>(
    defaultCustomerReviewsData,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleTitleChange = (value: string) => {
    setReviewsData((prev) => ({ ...prev, title: value }));
  };

  const handleSubtitleChange = (value: string) => {
    setReviewsData((prev) => ({ ...prev, subtitle: value }));
  };

  const handleReviewChange = (
    index: number,
    field: keyof CustomerReview,
    value: string | number,
  ) => {
    setReviewsData((prev) => ({
      ...prev,
      reviews: prev.reviews.map((review, i) =>
        i === index ? { ...review, [field]: value } : review,
      ),
    }));
  };

  const handleRatingChange = (index: number, value: string) => {
    const rating = parseInt(value);
    if (!isNaN(rating) && rating >= 1 && rating <= 5) {
      handleReviewChange(index, "rating", rating);
    }
  };

  const adjustRating = (index: number, increment: number) => {
    const currentRating = reviewsData.reviews[index].rating;
    const newRating = Math.max(1, Math.min(5, currentRating + increment));
    handleReviewChange(index, "rating", newRating);
  };

  const handleImageUpload = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Upload to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `customer-${index}-${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file);

        if (error) {
          console.error("Upload error:", error);
          alert("Error uploading image. Please try again.");
          return;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(fileName);

        handleReviewChange(index, "image", publicUrl);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Error uploading image. Please try again.");
      }
    }
  };

  const handleFooterChange = (field: string, value: string | number) => {
    setReviewsData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [field]: value,
      },
    }));
  };

  const handleFooterRatingChange = (value: string) => {
    const rating = parseFloat(value);
    if (!isNaN(rating) && rating >= 0 && rating <= 5) {
      handleFooterChange("rating", rating);
    }
  };

  const adjustFooterRating = (increment: number) => {
    const newRating = Math.max(
      0,
      Math.min(5, reviewsData.footer.rating + increment),
    );
    handleFooterChange("rating", newRating);
  };

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from("customer_reviews")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading data:", error);
        return;
      }

      if (data) {
        setReviewsData(data.content);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from("customer_reviews").upsert({
        id: 1,
        content: reviewsData,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving data:", error);
        alert("Error saving Customer Reviews section. Please try again.");
      } else {
        alert("Customer Reviews section saved successfully!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving Customer Reviews section. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Customer Reviews Section
        </h2>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Section Headers */}
      <Card>
        <CardHeader>
          <CardTitle>Section Headers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="section-title">Main Title</Label>
            <Input
              id="section-title"
              value={reviewsData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter main title..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="section-subtitle">Subtitle</Label>
            <Textarea
              id="section-subtitle"
              value={reviewsData.subtitle}
              onChange={(e) => handleSubtitleChange(e.target.value)}
              placeholder="Enter subtitle..."
              className="mt-1 min-h-[60px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Reviews */}
      <div className="grid lg:grid-cols-2 gap-6">
        {reviewsData.reviews.map((review, index) => (
          <Card key={index} className="border-2 border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Review {index + 1}</Badge>
                {review.name || "Unnamed Customer"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Name */}
              <div>
                <Label htmlFor={`review-name-${index}`}>Customer Name</Label>
                <Input
                  id={`review-name-${index}`}
                  value={review.name}
                  onChange={(e) =>
                    handleReviewChange(index, "name", e.target.value)
                  }
                  placeholder="Enter customer name..."
                  className="mt-1"
                />
              </div>

              {/* Customer Image */}
              <div>
                <Label>Customer Photo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center mt-1">
                  {review.image ? (
                    <div className="space-y-2">
                      <img
                        src={review.image}
                        alt="Customer photo"
                        className="w-16 h-16 object-cover rounded-full mx-auto"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document
                              .getElementById(`customer-image-${index}`)
                              ?.click()
                          }
                          className="flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          Replace
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewChange(index, "image", "")}
                          className="text-red-600"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document
                            .getElementById(`customer-image-${index}`)
                            ?.click()
                        }
                        className="flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        Upload Photo
                      </Button>
                    </div>
                  )}
                </div>

                <input
                  id={`customer-image-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e)}
                  className="hidden"
                />

                <div className="mt-2">
                  <Input
                    value={review.image}
                    onChange={(e) =>
                      handleReviewChange(index, "image", e.target.value)
                    }
                    placeholder="Or enter image URL..."
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Label className="text-sm font-medium text-yellow-800">
                  Star Rating
                </Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      step="1"
                      value={review.rating}
                      onChange={(e) =>
                        handleRatingChange(index, e.target.value)
                      }
                      className="w-16"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustRating(index, -1)}
                      disabled={review.rating <= 1}
                    >
                      -
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustRating(index, 1)}
                      disabled={review.rating >= 5}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Star Display */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300",
                        )}
                      />
                    ))}
                  </div>
                  <Badge variant="secondary">{review.rating} stars</Badge>
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <Label htmlFor={`review-comment-${index}`}>Review Text</Label>
                <Textarea
                  id={`review-comment-${index}`}
                  value={review.comment}
                  onChange={(e) =>
                    handleReviewChange(index, "comment", e.target.value)
                  }
                  placeholder="Enter customer review..."
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Section */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="footer-text">Footer Text</Label>
            <Input
              id="footer-text"
              value={reviewsData.footer.text}
              onChange={(e) => handleFooterChange("text", e.target.value)}
              placeholder="Enter footer text..."
              className="mt-1"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Label className="text-sm font-medium text-blue-800">
              Overall Rating
            </Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={reviewsData.footer.rating}
                  onChange={(e) => handleFooterRatingChange(e.target.value)}
                  className="w-20"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustFooterRating(-0.1)}
                  disabled={reviewsData.footer.rating <= 0}
                >
                  -
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustFooterRating(0.1)}
                  disabled={reviewsData.footer.rating >= 5}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Star Display */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(reviewsData.footer.rating)
                        ? "text-yellow-400 fill-current"
                        : i < reviewsData.footer.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300",
                    )}
                  />
                ))}
              </div>
              <Badge variant="secondary">
                {reviewsData.footer.rating.toFixed(1)} average
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
