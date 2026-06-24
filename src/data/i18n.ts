import type { Language } from "./catalog";

type NavItem = {
  label: string;
  path: string;
};

type PageHeroContent = {
  eyebrow: string;
  title: string;
  text: string;
};

export type { Language };

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
    productsPage: PageHeroContent & {
      categoryCountLabel: string;
      productCountLabel: string;
      viewCategory: string;
      allCategories: string;
      catalogTitle: string;
      quickFilterLabel: string;
      sidebarTitle: string;
      viewDetails: string;
      getQuote: string;
      notSureTitle: string;
      notSureText: string;
    };
    categoryPage: {
      eyebrow: string;
      allProducts: string;
      viewProduct: string;
    };
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
      applications: string;
      commonOptions: string;
      sourcingNote: string;
      galleryTitle: string;
      imagePending: string;
      relatedEyebrow: string;
      relatedTitle: string;
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
        text: "We help eCommerce, food, beauty, apparel and product brands source custom packaging with practical follow-up from sample to shipment.",
      },
      primaryCta: "Get a Quote",
      secondaryCta: "View Products",
      heroImageAlt: "Paper bags, mailer bags, pouches and boxes",
      productsEyebrow: "Product categories",
      productsTitle: "Packaging categories prepared for sourcing inquiries",
      productsText:
        "Explore practical packaging categories organized by main type and product structure.",
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
      text: "Choose a main category first, then review related product types, common applications and customization options.",
      categoryCountLabel: "main categories",
      productCountLabel: "product types",
      viewCategory: "View category",
      allCategories: "All",
      catalogTitle: "Product catalog",
      quickFilterLabel: "Quick filters",
      sidebarTitle: "Categories",
      viewDetails: "View details",
      getQuote: "Get quote",
      notSureTitle: "Not sure which packaging fits?",
      notSureText: "Send us your product details and reference style. We can help compare suitable packaging structures.",
    },
    categoryPage: {
      eyebrow: "Product category",
      allProducts: "All product types",
      viewProduct: "View product",
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
      eyebrow: "Product type",
      requestButton: "Request this Packaging",
      applications: "Applications",
      commonOptions: "Common options",
      sourcingNote: "Sourcing note",
      galleryTitle: "Product image gallery",
      imagePending: "Product reference",
      relatedEyebrow: "More in this category",
      relatedTitle: "Related product types",
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
        text: "我们帮助电商、食品、美妆、服装配饰和产品品牌，从中国采购定制包装，并协助从打样到出货前检查的沟通跟进。",
      },
      primaryCta: "获取报价",
      secondaryCta: "查看产品",
      heroImageAlt: "纸袋、快递袋、包装袋和包装盒示意图",
      productsEyebrow: "产品分类",
      productsTitle: "已按两级分类整理的包装产品",
      productsText: "按一级分类和具体产品结构展示常用包装，方便客户快速了解适合的方向。",
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
      text: "先选择一级分类，再查看对应二级产品、常见用途和可定制选项。",
      categoryCountLabel: "个一级分类",
      productCountLabel: "个二级产品",
      viewCategory: "查看分类",
      allCategories: "全部",
      catalogTitle: "产品目录",
      quickFilterLabel: "快速筛选",
      sidebarTitle: "产品分类",
      viewDetails: "查看详情",
      getQuote: "获取报价",
      notSureTitle: "不确定适合哪种包装？",
      notSureText: "把产品信息和参考风格发给我们，我们可以帮你比较更合适的包装结构。",
    },
    categoryPage: {
      eyebrow: "产品分类",
      allProducts: "全部二级产品",
      viewProduct: "查看产品",
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
      eyebrow: "产品类型",
      requestButton: "咨询这类包装",
      applications: "适合用途",
      commonOptions: "常见选项",
      sourcingNote: "采购说明",
      galleryTitle: "产品图片图库",
      imagePending: "产品参考图",
      relatedEyebrow: "同类产品",
      relatedTitle: "相关二级产品",
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
