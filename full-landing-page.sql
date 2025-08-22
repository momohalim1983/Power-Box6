-- =====================================================
-- HEALTHY SNACK BOX (42 COUNT) - COMPLETE DATABASE SETUP
-- =====================================================
-- This script creates all necessary tables for the landing page
-- with Row Level Security and complete ready-to-use data
-- Structure matches exactly what the frontend expects

-- =====================================================
-- 1. HERO SECTION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hero_section (
    id BIGSERIAL PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on hero_section" ON hero_section FOR SELECT USING (true);

-- Insert hero section data with exact frontend structure
INSERT INTO hero_section (content) VALUES (
    '{
        "title": "Nutritious Snack Box with Breakfast Bars and Delicious Chips | Gift A Snack (42 Count)",
        "rating": 4.6,
        "reviews_count": 23,
        "sale_price": 31.95,
        "features": [
            "Fresh & high-quality snacks",
            "Walmart+ offer eligible"
        ],
        "delivery_text": "Fast & reliable delivery",
        "urgency_text": "Limited stock available",
        "primary_cta": "View Product Details",
        "secondary_cta": "Learn More About This Product",
        "main_image": "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F79d471e5bc56457eb2c3b1c3eb6586ae?format=webp&width=800",
        "walmart_url": "https://www.walmart.com/ip/Healthy-Snack-Box-Tasty-Nutrient-Rich-Variety-42-Count-by-Gift-A-Snack/14479818419?selectedSellerId=16964&selectedOfferId=BEA9DA42A8853A4C927EECB4D702F303&clickid=3PE2sMyDBxycW1s0QQThKWW7Ukp2AmR-AQ%3AGxo0&irgwc=1&sourceid=imp_3PE2sMyDBxycW1s0QQThKWW7Ukp2AmR-AQ%3AGxo0&veh=aff&wmlspartner=imp_5610446&affiliates_ad_id=565706&campaign_id=9383&sharedid=mp_16964_2016489964_knpf1_4mtlu49_BEA9DA42A8853A4C927EECB4D702F303&utm_source=landing&utm_medium=cta&utm_campaign=snackbox"
    }'
);

-- =====================================================
-- 2. WHY CHOOSE SECTION TABLE (BENEFITS)
-- =====================================================
CREATE TABLE IF NOT EXISTS why_choose_section (
    id BIGSERIAL PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE why_choose_section ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on why_choose_section" ON why_choose_section FOR SELECT USING (true);

-- Insert why choose section data with exact frontend structure
INSERT INTO why_choose_section (content) VALUES (
    '{
        "title": "Why Choose Our Nutritious Snack Box?",
        "benefits": [
            {
                "title": "Variety of Snacks",
                "description": "Perfect mix of breakfast bars and savory snacks for any time of day",
                "color": "blue",
                "image": "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F4d9abe9f679440fcb3470285697707f4?format=webp&width=800"
            },
            {
                "title": "High-End Packaging",
                "description": "Attractive and professional packaging that makes a great impression",
                "color": "purple",
                "image": "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F6305c43f8b6449fc8926c50b002e25fe?format=webp&width=800"
            },
            {
                "title": "Grab-and-Go Convenience",
                "description": "Individually packaged snacks perfect for busy lifestyles",
                "color": "green",
                "image": "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F26b950db7e9644baa7113c5a0046d0fa?format=webp&width=800"
            },
            {
                "title": "Suitable for All Ages",
                "description": "Perfect for adults, teens, and college students alike",
                "color": "orange",
                "image": "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2Fa7c068e933744309b8f41ed0726156a2?format=webp&width=800"
            },
            {
                "title": "Heartwarming Greeting Card",
                "description": "Comes with a special greeting card to show you care",
                "color": "red",
                "image": "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F19d8d6717d2a4dc6b633c9494573527a?format=webp&width=800"
            },
            {
                "title": "42 Count Value",
                "description": "Generous quantity ensuring lasting satisfaction and value",
                "color": "indigo",
                "image": "https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F74bff8b15ba640b1acf1428f6b9b71b9?format=webp&width=800"
            }
        ]
    }'
);

-- =====================================================
-- 3. PRODUCT GALLERY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS product_gallery (
    id BIGSERIAL PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE product_gallery ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on product_gallery" ON product_gallery FOR SELECT USING (true);

-- Insert product gallery data with exact frontend structure
INSERT INTO product_gallery (content) VALUES (
    '{
        "title": "See What'\''s Inside Your Box",
        "images": [
            {
                "url": "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F79d471e5bc56457eb2c3b1c3eb6586ae?format=webp&width=800",
                "title": "Complete Collection",
                "alt": "Nutritious Snack Box with Breakfast Bars and Delicious Chips - 42 Count"
            },
            {
                "url": "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F05b5599b733643de9ed02db80950feb9?format=webp&width=800",
                "title": "Inside View",
                "alt": "Inside view of snack box"
            },
            {
                "url": "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2Fec2c685b6b9d438f97083ea2cdb4458b?format=webp&width=800",
                "title": "Beautiful Packaging",
                "alt": "Outside box view"
            }
        ]
    }'
);

-- =====================================================
-- 4. TRUST SECTION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS trust_section (
    id BIGSERIAL PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trust_section ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on trust_section" ON trust_section FOR SELECT USING (true);

-- Insert trust section data with exact frontend structure
INSERT INTO trust_section (content) VALUES (
    '{
        "title": "Why Trust Us",
        "seller_info": {
            "name": "Pro Seller",
            "rating": 4.75,
            "reviews_count": 570
        },
        "walmart_info": {
            "text": "Official Walmart Seller",
            "subtext": "Secure checkout and fast delivery"
        },
        "guarantee": {
            "text": "Free 90-Day Returns",
            "subtext": "Shop with confidence - easy returns"
        }
    }'
);

-- =====================================================
-- 5. CUSTOMER REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_reviews (
    id BIGSERIAL PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on customer_reviews" ON customer_reviews FOR SELECT USING (true);

-- Insert customer reviews data with exact frontend structure
INSERT INTO customer_reviews (content) VALUES (
    '{
        "title": "What Our Customers Say",
        "overall_rating": 4.6,
        "total_reviews": 23,
        "reviews": [
            {
                "name": "Sarah M.",
                "rating": 5,
                "text": "Amazing variety! Perfect for our office team. Everyone loved the selection of snacks.",
                "date": "2 weeks ago",
                "verified": true
            },
            {
                "name": "Mike D.",
                "rating": 5,
                "text": "Great gift idea! Sent this to my college son and he was thrilled with all the different snacks.",
                "date": "1 month ago",
                "verified": true
            },
            {
                "name": "Lisa K.",
                "rating": 4,
                "text": "Good quality snacks and fast delivery. Would definitely order again.",
                "date": "3 weeks ago",
                "verified": true
            }
        ]
    }'
);

-- =====================================================
-- 6. OFFER PRICING TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS offer_pricing (
    id BIGSERIAL PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE offer_pricing ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on offer_pricing" ON offer_pricing FOR SELECT USING (true);

-- Insert offer pricing data with exact frontend structure
INSERT INTO offer_pricing (content) VALUES (
    '{
        "title": "Ready to Fuel Your Day?",
        "subtitle": "Get your 42-count nutritious snack box today!",
        "sale_price": 31.95,
        "benefits": [
            "42 premium snacks included",
            "Fresh & high-quality snacks from top brands",
            "Perfect for gifting or office sharing",
            "Fast & reliable delivery nationwide",
            "Greeting card included"
        ],
        "cta_text": "Get Your Snack Box Now",
        "trust_elements": [
            {
                "icon": "Shield",
                "text": "Secure Payment"
            },
            {
                "icon": "Truck",
                "text": "Fast Shipping"
            },
            {
                "icon": "BadgeCheck",
                "text": "Satisfaction Guaranteed"
            }
        ]
    }'
);

-- =====================================================
-- 7. FOOTER TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS footer (
    id BIGSERIAL PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE footer ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on footer" ON footer FOR SELECT USING (true);

-- Insert footer data with exact frontend structure
INSERT INTO footer (content) VALUES (
    '{
        "social_links": [
            {
                "name": "Facebook",
                "url": "https://facebook.com",
                "icon": "Facebook"
            },
            {
                "name": "Instagram",
                "url": "https://instagram.com",
                "icon": "Instagram"
            },
            {
                "name": "Twitter",
                "url": "https://twitter.com",
                "icon": "Twitter"
            },
            {
                "name": "YouTube",
                "url": "https://youtube.com",
                "icon": "Youtube"
            },
            {
                "name": "TikTok",
                "url": "https://tiktok.com",
                "icon": "TikTok"
            }
        ]
    }'
);

-- =====================================================
-- 8. PRODUCT POPUP TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS product_popup (
    id BIGSERIAL PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE product_popup ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on product_popup" ON product_popup FOR SELECT USING (true);

-- Insert product popup data with exact frontend structure
INSERT INTO product_popup (content) VALUES (
    '{
        "title": "Nutritious Snack Box with Breakfast Bars and Delicious Chips | Gift A Snack (42 Count)",
        "description": "View detailed product information, pricing, and purchase options for this 42-piece snack collection.",
        "product_name": "Nutritious Snack Box - Gift A Snack",
        "rating": 4.6,
        "reviews_count": 23,
        "original_price": 42.99,
        "discounted_price": 31.95,
        "features": [
            "Fresh & high-quality snacks",
            "Walmart+ offer eligible"
        ],
        "pieces_count": 42,
        "additional_details": [
            "Ultimate snack experience in a beautifully designed high-end packaging box",
            "Packed with a variety of breakfast bars and savory snacks for daily energy",
            "Individually packaged snacks for convenient grab-and-go options",
            "Ideal for adults, teens, and college students alike",
            "Arrives with a heartwarming greeting card for a personal touch"
        ],
        "popup_image": "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F79d471e5bc56457eb2c3b1c3eb6586ae?format=webp&width=800"
    }'
);

-- =====================================================
-- 9. EXIT INTENT POPUP TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS exit_intent_popup (
    id BIGSERIAL PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE exit_intent_popup ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on exit_intent_popup" ON exit_intent_popup FOR SELECT USING (true);

-- Insert exit intent popup data with exact frontend structure
INSERT INTO exit_intent_popup (content) VALUES (
    '{
        "title": "Stay Updated",
        "description": "👉 Subscribe now to be the first to know about our upcoming exclusive offers\n\n👉 Join our mailing list and get the latest news and special deals before anyone else.",
        "email_placeholder": "👉 Enter your email here",
        "subscribe_button_text": "👉 Subscribe Now",
        "dismiss_button_text": "👉 Maybe later",
        "privacy_note": "👉 🔒 We will never send you spam. You can unsubscribe anytime",
        "destination_email": "",
        "mailchimp_api_key": "",
        "mailchimp_list_id": "",
        "brevo_api_key": "",
        "brevo_list_id": ""
    }'
);

-- =====================================================
-- 10. SEO SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS seo_settings (
    id BIGSERIAL PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on seo_settings" ON seo_settings FOR SELECT USING (true);

-- Insert SEO settings data with exact frontend structure
INSERT INTO seo_settings (content) VALUES (
    '{
        "meta_title": "Nutritious Snack Box with Breakfast Bars and Delicious Chips | Gift A Snack (42 Count)",
        "meta_description": "Get your 42-count nutritious snack box with breakfast bars and delicious chips. Perfect for gifting, office sharing, or personal enjoyment. Fast delivery, high-quality snacks.",
        "meta_keywords": "snack box, breakfast bars, healthy snacks, gift box, nutritious snacks, office snacks, 42 count, delicious chips",
        "og_title": "Nutritious Snack Box - 42 Premium Snacks | Gift A Snack",
        "og_description": "Amazing variety of snacks! Perfect for office teams, college students, and gifts. Fresh & high-quality snacks with fast delivery.",
        "og_image": "https://cdn.builder.io/api/v1/image/assets%2F84282e2d620247d2b8d8845fda2c790e%2F79d471e5bc56457eb2c3b1c3eb6586ae?format=webp&width=1200",
        "canonical_url": "",
        "facebook_pixel_id": ""
    }'
);

-- =====================================================
-- 11. EMAIL SUBSCRIPTIONS TABLE (for storing subscriptions)
-- =====================================================
CREATE TABLE IF NOT EXISTS email_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'exit_intent_popup',
    is_active BOOLEAN DEFAULT true,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert access (to allow subscriptions)
CREATE POLICY "Allow public insert on email_subscriptions" ON email_subscriptions FOR INSERT WITH CHECK (true);

-- =====================================================
-- 12. CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_active ON email_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_subscribed_at ON email_subscriptions(subscribed_at);

-- =====================================================
-- 13. CREATE FUNCTIONS FOR UPDATED_AT TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_hero_section_updated_at BEFORE UPDATE ON hero_section FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_why_choose_section_updated_at BEFORE UPDATE ON why_choose_section FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_gallery_updated_at BEFORE UPDATE ON product_gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trust_section_updated_at BEFORE UPDATE ON trust_section FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_reviews_updated_at BEFORE UPDATE ON customer_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offer_pricing_updated_at BEFORE UPDATE ON offer_pricing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_updated_at BEFORE UPDATE ON footer FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_popup_updated_at BEFORE UPDATE ON product_popup FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exit_intent_popup_updated_at BEFORE UPDATE ON exit_intent_popup FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ✅ SETUP COMPLETE!
-- =====================================================
-- 
-- Your Healthy Snack Box landing page database is now ready!
-- 
-- Tables Created (matching exact frontend structure):
-- ✓ hero_section - Hero content with pricing, images, CTAs
-- ✓ why_choose_section - 6 benefits with colors and images
-- ✓ product_gallery - 3 product images with titles
-- ✓ trust_section - Walmart seller info and guarantees
-- ✓ customer_reviews - Customer review data structure
-- ✓ offer_pricing - Final CTA section with pricing
-- ✓ footer - Social media links
-- ✓ product_popup - Product modal content
-- ✓ exit_intent_popup - Email subscription popup
-- ✓ seo_settings - SEO meta tags and tracking
-- ✓ email_subscriptions - Store newsletter signups
-- 
-- Features Enabled:
-- ✓ Row Level Security on all tables
-- ✓ Public read access policies
-- ✓ Public insert for email subscriptions
-- ✓ Automatic updated_at timestamps
-- ✓ Performance indexes
-- ✓ Complete realistic data matching frontend exactly
-- 
-- Your frontend will now work immediately with this data!
-- =====================================================
