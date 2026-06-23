export type Language = "en" | "zh";

export type LocalizedText = {
  en: string;
  zh: string;
};

export type ProductImage = {
  src: string;
  alt: LocalizedText;
  pending?: boolean;
};

export type ProductItem = {
  slug: string;
  parentSlug: string;
  formValue: string;
  name: LocalizedText;
  shortName: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  applications: LocalizedText[];
  commonOptions: LocalizedText[];
  sourcingNotes: LocalizedText;
  heroImage: ProductImage;
  galleryImages: ProductImage[];
};

export type ProductCategory = {
  slug: string;
  name: LocalizedText;
  summary: LocalizedText;
  items: ProductItem[];
};

const imagePlaceholder = "./assets/product-image-placeholder.svg";

const text = (en: string, zh: string): LocalizedText => ({ en, zh });

const productImageSources: Record<string, string[]> = {
  "bubble-mailer/aluminum-bubble-mailer": [
    "01-hero-scene.png",
    "02-packing-desk-scene.png",
    "03-b2b-display-scene.png",
    "04-material-closeup.png",
    "05-color-size-assortment.png",
    "06-electronics-shipping-scene.png",
    "07-cosmetics-boutique-scene.png",
    "08-wholesale-supplier-scene.png",
  ].map((file) => `./assets/products/bubble-mailer/aluminum-bubble-mailer/${file}?v=20260623-1`),
  "bubble-mailer/biodegradable-bubble-mailer": [
    "01-hero-scene.png",
    "02-application-scene.png",
    "03-b2b-display-scene.png",
    "04-material-closeup.png",
    "05-color-size-assortment.png",
    "06-industry-use-scene.png",
    "07-premium-lifestyle-scene.png",
    "08-wholesale-supplier-scene.png",
  ].map((file) => `./assets/products/bubble-mailer/biodegradable-bubble-mailer/${file}?v=20260623-1`),
  "bubble-mailer/co-extruded-bubble-mailer": [
    "01-hero-scene.png",
    "02-application-scene.png",
    "03-b2b-display-scene.png",
    "04-material-closeup.png",
    "05-color-size-assortment.png",
    "06-industry-use-scene.png",
    "07-premium-lifestyle-scene.png",
    "08-wholesale-supplier-scene.png",
  ].map((file) => `./assets/products/bubble-mailer/co-extruded-bubble-mailer/${file}?v=20260623-1`),
  "bubble-mailer/kraft-paper-bubble-mailer": [
    "01-hero-scene.png",
    "02-application-scene.png",
    "03-b2b-display-scene.png",
    "04-material-closeup.png",
    "05-color-size-assortment.png",
    "06-industry-use-scene.png",
    "07-premium-lifestyle-scene.png",
    "08-wholesale-supplier-scene.png",
  ].map((file) => `./assets/products/bubble-mailer/kraft-paper-bubble-mailer/${file}?v=20260623-1`),
  "bubble-mailer/pearlescent-bubble-mailer": [
    "01-hero-scene.png",
    "02-application-scene.png",
    "03-b2b-display-scene.png",
    "04-material-closeup.png",
    "05-color-size-assortment.png",
    "06-industry-use-scene.png",
    "07-premium-lifestyle-scene.png",
    "08-wholesale-supplier-scene.png",
  ].map((file) => `./assets/products/bubble-mailer/pearlescent-bubble-mailer/${file}?v=20260623-1`),
  "bubble-mailer/poly-bubble-mailer": [
    "01-hero-scene.png",
    "02-application-scene.png",
    "03-b2b-display-scene.png",
    "04-material-closeup.png",
    "05-color-size-assortment.png",
    "06-industry-use-scene.png",
    "07-premium-lifestyle-scene.png",
    "08-wholesale-supplier-scene.png",
  ].map((file) => `./assets/products/bubble-mailer/poly-bubble-mailer/${file}?v=20260623-1`),
  "mailing-bag/biodegradable-mailing-bag": [
    "01-hero-scene.png",
    "02-application-scene.png",
    "03-b2b-display-scene.png",
    "04-material-closeup.png",
    "05-color-size-assortment.png",
    "06-industry-use-scene.png",
    "07-premium-lifestyle-scene.png",
    "08-wholesale-supplier-scene.png",
  ].map((file) => `./assets/products/mailing-bag/biodegradable-mailing-bag/${file}?v=20260623-1`),
};

const productText = (name: LocalizedText) => ({
  subtitle: text(
    `Custom ${name.en.toLowerCase()} for brand packaging, shipping and retail use.`,
    `${name.zh}，适合品牌包装、发货和零售展示。`,
  ),
  description: text(
    `${name.en} can be customized by size, material, color and printing requirements. Share your product details and quantity range so we can help compare workable options.`,
    `${name.zh}可以根据尺寸、材料、颜色和印刷需求定制。你后面给到具体图片和需求后，页面可以继续补充更准确的产品展示。`,
  ),
  sourcingNotes: text(
    "Image slots are prepared for this product. Final product photos can be added after the selected images are confirmed.",
    "这个产品页已经预留图片位置。等你确认每个产品的具体图片后，可以直接替换到对应位置。",
  ),
});

const gallery = (slug: string, name: LocalizedText, imageSourcesOrCount: string[] | number = 6): ProductImage[] => {
  if (Array.isArray(imageSourcesOrCount)) {
    return imageSourcesOrCount.map((src, index) => ({
      src,
      alt: text(`${name.en} image ${index + 1}`, `${name.zh}图片 ${index + 1}`),
    }));
  }

  return Array.from({ length: imageSourcesOrCount }, (_, index) => ({
    src: imagePlaceholder,
    alt: text(`${name.en} image ${index + 1}`, `${name.zh}图片 ${index + 1}`),
    pending: true,
  }));
};

const product = (
  parentSlug: string,
  slug: string,
  en: string,
  zh: string,
  applications: LocalizedText[],
  commonOptions: LocalizedText[],
  imageCount = 6,
): ProductItem => {
  const name = text(en, zh);
  const copy = productText(name);
  const imageSources = productImageSources[`${parentSlug}/${slug}`];
  const galleryImages = gallery(slug, name, imageSources ?? imageCount);

  return {
    slug,
    parentSlug,
    formValue: en,
    name,
    shortName: name,
    subtitle: copy.subtitle,
    description: copy.description,
    applications,
    commonOptions,
    sourcingNotes: copy.sourcingNotes,
    heroImage: galleryImages[0],
    galleryImages,
  };
};

export const productCategories: ProductCategory[] = [
  {
    slug: "mailing-bag",
    name: text("Mailing Bag", "邮寄袋"),
    summary: text(
      "Lightweight shipping bags and envelopes for apparel, documents and ecommerce parcels.",
      "适合服装、电商小包和文件寄送的轻量发货袋与信封类产品。",
    ),
    items: [
      product("mailing-bag", "poly-mailing-bag", "Poly Mailing Bag", "聚乙烯邮寄袋", [text("Ecommerce apparel shipping", "电商服装发货"), text("Soft goods delivery", "软性产品寄送")], [text("Custom size", "定制尺寸"), text("Self-seal strip", "自粘封口"), text("Custom printing", "定制印刷")], 6),
      product("mailing-bag", "biodegradable-mailing-bag", "Biodegradable Mailing Bag", "可生物降解邮寄袋", [text("Eco-conscious shipping", "环保发货包装"), text("DTC brand packaging", "DTC 品牌包装")], [text("Compostable material", "可堆肥材料"), text("Self adhesive seal", "自粘封口"), text("Custom colors", "定制颜色")], 6),
      product("mailing-bag", "die-cut-handle-mailing-bag", "Die Cut Handle Mailing Bag", "模切手柄邮寄袋", [text("Retail pickup bags", "零售提货袋"), text("Clothing packaging", "服装包装")], [text("Die-cut handle", "模切手柄"), text("Reinforced film", "加厚膜料"), text("Logo print", "Logo 印刷")], 6),
      product("mailing-bag", "double-seal-mailing-bag", "Double Seal Mailing Bag", "双密封邮寄袋", [text("Returns-friendly shipping", "支持退换货发货"), text("Subscription parcels", "订阅制包裹")], [text("Double adhesive strip", "双胶条"), text("Tear strip", "易撕条"), text("Opaque film", "不透明膜")], 6),
      product("mailing-bag", "recycled-mailing-bag", "Recycled Mailing Bag", "回收邮寄袋", [text("Sustainable shipping", "可持续发货包装"), text("Fashion and accessories", "服装配饰")], [text("Recycled PE", "再生 PE"), text("Matte finish", "哑面效果"), text("Custom thickness", "定制厚度")], 6),
      product("mailing-bag", "pocket-mailing-bag", "Pocket Mailing Bag", "带口袋的邮寄袋", [text("Waybill and document shipping", "带运单或文件发货"), text("Ecommerce parcels", "电商包裹")], [text("Document pocket", "外置文件袋"), text("Self-seal strip", "自粘封口"), text("Custom size", "定制尺寸")], 6),
      product("mailing-bag", "pre-open-bag", "Pre-open Bag", "预开袋", [text("Automated packing lines", "自动包装线"), text("High-volume fulfillment", "大批量履约发货")], [text("Perforation", "打孔/易撕"), text("Roll packing", "卷装"), text("Fast loading", "快速装袋")], 6),
      product("mailing-bag", "paper-envelope", "Paper Envelope", "纸质信封", [text("Documents and cards", "文件和卡片"), text("Lightweight mail", "轻量邮寄")], [text("Kraft paper", "牛皮纸"), text("Peel-and-seal", "撕条自封"), text("Custom print", "定制印刷")], 6),
    ],
  },
  {
    slug: "bubble-mailer",
    name: text("Bubble Mailer", "气泡邮件袋"),
    summary: text(
      "Padded mailers for products that need lightweight protection during delivery.",
      "适合需要轻量保护的产品寄送，常用于配饰、小件和跨境包裹。",
    ),
    items: [
      product("bubble-mailer", "poly-bubble-mailer", "Poly Bubble Mailer", "聚乙烯气泡邮件袋", [text("Small product shipping", "小件产品寄送"), text("Accessories packaging", "配饰包装")], [text("Bubble lining", "气泡内衬"), text("Water-resistant outer layer", "防水外层"), text("Self-seal closure", "自粘封口")], 6),
      product("bubble-mailer", "co-extruded-bubble-mailer", "Co-extruded Bubble Mailer", "共挤出气泡邮件袋", [text("Durable ecommerce shipping", "耐用电商发货"), text("Printed brand mailers", "品牌印刷邮件袋")], [text("Co-extruded film", "共挤膜"), text("Custom color", "定制颜色"), text("Logo print", "Logo 印刷")], 6),
      product("bubble-mailer", "kraft-paper-bubble-mailer", "Kraft Paper Bubble Mailer", "牛皮纸气泡邮件袋", [text("Natural-look shipping", "自然风发货包装"), text("Books and small goods", "书籍和小件商品")], [text("Kraft paper outside", "牛皮纸外层"), text("Bubble padding", "气泡缓冲"), text("Peel-and-seal", "撕条自封")], 6),
      product("bubble-mailer", "pearlescent-bubble-mailer", "Pearlescent Bubble Mailer", "珠光气泡邮件袋", [text("Beauty and accessories", "美妆配饰"), text("Gift-like parcels", "礼品感包裹")], [text("Pearl film", "珠光膜"), text("Bubble lining", "气泡内衬"), text("Custom color", "定制颜色")], 6),
      product("bubble-mailer", "biodegradable-bubble-mailer", "Biodegradable Bubble Mailer", "可生物降解气泡邮件袋", [text("Eco-conscious padded shipping", "环保缓冲发货"), text("Lightweight protection", "轻量保护")], [text("Compostable film option", "可堆肥膜料选项"), text("Padded lining", "缓冲内衬"), text("Custom print", "定制印刷")], 6),
      product("bubble-mailer", "aluminum-bubble-mailer", "Aluminum Bubble Mailer", "铝箔气泡邮件袋", [text("Insulated shipping", "保温隔热寄送"), text("Sensitive goods packaging", "敏感产品包装")], [text("Aluminum foil layer", "铝箔层"), text("Bubble padding", "气泡缓冲"), text("Heat reflection", "隔热反射")], 6),
    ],
  },
  {
    slug: "zipper-bag",
    name: text("Zipper Bag", "拉链袋"),
    summary: text("Resealable bags for small products, retail sets and storage packaging.", "适合小产品、零售套装和收纳包装的可重复封口袋。"),
    items: [
      product("zipper-bag", "zipper-bag", "Zipper Bag", "拉链袋", [text("Small product packaging", "小产品包装"), text("Retail and storage", "零售与收纳")], [text("Resealable zipper", "可重复拉链"), text("Frosted or clear material", "磨砂或透明材料"), text("Custom size", "定制尺寸")], 6),
    ],
  },
  {
    slug: "self-seal-bag",
    name: text("Self Seal Bag", "自密封袋"),
    summary: text("Self-adhesive bags for fast packing and simple product protection.", "适合快速包装和基础防护的自粘封口袋。"),
    items: [
      product("self-seal-bag", "self-seal-bag", "Self Seal Bag", "自密封袋", [text("Fast retail packing", "快速零售包装"), text("Document and accessory protection", "文件和配件保护")], [text("Peel-off adhesive", "撕条胶封"), text("Clear film", "透明膜"), text("Custom size", "定制尺寸")], 6),
    ],
  },
  {
    slug: "paper-bag",
    name: text("Paper bag", "纸袋"),
    summary: text("Paper shopping bags, gift bags and specialty paper bags for retail brands.", "适合零售品牌的购物纸袋、礼品纸袋和特殊纸质包装袋。"),
    items: [
      product("paper-bag", "gift-paper-bag", "Gift Paper Bag", "礼品纸袋", [text("Gift packaging", "礼品包装"), text("Retail shopping", "零售购物")], [text("Ribbon or rope handle", "丝带或绳手挽"), text("Custom print", "定制印刷"), text("Matte or gloss lamination", "哑膜或亮膜")], 6),
      product("paper-bag", "kraft-paper-bag", "Kraft Paper Bag", "牛皮纸袋", [text("Takeaway and retail", "外卖和零售"), text("Natural brand packaging", "自然风品牌包装")], [text("Brown or white kraft", "本色或白色牛皮纸"), text("Twisted paper handle", "纸绳手挽"), text("Logo print", "Logo 印刷")], 6),
      product("paper-bag", "art-paper-bag", "Art Paper Bag", "艺术纸袋", [text("Boutique retail", "精品零售"), text("Premium gifting", "高端礼品")], [text("Art paper", "艺术纸"), text("Foil stamping", "烫金"), text("Embossing", "压纹")], 6),
      product("paper-bag", "glassine-paper-bag", "Glassine Paper Bag", "玻璃纸袋", [text("Bakery and stationery", "烘焙和文具"), text("Light product packaging", "轻量产品包装")], [text("Translucent paper", "半透明纸"), text("Grease-resistant option", "防油选项"), text("Custom sticker seal", "定制贴纸封口")], 6),
    ],
  },
  {
    slug: "plastic-packaging-bag",
    name: text("Plastic packaging bag", "塑料包装袋"),
    summary: text("Plastic retail bags with handle, die cut and custom printed options.", "带手提、模切和定制印刷选项的塑料零售包装袋。"),
    items: [
      product("plastic-packaging-bag", "loop-handle-bag", "Loop handle bag", "环形提手袋", [text("Retail carry bags", "零售手提袋"), text("Promotional packaging", "促销包装")], [text("Loop handle", "环形提手"), text("PE material", "PE 材料"), text("Custom print", "定制印刷")], 6),
      product("plastic-packaging-bag", "die-cut-bag", "Die cut bag", "模切袋", [text("Retail shopping", "零售购物"), text("Lightweight product bags", "轻量产品袋")], [text("Die-cut handle", "模切手挽"), text("HDPE or LDPE", "HDPE 或 LDPE"), text("Custom thickness", "定制厚度")], 6),
    ],
  },
  {
    slug: "stand-up-pouch",
    name: text("Stand Up Pouch", "站立式小袋"),
    summary: text("Stand-up pouches for food, beauty, refill and small product packaging.", "适合食品、美妆、补充装和小产品包装的自立袋。"),
    items: [
      product("stand-up-pouch", "stand-up-pouch", "Stand Up Pouch", "站立式小袋", [text("Food and coffee", "食品和咖啡"), text("Beauty refill packaging", "美妆补充装")], [text("Zipper closure", "拉链封口"), text("Tear notch", "易撕口"), text("Foil barrier", "铝箔阻隔")], 6),
    ],
  },
  {
    slug: "tissue-paper",
    name: text("Tissue Paper", "薄纸"),
    summary: text("Wrapping tissue paper for unboxing, apparel and gift presentation.", "用于开箱体验、服装和礼品展示的包装薄纸。"),
    items: [
      product("tissue-paper", "tissue-paper", "Tissue Paper", "薄纸", [text("Unboxing experience", "开箱体验"), text("Apparel wrapping", "服装包裹")], [text("Custom print", "定制印刷"), text("Soft touch", "柔软手感"), text("Custom size", "定制尺寸")], 6),
    ],
  },
];

export const allProducts = productCategories.flatMap((category) => category.items);

export const findCategory = (slug: string) => productCategories.find((category) => category.slug === slug);

export const findProduct = (categorySlug: string, productSlug: string) =>
  findCategory(categorySlug)?.items.find((item) => item.slug === productSlug);

export const label = (value: LocalizedText, language: Language) => value[language];
