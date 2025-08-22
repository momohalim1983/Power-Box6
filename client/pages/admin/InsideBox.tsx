import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface ProductImage {
  title: string;
  image: string;
  popup_link: string;
  popup_title: string;
}

interface ProductPreviewData {
  title: string;
  images: ProductImage[];
  button: {
    label: string;
    popup_link: string;
    popup_title: string;
  };
}

const defaultProductPreviewData: ProductPreviewData = {
  title: "See What's Inside Your Box",
  images: [
    {
      title: "Complete Collection",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F79d471e5bc56457eb2c3b1c3eb6586ae?format=webp&width=800",
      popup_link: "",
      popup_title: "Product view 1",
    },
    {
      title: "Inside View",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F05b5599b733643de9ed02db80950feb9?format=webp&width=800",
      popup_link: "",
      popup_title: "Product view 2",
    },
    {
      title: "Beautiful Packaging",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2Fec2c685b6b9d438f97083ea2cdb4458b?format=webp&width=800",
      popup_link: "",
      popup_title: "Product view 3",
    },
  ],
  button: {
    label: "View Product Details",
    popup_link: "",
    popup_title: "Product Details",
  },
};

export default function InsideBox() {
  const [productData, setProductData] = useState<ProductPreviewData>(
    defaultProductPreviewData,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleTitleChange = (value: string) => {
    setProductData((prev) => ({ ...prev, title: value }));
  };

  const handleImageChange = (
    index: number,
    field: keyof ProductImage,
    value: string,
  ) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img,
      ),
    }));
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
        const fileName = `product-${index}-${Date.now()}.${fileExt}`;

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

        handleImageChange(index, "image", publicUrl);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Error uploading image. Please try again.");
      }
    }
  };

  const handleButtonChange = (field: string, value: string) => {
    setProductData((prev) => ({
      ...prev,
      button: {
        ...prev.button,
        [field]: value,
      },
    }));
  };

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from("product_preview")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading data:", error);
        return;
      }

      if (data) {
        setProductData(data.content);
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
      const { data, error } = await supabase.from("product_preview").upsert({
        id: 1,
        content: productData,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving data:", error);
        alert("Error saving Product Preview section. Please try again.");
      } else {
        alert("Product Preview section saved successfully!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving Product Preview section. Please try again.");
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
          Product Preview Section
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
            value={productData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter section title..."
            className="text-lg"
          />
        </CardContent>
      </Card>

      {/* Product Images */}
      <div className="grid lg:grid-cols-1 gap-6">
        {productData.images.map((image, index) => (
          <Card key={index} className="border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">Image {index + 1}</Badge>
                {image.title || "Untitled Image"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Image Title */}
                <div>
                  <Label htmlFor={`image-title-${index}`}>Display Title</Label>
                  <Input
                    id={`image-title-${index}`}
                    value={image.title}
                    onChange={(e) =>
                      handleImageChange(index, "title", e.target.value)
                    }
                    placeholder="Enter image display title..."
                    className="mt-1"
                  />
                </div>

                {/* Popup Title */}
                <div>
                  <Label htmlFor={`popup-title-${index}`}>Popup Title</Label>
                  <Input
                    id={`popup-title-${index}`}
                    value={image.popup_title}
                    onChange={(e) =>
                      handleImageChange(index, "popup_title", e.target.value)
                    }
                    placeholder="Enter popup modal title..."
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Image Upload/URL */}
              <div>
                <Label>Product Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-1">
                  {image.image ? (
                    <div className="space-y-3">
                      <img
                        src={image.image}
                        alt="Product preview"
                        className="max-w-full h-32 object-contain mx-auto rounded"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document
                              .getElementById(`image-upload-${index}`)
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
                          onClick={() => handleImageChange(index, "image", "")}
                          className="text-red-600"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document
                            .getElementById(`image-upload-${index}`)
                            ?.click()
                        }
                        className="flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        Upload Image
                      </Button>
                    </div>
                  )}
                </div>

                <input
                  id={`image-upload-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e)}
                  className="hidden"
                />

                <div className="mt-2">
                  <Label htmlFor={`image-url-${index}`} className="text-sm">
                    Or enter image URL:
                  </Label>
                  <Input
                    id={`image-url-${index}`}
                    value={image.image}
                    onChange={(e) =>
                      handleImageChange(index, "image", e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                    className="text-sm mt-1"
                  />
                </div>
              </div>

              {/* Popup Modal Link */}
              <div>
                <Label htmlFor={`popup-link-${index}`}>Popup Modal Link</Label>
                <div className="flex items-center gap-2 mt-1">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <Input
                    id={`popup-link-${index}`}
                    value={image.popup_link}
                    onChange={(e) =>
                      handleImageChange(index, "popup_link", e.target.value)
                    }
                    placeholder="Enter popup modal link..."
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section Button */}
      <Card>
        <CardHeader>
          <CardTitle>Section Button</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="button-label">Button Label</Label>
            <Input
              id="button-label"
              value={productData.button.label}
              onChange={(e) => handleButtonChange("label", e.target.value)}
              placeholder="Enter button label..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="button-popup-title">Button Popup Title</Label>
            <Input
              id="button-popup-title"
              value={productData.button.popup_title}
              onChange={(e) =>
                handleButtonChange("popup_title", e.target.value)
              }
              placeholder="Enter popup title..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="button-popup">Popup Modal Link</Label>
            <div className="flex items-center gap-2 mt-1">
              <LinkIcon className="w-4 h-4 text-gray-400" />
              <Input
                id="button-popup"
                value={productData.button.popup_link}
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
    </div>
  );
}
