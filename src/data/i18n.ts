export type Language = "en" | "zh";

export type Product = {
  slug: string;
  formValue: string;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  image: string;
  bestFor: string[];
  commonOptions: string[];
  sourcingNotes: string;
};

type NavItem = {
  label: string;
  path: string;
};

type PageHeroContent = {
  eyebrow: string;
  title: string;
  text: string;
};

export const company = {
  brandName: "Xintu Packaging Solutions",
  legalNameEn: "Guangzhou Xintu International Trade Co., Ltd.",
  legalNameZh: "广州信途国际贸易有限公司",
  registeredName: "Xintu Packaging Solutions Co., Ltd.",
  domain: "xintutrade.com",
  registrationNo: "91440104MAG0FMAK5U",
  locationEn: "Guangzhou, China",
  locationZh: "中国广州",
  email: "judy@xintutrade.com",
  whatsapp: "+86 000 0000 0000",
  formEndpoint: "",
};

export const content: Record<
  Language,
  {
    locale: string;
    nav: NavItem[];
    language: {
      label: string;
      english: string;
      chinese: string;
    };
    home: {
      hero: PageHeroContent;
      primaryCta: string;
      secondaryCta: string;
      heroImageAlt: string;
      productsEyebrow: string;
      productsTitle: string;
      productsText: string;
      whyEyebrow: string;
      whyTitle: string;
      whyText: string;
      stepsEyebrow: string;
      stepsTitle: string;
      customersEyebrow: string;
      customersTitle: string;
    };
    productsPage: PageHeroContent;
    aboutPage: PageHeroContent & {
      introTitle: string;
      companyDetailsTitle: string;
      companyDetails: Array<{ label: string; value: string }>;
      roleEyebrow: string;
      roleTitle: string;
    };
    quotePage: PageHeroContent & {
      detailsTitle: string;
      helpfulDetails: string[];
      emailLabel: string;
      fields: {
        name: string;
        email: string;
        company: string;
        country: string;
        productType: string;
        productTypePlaceholder: string;
        size: string;
        sizePlaceholder: string;
        material: string;
        materialPlaceholder: string;
        printingRequirement: string;
        printingPlaceholder: string;
        quantity: string;
        quantityPlaceholder: string;
        targetPrice: string;
        targetPricePlaceholder: string;
        needSample: string;
        sampleYes: string;
        sampleNo: string;
        sampleNotSure: string;
        upload: string;
        message: string;
        messagePlaceholder: string;
        submit: string;
      };
      status: {
        noEndpoint: string;
        sending: string;
        success: string;
        error: string;
      };
    };
    productDetail: {
      eyebrow: string;
      requestButton: string;
      bestFor: string;
      commonOptions: string;
      sourcingNote: string;
      moreEyebrow: string;
      moreTitle: string;
    };
    cta: {
      eyebrow: string;
      title: string;
      text: string;
      button: string;
    };
    footer: {
      description: string;
      productsTitle: string;
      contactTitle: string;
    };
    notFound: PageHeroContent;
    companyIntro: string[];
    products: Product[];
    serviceSteps: Array<{ title: string; text: string }>;
    customerTypes: string[];
    trustPoints: string[];
  }
> = {
  en: {
    locale: "en",
    nav: [
      { label: "Home", path: "/" },
      { label: "Products", path: "/products" },
      { label: "About", path: "/about" },
      { label: "Get a Quote", path: "/quote" },
    ],
    language: {
      label: "Language",
      english: "EN",
      chinese: "中文",
    },
    home: {
      hero: {
        eyebrow: "Custom packaging sourcing from China",
        title: "Custom packaging support for growing overseas brands.",
        text: "We help eCommerce, food, beauty, apparel and product brands source custom paper bags, mailer bags, food pouches, packaging boxes and brand packaging kits with practical follow-up from sample to shipment.",
      },
      primaryCta: "Get a Quote",
      secondaryCta: "View Products",
      heroImageAlt: "Paper bags, mailer bags, pouches and boxes",
      productsEyebrow: "Product categories",
      productsTitle: "Common packaging types for first inquiries",
      productsText:
        "The first version focuses on high-frequency packaging categories that overseas small brands usually ask for first.",
      whyEyebrow: "Why choose us",
      whyTitle: "A sourcing partner for practical packaging follow-up.",
      whyText:
        "We focus on helping you compare workable packaging options, communicate details more clearly and follow up the production steps that are easy to miss when sourcing from far away.",
      stepsEyebrow: "Service process",
      stepsTitle: "Simple support from idea to shipment check",
      customersEyebrow: "Best fit",
      customersTitle: "Built for small and growing brands",
    },
    productsPage: {
      eyebrow: "Products",
      title: "Custom packaging categories for practical sourcing.",
      text: "Start from one of the common packaging types below, or send us your product details if you are not sure which structure is suitable.",
    },
    aboutPage: {
      eyebrow: "About Xintu",
      title: "A Guangzhou-based packaging sourcing partner for growing brands.",
      text: "We keep the work practical: compare packaging options, support samples, follow up production and help clients review visible details before shipment.",
      introTitle: "Company introduction",
      companyDetailsTitle: "Company details",
      companyDetails: [
        { label: "Brand", value: company.brandName },
        { label: "Registered name", value: company.legalNameEn },
        { label: "Location", value: company.locationEn },
        { label: "Registration No.", value: company.registrationNo },
      ],
      roleEyebrow: "Our role",
      roleTitle: "We help bridge packaging ideas and production follow-up.",
    },
    quotePage: {
      eyebrow: "Get a Quote",
      title: "Tell us what packaging you need.",
      text: "Share your product type, size, material, printing needs and estimated quantity. We will help you check practical options and sample possibilities.",
      detailsTitle: "Helpful details to include",
      helpfulDetails: [
        "Product size and weight",
        "Estimated order quantity",
        "Preferred material or reference photo",
        "Logo or artwork file if available",
        "Target market and shipping timeline",
      ],
      emailLabel: "Email",
      fields: {
        name: "Name",
        email: "Email",
        company: "Company",
        country: "Country",
        productType: "Product Type",
        productTypePlaceholder: "Select a product type",
        size: "Size",
        sizePlaceholder: "e.g. 20 x 30 cm",
        material: "Material",
        materialPlaceholder: "e.g. kraft paper, PE, foil barrier",
        printingRequirement: "Printing Requirement",
        printingPlaceholder: "e.g. 1-color logo, full-color print",
        quantity: "Quantity",
        quantityPlaceholder: "e.g. 1000 pcs",
        targetPrice: "Target Price",
        targetPricePlaceholder: "Optional",
        needSample: "Need Sample",
        sampleYes: "Yes",
        sampleNo: "No",
        sampleNotSure: "Not sure",
        upload: "Upload Logo or Design",
        message: "Message",
        messagePlaceholder:
          "Tell us about your product, packaging idea, timeline or any reference style.",
        submit: "Submit Inquiry",
      },
      status: {
        noEndpoint:
          "The inquiry form receiving address is not configured yet. Please contact us by email for now.",
        sending: "Sending your inquiry...",
        success: "Thanks. Your inquiry has been sent.",
        error: "We could not send the form right now. Please email us directly.",
      },
    },
    productDetail: {
      eyebrow: "Product category",
      requestButton: "Request this Packaging",
      bestFor: "Best for",
      commonOptions: "Common options",
      sourcingNote: "Sourcing note",
      moreEyebrow: "More options",
      moreTitle: "Other packaging categories",
    },
    cta: {
      eyebrow: "Ready to compare options?",
      title: "Send your packaging idea and quantity range.",
      text: "We can help check suitable structures, common materials, sample support and practical production follow-up steps.",
      button: "Get a Quote",
    },
    footer: {
      description:
        "Custom packaging sourcing support from Guangzhou, China for overseas small and growing brands.",
      productsTitle: "Products",
      contactTitle: "Contact",
    },
    notFound: {
      eyebrow: "Not found",
      title: "This page is not available.",
      text: "Please return to the product page or send us your packaging inquiry directly.",
    },
    companyIntro: [
      "Xintu Packaging Solutions Co., Ltd. is a Guangzhou-based packaging sourcing partner helping overseas small and growing brands develop custom packaging with flexible MOQ, custom printing and practical supplier support.",
      "We work with packaging manufacturers across China to help clients compare options, request samples, confirm materials, follow up production and arrange pre-shipment photo or video checks before delivery.",
      "Our focus is simple: help eCommerce, food, beauty, apparel and product brands source packaging more clearly, with fewer communication gaps and more reliable follow-up.",
    ],
    products: [
      {
        slug: "custom-paper-bags",
        formValue: "Custom Paper Bags",
        name: "Custom Paper Bags",
        shortName: "Paper Bags",
        subtitle: "Printed shopping bags, kraft bags and takeaway paper bags.",
        description:
          "A practical choice for retail, apparel, gifts, cafes and takeaway brands that need a branded carrying solution with flexible paper, handle and print options.",
        image: "./assets/product-paper-bags-real.png?v=20260621-3",
        bestFor: ["Retail shops", "Apparel brands", "Coffee shops", "Gift packaging"],
        commonOptions: [
          "Kraft paper",
          "White card paper",
          "Twisted paper handles",
          "Cotton or ribbon handles",
          "Matte or gloss lamination",
        ],
        sourcingNotes:
          "Useful for brands that want visible offline brand exposure without starting from a high-complexity packaging project.",
      },
      {
        slug: "custom-mailer-bags",
        formValue: "Custom Mailer Bags",
        name: "Custom Mailer Bags",
        shortName: "Mailer Bags",
        subtitle: "Poly mailers, compostable mailers, kraft mailers and padded mailers.",
        description:
          "Lightweight mailing bags for Shopify, DTC, fashion and accessory brands that ship soft goods or small products internationally.",
        image: "./assets/product-mailer-bags-real.png?v=20260621-3",
        bestFor: ["DTC stores", "Fashion brands", "Accessories", "Subscription shipments"],
        commonOptions: [
          "Self-seal strip",
          "Double adhesive strip",
          "Recycled PE",
          "Compostable material",
          "Bubble lining",
        ],
        sourcingNotes:
          "A high-frequency inquiry category because size, material and printing can be adjusted quickly for different order volumes.",
      },
      {
        slug: "food-coffee-packaging-bags",
        formValue: "Food & Coffee Packaging Bags",
        name: "Food & Coffee Packaging Bags",
        shortName: "Food & Coffee Bags",
        subtitle: "Coffee bags, tea bags, pet food bags, stand-up food pouches and flat-bottom bags.",
        description:
          "Flexible food packaging for dry goods and specialty products, with common options for zipper, valve, window and barrier materials.",
        image: "./assets/product-food-coffee-bags-real.png?v=20260621-3",
        bestFor: ["Coffee roasters", "Tea brands", "Pet food brands", "Snack brands"],
        commonOptions: [
          "Flat-bottom bags",
          "Stand-up pouches",
          "Zipper closure",
          "Degassing valve",
          "Clear window",
          "Foil barrier",
        ],
        sourcingNotes:
          "Good for brands that need sample checks before bulk production because material feel, sealing and print color matter.",
      },
      {
        slug: "custom-stand-up-pouches",
        formValue: "Custom Stand-Up Pouches",
        name: "Custom Stand-Up Pouches",
        shortName: "Stand-Up Pouches",
        subtitle: "Flexible pouches for beauty, wellness, refill, accessory and small product packaging.",
        description:
          "A versatile pouch format for non-food and dry product applications where brands need a clean retail look and flexible order quantities.",
        image: "./assets/product-stand-up-pouches-real.png?v=20260621-3",
        bestFor: ["Beauty refills", "Candles and aroma", "Supplements", "Small accessories"],
        commonOptions: ["Matte finish", "Gloss finish", "Hang hole", "Tear notch", "Zipper", "Custom size"],
        sourcingNotes:
          "A strong first-version category because one page can cover many growing-brand use cases without overpromising a fixed stock range.",
      },
      {
        slug: "custom-packaging-boxes",
        formValue: "Custom Packaging Boxes",
        name: "Custom Packaging Boxes",
        shortName: "Packaging Boxes",
        subtitle: "Mailer boxes, folding cartons, gift boxes and protective inserts.",
        description:
          "Custom box packaging for eCommerce, beauty, electronics, accessories and energy product components that need a more structured presentation.",
        image: "./assets/product-packaging-boxes-real.png?v=20260621-3",
        bestFor: ["Electronics accessories", "Beauty products", "Gift sets", "Energy product components"],
        commonOptions: [
          "Corrugated mailer boxes",
          "Folding cartons",
          "Rigid boxes",
          "Paper inserts",
          "Foam inserts",
          "Spot UV or foil stamping",
        ],
        sourcingNotes:
          "Electronic and energy product packaging is included here as an application scenario, especially when inserts and protective structure are needed.",
      },
      {
        slug: "brand-packaging-kit-accessories",
        formValue: "Brand Packaging Kit & Accessories",
        name: "Brand Packaging Kit & Accessories",
        shortName: "Brand Packaging Kit",
        subtitle: "Stickers, hang tags, cards, tissue paper and coordinated packaging sets.",
        description:
          "A flexible way for small brands to upgrade unboxing with a coordinated set of printed packaging accessories and simple add-ons.",
        image: "./assets/product-brand-kit-real.png?v=20260621-3",
        bestFor: ["New product launches", "Influencer kits", "Apparel brands", "Gift bundles"],
        commonOptions: [
          "Thank-you cards",
          "Sticker rolls",
          "Hang tags",
          "Tissue paper",
          "Sleeves",
          "Mixed packaging sets",
        ],
        sourcingNotes:
          "Helpful for overseas brands that do not yet know the exact packaging format but want a polished, consistent customer experience.",
      },
    ],
    serviceSteps: [
      {
        title: "Share your packaging idea",
        text: "Send your product type, size, quantity, material preference and any logo or design file you already have.",
      },
      {
        title: "Compare practical options",
        text: "We help check suitable materials, print methods, MOQ ranges and sample options before you decide.",
      },
      {
        title: "Sample and production follow-up",
        text: "After confirmation, we follow up sample details, production progress and key communication with suppliers.",
      },
      {
        title: "Pre-shipment check",
        text: "Before delivery, we can help request photos or videos so you can review the visible details remotely.",
      },
    ],
    customerTypes: [
      "Shopify and DTC brands",
      "Coffee and tea brands",
      "Pet food brands",
      "Beauty and aroma brands",
      "Apparel and accessories brands",
      "Electronics and energy accessory brands",
    ],
    trustPoints: [
      "Flexible MOQ discussions for small and growing brands",
      "Custom printing and sample support before bulk orders",
      "Practical material and supplier comparison",
      "Production follow-up with clearer communication",
      "Pre-shipment photo or video check support",
      "Packaging sourcing support from China with clear, realistic communication",
    ],
  },
  zh: {
    locale: "zh-CN",
    nav: [
      { label: "首页", path: "/" },
      { label: "产品", path: "/products" },
      { label: "关于我们", path: "/about" },
      { label: "获取报价", path: "/quote" },
    ],
    language: {
      label: "语言",
      english: "EN",
      chinese: "中文",
    },
    home: {
      hero: {
        eyebrow: "中国定制包装采购支持",
        title: "为海外成长型品牌提供定制包装采购支持。",
        text: "我们帮助电商品牌、食品饮品品牌、美妆香薰品牌、服装配饰品牌和产品品牌，从中国采购定制纸袋、快递袋、食品袋、包装盒和品牌包装套装，并协助从打样到出货前检查的沟通跟进。",
      },
      primaryCta: "获取报价",
      secondaryCta: "查看产品",
      heroImageAlt: "纸袋、快递袋、包装袋和包装盒示意图",
      productsEyebrow: "产品分类",
      productsTitle: "适合第一批询盘的常用包装类型",
      productsText: "第一版先聚焦海外中小品牌最常咨询、最容易落地的高频包装分类。",
      whyEyebrow: "为什么选择我们",
      whyTitle: "专注实际跟进的包装采购伙伴。",
      whyText:
        "我们重点帮助客户比较可行的包装方案，减少沟通误差，并跟进远程采购时容易遗漏的打样、生产和出货前检查环节。",
      stepsEyebrow: "服务流程",
      stepsTitle: "从包装想法到出货检查的简单支持",
      customersEyebrow: "适合客户",
      customersTitle: "适合中小型和成长型品牌",
    },
    productsPage: {
      eyebrow: "产品",
      title: "适合实际采购沟通的定制包装分类。",
      text: "你可以先从下面这些常见包装类型开始了解；如果不确定适合哪种结构，也可以直接发送产品信息给我们。",
    },
    aboutPage: {
      eyebrow: "关于信途",
      title: "位于广州的包装采购服务伙伴。",
      text: "我们把工作做得务实：比较包装方案、协助打样、跟进生产，并帮助客户在出货前查看可见细节。",
      introTitle: "公司介绍",
      companyDetailsTitle: "公司信息",
      companyDetails: [
        { label: "品牌", value: company.brandName },
        { label: "注册名称", value: company.legalNameZh },
        { label: "所在地", value: company.locationZh },
        { label: "统一社会信用代码", value: company.registrationNo },
      ],
      roleEyebrow: "我们的角色",
      roleTitle: "我们帮助客户把包装想法和生产跟进连接起来。",
    },
    quotePage: {
      eyebrow: "获取报价",
      title: "告诉我们你需要什么包装。",
      text: "请告诉我们产品类型、尺寸、材料、印刷需求和大概数量。我们会帮你先判断可行方案和打样可能性。",
      detailsTitle: "建议提供的信息",
      helpfulDetails: [
        "产品尺寸和重量",
        "预计采购数量",
        "偏好的材料或参考图片",
        "如果已有 Logo 或设计文件，可以一起提供",
        "目标市场和预计出货时间",
      ],
      emailLabel: "邮箱",
      fields: {
        name: "姓名",
        email: "邮箱",
        company: "公司",
        country: "国家/地区",
        productType: "产品类型",
        productTypePlaceholder: "请选择产品类型",
        size: "尺寸",
        sizePlaceholder: "例如：20 x 30 cm",
        material: "材料",
        materialPlaceholder: "例如：牛皮纸、PE、铝箔复合材料",
        printingRequirement: "印刷需求",
        printingPlaceholder: "例如：单色 Logo、全彩印刷",
        quantity: "数量",
        quantityPlaceholder: "例如：1000 个",
        targetPrice: "目标价格",
        targetPricePlaceholder: "可选",
        needSample: "是否需要样品",
        sampleYes: "需要",
        sampleNo: "不需要",
        sampleNotSure: "暂不确定",
        upload: "上传 Logo 或设计文件",
        message: "补充说明",
        messagePlaceholder: "请说明你的产品、包装想法、时间安排或参考风格。",
        submit: "提交询盘",
      },
      status: {
        noEndpoint: "询盘表单接收地址还未配置。请先通过邮箱联系我们。",
        sending: "正在发送询盘...",
        success: "谢谢，你的询盘已发送。",
        error: "当前暂时无法提交表单，请直接发送邮件联系我们。",
      },
    },
    productDetail: {
      eyebrow: "产品分类",
      requestButton: "咨询这类包装",
      bestFor: "适合用途",
      commonOptions: "常见选项",
      sourcingNote: "采购说明",
      moreEyebrow: "更多选择",
      moreTitle: "其他包装分类",
    },
    cta: {
      eyebrow: "准备比较方案？",
      title: "发送你的包装想法和大概数量。",
      text: "我们可以帮你先判断适合的包装结构、常见材料、打样方式和实际生产跟进步骤。",
      button: "获取报价",
    },
    footer: {
      description: "位于中国广州，为海外中小品牌提供定制包装采购支持。",
      productsTitle: "产品",
      contactTitle: "联系方式",
    },
    notFound: {
      eyebrow: "页面不存在",
      title: "这个页面暂时不可用。",
      text: "请返回产品页面，或直接发送你的包装询盘。",
    },
    companyIntro: [
      "Xintu Packaging Solutions Co., Ltd. 是一家位于广州的包装采购服务伙伴，帮助海外中小品牌和成长型品牌开发定制包装，支持灵活起订量、定制印刷和实际采购沟通。",
      "我们与中国的包装生产资源保持沟通，帮助客户比较方案、申请样品、确认材料、跟进生产，并在出货前协助获取图片或视频检查。",
      "我们的重点很简单：帮助电商、食品、美妆、服装和产品品牌更清楚地完成包装采购，减少沟通误差，让后续跟进更可靠。",
    ],
    products: [
      {
        slug: "custom-paper-bags",
        formValue: "Custom Paper Bags",
        name: "定制纸袋",
        shortName: "纸袋",
        subtitle: "印刷购物袋、牛皮纸袋和外卖纸袋。",
        description:
          "适合零售、服装、礼品、咖啡店和外卖品牌，用来做有品牌感的手提包装，可根据纸张、手提绳和印刷方式灵活定制。",
        image: "./assets/product-paper-bags-real.png?v=20260621-3",
        bestFor: ["零售店", "服装品牌", "咖啡店", "礼品包装"],
        commonOptions: ["牛皮纸", "白卡纸", "纸绳手挽", "棉绳或丝带手挽", "哑膜或亮膜"],
        sourcingNotes: "适合想提升线下品牌露出、但不想一开始做太复杂包装项目的品牌。",
      },
      {
        slug: "custom-mailer-bags",
        formValue: "Custom Mailer Bags",
        name: "定制快递袋",
        shortName: "快递袋",
        subtitle: "塑料快递袋、可降解快递袋、牛皮纸邮寄袋和气泡袋。",
        description:
          "适合 Shopify、DTC、服装和配饰品牌寄送软性产品或小件产品，重量轻，尺寸和印刷调整比较灵活。",
        image: "./assets/product-mailer-bags-real.png?v=20260621-3",
        bestFor: ["DTC 电商品牌", "服装品牌", "配饰产品", "订阅制发货"],
        commonOptions: ["自粘封口", "双胶条", "再生 PE", "可降解材料", "气泡内衬"],
        sourcingNotes: "这是很常见的询盘分类，因为尺寸、材料和印刷可以根据不同数量快速调整。",
      },
      {
        slug: "food-coffee-packaging-bags",
        formValue: "Food & Coffee Packaging Bags",
        name: "食品和咖啡包装袋",
        shortName: "食品咖啡袋",
        subtitle: "咖啡袋、茶叶袋、宠物食品袋、食品自立袋和八边封袋。",
        description:
          "适合干货和特色食品的软包装，可根据需要选择拉链、气阀、开窗和阻隔材料等常见配置。",
        image: "./assets/product-food-coffee-bags-real.png?v=20260621-3",
        bestFor: ["咖啡烘焙品牌", "茶叶品牌", "宠物食品品牌", "零食品牌"],
        commonOptions: ["八边封袋", "自立袋", "拉链封口", "单向排气阀", "透明开窗", "铝箔阻隔材料"],
        sourcingNotes: "适合需要先看样品再做大货的品牌，因为材料手感、封口效果和印刷颜色都很重要。",
      },
      {
        slug: "custom-stand-up-pouches",
        formValue: "Custom Stand-Up Pouches",
        name: "定制自立袋",
        shortName: "自立袋",
        subtitle: "适合美妆、香薰、补充装、配件和小产品的通用软包装。",
        description:
          "一种应用范围很广的袋型，适合非食品和干燥类产品，能做出干净的零售展示效果，同时支持比较灵活的订购数量。",
        image: "./assets/product-stand-up-pouches-real.png?v=20260621-3",
        bestFor: ["美妆补充装", "香薰产品", "营养补充品", "小配件"],
        commonOptions: ["哑面效果", "亮面效果", "挂孔", "易撕口", "拉链", "定制尺寸"],
        sourcingNotes: "这个分类适合作为第一版主推，因为一个页面可以覆盖很多成长型品牌的常见使用场景。",
      },
      {
        slug: "custom-packaging-boxes",
        formValue: "Custom Packaging Boxes",
        name: "定制包装盒",
        shortName: "包装盒",
        subtitle: "飞机盒、折叠彩盒、礼品盒和保护内托。",
        description:
          "适合电商、美妆、电子配件、礼品套装和新能源配件等需要更有结构感和保护性的产品包装。",
        image: "./assets/product-packaging-boxes-real.png?v=20260621-3",
        bestFor: ["电子配件", "美妆产品", "礼品套装", "新能源产品配件"],
        commonOptions: ["瓦楞飞机盒", "折叠彩盒", "硬盒", "纸内托", "泡棉内托", "局部 UV 或烫金"],
        sourcingNotes: "电子和新能源配件包装先放在这个分类下，特别适合需要内托和保护结构的产品。",
      },
      {
        slug: "brand-packaging-kit-accessories",
        formValue: "Brand Packaging Kit & Accessories",
        name: "品牌包装套装和配件",
        shortName: "品牌包装套装",
        subtitle: "贴纸、吊牌、卡片、包装纸、纸巾纸和整套品牌包装组合。",
        description:
          "适合中小品牌用较灵活的方式提升开箱体验，通过一组统一风格的包装配件和简单加项，让品牌感更完整。",
        image: "./assets/product-brand-kit-real.png?v=20260621-3",
        bestFor: ["新品发布", "达人礼盒", "服装品牌", "礼品组合"],
        commonOptions: ["感谢卡", "贴纸卷", "吊牌", "纸巾纸", "包装套筒", "组合包装套装"],
        sourcingNotes: "适合还不确定具体包装结构，但希望整体开箱体验更统一、更专业的海外品牌。",
      },
    ],
    serviceSteps: [
      {
        title: "告诉我们包装想法",
        text: "发送产品类型、尺寸、数量、材料偏好，以及已有的 Logo 或设计文件。",
      },
      {
        title: "比较可行方案",
        text: "我们帮助确认合适材料、印刷方式、起订量范围和样品选项，再让你决定下一步。",
      },
      {
        title: "打样和生产跟进",
        text: "确认后，我们协助跟进样品细节、生产进度和关键沟通事项。",
      },
      {
        title: "出货前检查",
        text: "发货前，我们可以协助要求供应商提供图片或视频，方便你远程查看可见细节。",
      },
    ],
    customerTypes: [
      "Shopify 和 DTC 电商品牌",
      "咖啡和茶叶品牌",
      "宠物食品品牌",
      "美妆和香薰品牌",
      "服装和配饰品牌",
      "电子和新能源配件品牌",
    ],
    trustPoints: [
      "支持中小品牌沟通灵活起订量",
      "支持定制印刷和大货前样品确认",
      "协助比较材料和供应商方案",
      "生产过程跟进，减少沟通断层",
      "支持出货前图片或视频检查",
      "来自中国的包装采购支持，沟通清晰、表达真实",
    ],
  },
};
