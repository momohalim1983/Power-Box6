import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Save, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalmartFeature {
  title: string;
  description: string;
  rating?: number;
}

interface WalmartData {
  title: string;
  features: WalmartFeature[];
  button: {
    label: string;
    popup_link: string;
  };
}

const defaultWalmartData: WalmartData = {
  title: "Walmart",
  features: [
    {
      title: "Official Walmart Seller",
      description: "Secure checkout and fast delivery",
    },
    {
      title: "Pro Seller",
      description: "from 570 reviews",
      rating: 4.8,
    },
    {
      title: "Free 90-Day Returns",
      description: "Shop with confidence - easy returns",
    },
  ],
  button: {
    label: "View Product Details",
    popup_link: "",
  },
};

export default function Walmart() {
  const [walmartData, setWalmartData] =
    useState<WalmartData>(defaultWalmartData);
  const [isSaving, setIsSaving] = useState(false);

  const handleTitleChange = (value: string) => {
    setWalmartData((prev) => ({ ...prev, title: value }));
  };

  const handleFeatureChange = (
    index: number,
    field: keyof WalmartFeature,
    value: string | number,
  ) => {
    setWalmartData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature,
      ),
    }));
  };

  const handleRatingChange = (index: number, value: string) => {
    const rating = parseFloat(value);
    if (!isNaN(rating) && rating >= 0 && rating <= 5) {
      handleFeatureChange(index, "rating", rating);
    }
  };

  const adjustRating = (index: number, increment: number) => {
    const currentRating = walmartData.features[index].rating || 0;
    const newRating = Math.max(0, Math.min(5, currentRating + increment));
    handleFeatureChange(index, "rating", newRating);
  };

  const toggleRating = (index: number) => {
    const hasRating = walmartData.features[index].rating !== undefined;
    if (hasRating) {
      // Remove rating
      const updatedFeatures = walmartData.features.map((feature, i) => {
        if (i === index) {
          const { rating, ...featureWithoutRating } = feature;
          return featureWithoutRating;
        }
        return feature;
      });
      setWalmartData((prev) => ({ ...prev, features: updatedFeatures }));
    } else {
      // Add rating
      handleFeatureChange(index, "rating", 4.0);
    }
  };

  const handleButtonChange = (field: string, value: string) => {
    setWalmartData((prev) => ({
      ...prev,
      button: {
        ...prev.button,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log("Saving walmart data:", walmartData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem("walmart_section", JSON.stringify(walmartData));

      alert("Walmart section saved successfully!");
    } catch (error) {
      console.error("Error saving walmart data:", error);
      alert("Error saving Walmart section. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("walmart_section");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setWalmartData(parsed);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Walmart Section Management
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

      {/* Main Title */}
      <Card>
        <CardHeader>
          <CardTitle>Section Title</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={walmartData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter section title..."
            className="text-lg font-semibold"
          />
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid lg:grid-cols-1 gap-6">
        {walmartData.features.map((feature, index) => (
          <Card key={index} className="border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Feature {index + 1}</Badge>
                  {feature.title || "Untitled Feature"}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleRating(index)}
                  className="flex items-center gap-1"
                >
                  <Star className="w-4 h-4" />
                  {feature.rating !== undefined
                    ? "Remove Rating"
                    : "Add Rating"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Feature Title */}
                <div>
                  <Label htmlFor={`feature-title-${index}`}>Title</Label>
                  <Input
                    id={`feature-title-${index}`}
                    value={feature.title}
                    onChange={(e) =>
                      handleFeatureChange(index, "title", e.target.value)
                    }
                    placeholder="Enter feature title..."
                    className="mt-1"
                  />
                </div>

                {/* Feature Description */}
                <div>
                  <Label htmlFor={`feature-desc-${index}`}>Description</Label>
                  <Input
                    id={`feature-desc-${index}`}
                    value={feature.description}
                    onChange={(e) =>
                      handleFeatureChange(index, "description", e.target.value)
                    }
                    placeholder="Enter feature description..."
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Star Rating (if enabled) */}
              {feature.rating !== undefined && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Label className="text-sm font-medium text-yellow-800">
                    Star Rating
                  </Label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={feature.rating}
                        onChange={(e) =>
                          handleRatingChange(index, e.target.value)
                        }
                        className="w-20"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustRating(index, -0.1)}
                        disabled={feature.rating <= 0}
                      >
                        -
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustRating(index, 0.1)}
                        disabled={feature.rating >= 5}
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
                            i < Math.floor(feature.rating!)
                              ? "text-yellow-400 fill-current"
                              : i < feature.rating!
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                    <Badge variant="secondary">
                      {feature.rating.toFixed(1)}
                    </Badge>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Preview:</strong> {feature.rating.toFixed(1)} ⭐ (
                      {feature.description})
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Button Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Section Button</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="button-label">Button Label</Label>
            <Input
              id="button-label"
              value={walmartData.button.label}
              onChange={(e) => handleButtonChange("label", e.target.value)}
              placeholder="Enter button label..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="button-popup">Popup Modal Link</Label>
            <div className="flex items-center gap-2 mt-1">
              <LinkIcon className="w-4 h-4 text-gray-400" />
              <Input
                id="button-popup"
                value={walmartData.button.popup_link}
                onChange={(e) =>
                  handleButtonChange("popup_link", e.target.value)
                }
                placeholder="Enter popup modal link..."
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">{walmartData.title}</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {walmartData.features.map((feature, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {feature.description}
                  </p>
                  {feature.rating !== undefined && (
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(feature.rating!)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300",
                          )}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">
                        {feature.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button className="w-full" disabled>
              {walmartData.button.label}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
