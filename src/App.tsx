import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { company, content, type Language } from "./data/i18n";
import {
  allProducts,
  findCategory,
  findProduct,
  label,
  productCategories,
  type ProductCategory,
  type ProductImage,
  type ProductItem,
} from "./data/catalog";

const normalizeRoute = (route: string) => {
  if (!route || route === "/") {
    return "/";
  }

  const withoutTrailingSlash = route.replace(/\/+$/, "");
  return withoutTrailingSlash.startsWith("/") ? withoutTrailingSlash : `/${withoutTrailingSlash}`;
};

const routeFromHash = () => {
  const raw = window.location.hash.replace(/^#/, "").split("?")[0];
  return normalizeRoute(raw || "/");
};

const toHash = (path: string) => `#${path}`;

const isProductCatalogRoute = (route: string) => /^\/products(?:\/[^/]+)?$/.test(route);

const scrollForRoute = (route: string) => {
  if (isProductCatalogRoute(route)) {
    window.setTimeout(() => {
      document.getElementById("product-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const quotePath = (product?: ProductItem) => {
  if (!product) {
    return toHash("/quote");
  }
  return `${toHash("/quote")}?product=${encodeURIComponent(product.slug)}`;
};

const getQuoteProductFromHash = () => {
  if (typeof window === "undefined") {
    return "";
  }
  const [, query = ""] = window.location.hash.split("?");
  const slug = new URLSearchParams(query).get("product");
  return allProducts.find((product) => product.slug === slug)?.formValue ?? "";
};

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") {
    return "en";
  }
  return window.localStorage.getItem("xintu-language") === "zh" ? "zh" : "en";
};

const pageUrl = (route: string) => `https://${company.domain}/${route === "/" ? "" : `#${route}`}`;

const setMeta = (name: string, value: string, property = false) => {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.head.querySelector<HTMLMetaElement>(selector);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(property ? "property" : "name", name);
    document.head.appendChild(meta);
  }

  meta.content = value;
};

const setCanonical = (url: string) => {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = url;
};

const setJsonLd = (data: unknown) => {
  const id = "route-jsonld";
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
};

const routeMeta = (
  route: string,
  language: Language,
  t: (typeof content)[Language],
  category?: ProductCategory,
  product?: ProductItem,
) => {
  const suffix = "Xintu Packaging Solutions";

  if (product) {
    return {
      title: `${label(product.name, language)} | ${suffix}`,
      description: label(product.description, language),
    };
  }

  if (category) {
    return {
      title: `${label(category.name, language)} | Custom Packaging Sourcing | ${suffix}`,
      description: label(category.summary, language),
    };
  }

  if (route === "/products") {
    return {
      title: `${t.productsPage.title} | ${suffix}`,
      description: t.productsPage.text,
    };
  }

  if (route === "/about") {
    return {
      title: `${t.aboutPage.title} | ${suffix}`,
      description: t.aboutPage.text,
    };
  }

  if (route === "/quote") {
    return {
      title: `${t.quotePage.title} | ${suffix}`,
      description: t.quotePage.text,
    };
  }

  return {
    title: `${t.home.hero.title} | ${suffix}`,
    description: t.home.hero.text,
  };
};

function App() {
  const [route, setRoute] = useState(routeFromHash());
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const mainRef = useRef<HTMLElement>(null);
  const t = content[language];
  const routeParts = useMemo(() => route.split("/").filter(Boolean), [route]);
  const activeCategory = routeParts[0] === "products" && routeParts[1] ? findCategory(routeParts[1]) : undefined;
  const activeProduct =
    routeParts[0] === "products" && routeParts[1] && routeParts[2]
      ? findProduct(routeParts[1], routeParts[2])
      : undefined;
  const isKnownRoute =
    route === "/" ||
    route === "/products" ||
    route === "/about" ||
    route === "/quote" ||
    (routeParts[0] === "products" && routeParts.length === 2 && Boolean(activeCategory)) ||
    (routeParts[0] === "products" && routeParts.length === 3 && Boolean(activeProduct));

  useEffect(() => {
    const onHashChange = () => {
      const nextRoute = routeFromHash();
      setRoute(nextRoute);
      setMenuOpen(false);
      scrollForRoute(nextRoute);
    };

    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/");
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang = t.locale;
    window.localStorage.setItem("xintu-language", language);
  }, [language, t.locale]);

  useEffect(() => {
    const meta = routeMeta(route, language, t, activeCategory, activeProduct);
    const url = pageUrl(route);

    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("og:title", meta.title, true);
    setMeta("og:description", meta.description, true);
    setMeta("og:url", url, true);
    setMeta("og:type", activeProduct ? "product" : "website", true);
    setMeta("twitter:card", "summary_large_image");
    setCanonical(url);
    setJsonLd([
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: company.brandName,
        legalName: company.legalNameEn,
        url: `https://${company.domain}/`,
        email: company.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: company.locationEn,
          addressCountry: "CN",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `https://${company.domain}/`,
          },
          ...(route === "/"
            ? []
            : [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: activeProduct
                    ? label(activeProduct.name, language)
                    : activeCategory
                      ? label(activeCategory.name, language)
                      : meta.title.replace(` | ${company.brandName}`, ""),
                  item: url,
                },
              ]),
        ],
      },
    ]);
  }, [activeCategory, activeProduct, language, route, t]);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [route]);

  return (
    <div>
      <a className="skip-link" href="#main-content">
        {t.skipLink}
      </a>
      <Header
        route={route}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        {route === "/" && <HomePage t={t} language={language} />}
        {route === "/products" && <ProductsPage t={t} language={language} />}
        {route === "/about" && <AboutPage t={t} />}
        {route === "/quote" && <QuotePage t={t} language={language} />}
        {routeParts[0] === "products" && routeParts.length === 2 && activeCategory && (
          <ProductsPage selectedCategory={activeCategory} t={t} language={language} />
        )}
        {routeParts[0] === "products" && routeParts.length === 3 && activeProduct && (
          <ProductPage product={activeProduct} category={activeCategory} t={t} language={language} />
        )}
        {!isKnownRoute && <NotFoundPage t={t} />}
      </main>
      <Footer t={t} language={language} />
    </div>
  );
}

function Header({
  route,
  menuOpen,
  setMenuOpen,
  language,
  setLanguage,
  t,
}: {
  route: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: (typeof content)[Language];
}) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const currentLanguageLabel = language === "en" ? "English" : "中文";
  const isActiveNav = (path: string) => route === path || (path === "/products" && route.startsWith("/products/"));

  const chooseLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setLanguageOpen(false);
  };

  return (
    <header className="site-header">
      <a className="brand" href={toHash("/")}>
        <img src="./logo.svg" alt="Xintu Packaging Solutions" />
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
        {t.nav.map((item) => (
          <a key={item.path} className={isActiveNav(item.path) ? "active" : ""} href={toHash(item.path)}>
            {item.label}
          </a>
        ))}
        <div className={languageOpen ? "language-menu open" : "language-menu"}>
          <button
            className="language-trigger"
            type="button"
            aria-label={t.language.label}
            aria-expanded={languageOpen}
            onClick={() => setLanguageOpen(!languageOpen)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9" />
              <path d="M12 3c-2.5 2.6-3.8 5.6-3.8 9s1.3 6.4 3.8 9" />
            </svg>
            <span>{currentLanguageLabel}</span>
            <span className="chevron" aria-hidden="true" />
          </button>
          <div className="language-options">
            <button
              className={language === "en" ? "selected" : ""}
              type="button"
              onClick={() => chooseLanguage("en")}
            >
              <span>English</span>
              <small>EN</small>
            </button>
            <button
              className={language === "zh" ? "selected" : ""}
              type="button"
              onClick={() => chooseLanguage("zh")}
            >
              <span>中文</span>
              <small>CN</small>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

function HomePage({ t, language }: { t: (typeof content)[Language]; language: Language }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{t.home.hero.eyebrow}</p>
          <h1>{t.home.hero.title}</h1>
          <p className="hero-text">{t.home.hero.text}</p>
          <div className="hero-actions">
            <a className="button primary" href={toHash("/quote")}>
              {t.home.primaryCta}
            </a>
            <a className="button secondary" href={toHash("/products")}>
              {t.home.secondaryCta}
            </a>
          </div>
          <div className="hero-badges" aria-label={t.home.badgeLabel}>
            {t.home.heroBadges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>
        <div className="hero-media">
          <img
            src="./assets/hero-product-showcase.webp?v=20260625-calm"
            alt={t.home.heroImageAlt}
            width="2000"
            height="1127"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">{t.home.productsEyebrow}</p>
          <h2>{t.home.productsTitle}</h2>
          <p>{t.home.productsText}</p>
        </div>
        <CategoryGrid t={t} language={language} />
      </section>

      <section className="section soft">
        <div className="two-column">
          <div>
            <p className="eyebrow">{t.home.whyEyebrow}</p>
            <h2>{t.home.whyTitle}</h2>
            <p>{t.home.whyText}</p>
          </div>
          <div className="trust-list">
            {t.trustPoints.map((point) => (
              <div className="trust-item" key={point}>
                <span aria-hidden="true">✓</span>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">{t.home.stepsEyebrow}</p>
          <h2>{t.home.stepsTitle}</h2>
        </div>
        <div className="steps">
          {t.serviceSteps.map((step, index) => (
            <article className="step" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section customers">
        <div className="section-heading">
          <p className="eyebrow">{t.home.customersEyebrow}</p>
          <h2>{t.home.customersTitle}</h2>
        </div>
        <div className="customer-tags">
          {t.customerTypes.map((type) => (
            <span key={type}>{type}</span>
          ))}
        </div>
      </section>

      <CallToAction t={t} />
    </>
  );
}

function ProductsPage({
  t,
  language,
  selectedCategory,
}: {
  t: (typeof content)[Language];
  language: Language;
  selectedCategory?: ProductCategory;
}) {
  return (
    <>
      <PageHero eyebrow={t.productsPage.eyebrow} title={t.productsPage.title} text={t.productsPage.text} />
      <section className="section" id="product-catalog">
        <ProductCatalog selectedCategory={selectedCategory} t={t} language={language} />
      </section>
      <CallToAction t={t} />
    </>
  );
}

function CategoryPage({
  category,
  t,
  language,
}: {
  category: ProductCategory;
  t: (typeof content)[Language];
  language: Language;
}) {
  return (
    <>
      <section className="page-hero">
        <Breadcrumb
          items={[
            { label: t.nav[1].label, path: "/products" },
            { label: label(category.name, language) },
          ]}
        />
        <p className="eyebrow">{t.categoryPage.eyebrow}</p>
        <h1>{label(category.name, language)}</h1>
        <p>{label(category.summary, language)}</p>
      </section>
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">{t.productsPage.productCountLabel}</p>
          <h2>{t.categoryPage.allProducts}</h2>
        </div>
        <ProductGrid
          products={category.items}
          language={language}
          viewLabel={t.productsPage.viewDetails}
          quoteLabel={t.productsPage.getQuote}
        />
      </section>
      <CallToAction t={t} />
    </>
  );
}

function ProductPage({
  product,
  category,
  t,
  language,
}: {
  product: ProductItem;
  category?: ProductCategory;
  t: (typeof content)[Language];
  language: Language;
}) {
  const [selectedImage, setSelectedImage] = useState(product.heroImage);

  useEffect(() => {
    setSelectedImage(product.heroImage);
  }, [product]);

  return (
    <>
      <section className="product-hero">
        <div className="product-hero-copy">
          <Breadcrumb
            items={[
              { label: t.nav[1].label, path: "/products" },
              ...(category ? [{ label: label(category.name, language), path: `/products/${category.slug}` }] : []),
              { label: label(product.name, language) },
            ]}
          />
          <p className="eyebrow">{t.productDetail.eyebrow}</p>
          <h1>{label(product.name, language)}</h1>
          <p>{label(product.description, language)}</p>
          <a className="button primary" href={quotePath(product)}>
            {t.productDetail.requestButton}
          </a>
        </div>
        <ProductImageTile
          product={product}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          language={language}
        />
      </section>
      <section className="section">
        <div className="detail-grid">
          <article>
            <h2>{t.productDetail.applications}</h2>
            <ul>
              {product.applications.map((item) => (
                <li key={label(item, language)}>{label(item, language)}</li>
              ))}
            </ul>
          </article>
          <article>
            <h2>{t.productDetail.commonOptions}</h2>
            <ul>
              {product.commonOptions.map((item) => (
                <li key={label(item, language)}>{label(item, language)}</li>
              ))}
            </ul>
          </article>
          <article>
            <h2>{t.productDetail.sourcingNote}</h2>
            <p>{label(product.sourcingNotes, language)}</p>
          </article>
        </div>
      </section>
      <ProductGallery product={product} t={t} language={language} />
      {category && <RelatedProducts category={category} currentSlug={product.slug} t={t} language={language} />}
      <CallToAction t={t} />
    </>
  );
}

function ProductGallery({
  product,
  t,
  language,
}: {
  product: ProductItem;
  t: (typeof content)[Language];
  language: Language;
}) {
  return (
    <section className="section soft">
      <div className="section-heading">
        <p className="eyebrow">{label(product.name, language)}</p>
        <h2>{t.productDetail.galleryTitle}</h2>
      </div>
      <div className="gallery-grid">
        {product.galleryImages.map((image) => (
          <figure className="gallery-card" key={`${product.slug}-${image.src}`}>
            <ResponsiveProductImage
              image={image}
              alt={label(image.alt, language)}
              sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 900px) 45vw, 30vw"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

function ProductImageTile({
  product,
  selectedImage,
  setSelectedImage,
  language,
}: {
  product: ProductItem;
  selectedImage: ProductImage;
  setSelectedImage: (image: ProductImage) => void;
  language: Language;
}) {
  return (
    <div className="product-media">
      <div className="product-image-tile">
        <ResponsiveProductImage
          image={selectedImage}
          alt={label(selectedImage.alt, language)}
          sizes="(max-width: 900px) calc(100vw - 40px), 46vw"
          priority
        />
      </div>
      {product.galleryImages.length > 1 && (
        <div className="thumbnail-row" aria-label={label(product.name, language)}>
          {product.galleryImages.map((image, index) => (
            <button
              className={image.src === selectedImage.src ? "selected" : ""}
              key={`${product.slug}-thumb-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              aria-label={label(image.alt, language)}
              aria-pressed={image.src === selectedImage.src}
            >
              <ResponsiveProductImage
                image={image}
                alt=""
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AboutPage({ t }: { t: (typeof content)[Language] }) {
  return (
    <>
      <PageHero eyebrow={t.aboutPage.eyebrow} title={t.aboutPage.title} text={t.aboutPage.text} />
      <section className="section about-content">
        <div>
          <h2>{t.aboutPage.introTitle}</h2>
          {t.companyIntro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="company-card">
          <h3>{t.aboutPage.companyDetailsTitle}</h3>
          <dl>
            {t.aboutPage.companyDetails.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>
      <section className="section soft">
        <div className="section-heading">
          <p className="eyebrow">{t.aboutPage.roleEyebrow}</p>
          <h2>{t.aboutPage.roleTitle}</h2>
        </div>
        <div className="steps">
          {t.serviceSteps.map((step) => (
            <article className="step compact" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function QuotePage({ t, language }: { t: (typeof content)[Language]; language: Language }) {
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"neutral" | "success" | "error">("neutral");
  const [submitting, setSubmitting] = useState(false);
  const selectedProductValue = useMemo(getQuoteProductFromHash, []);

  useEffect(() => {
    setStatus("");
  }, [t]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    setStatus(t.quotePage.status.sending);
    setStatusType("neutral");
    setSubmitting(true);
    const form = event.currentTarget;
    const endpoint = company.formEndpoint || `https://formsubmit.co/ajax/${company.email}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: new FormData(form),
      });

      if (!response.ok) {
        throw new Error(`Inquiry failed with ${response.status}`);
      }

      form.reset();
      setStatus(t.quotePage.status.success);
      setStatusType("success");
    } catch {
      setStatus(t.quotePage.status.error);
      setStatusType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero eyebrow={t.quotePage.eyebrow} title={t.quotePage.title} text={t.quotePage.text} />
      <section className="section quote-layout">
        <form className="quote-form" onSubmit={handleSubmit} aria-busy={submitting}>
          <input type="hidden" name="_subject" value="New inquiry from xintutrade.com" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <label className="honeypot" aria-hidden="true">
            Company website
            <input name="_honey" tabIndex={-1} autoComplete="off" />
          </label>
          <label>
            {t.quotePage.fields.name}
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            {t.quotePage.fields.email}
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            {t.quotePage.fields.company}
            <input name="company" autoComplete="organization" />
          </label>
          <label>
            {t.quotePage.fields.country}
            <input name="country" required autoComplete="country-name" />
          </label>
          <label>
            {t.quotePage.fields.productType}
            <select name="productType" required defaultValue={selectedProductValue}>
              <option value="" disabled>
                {t.quotePage.fields.productTypePlaceholder}
              </option>
              {productCategories.map((category) => (
                <optgroup key={category.slug} label={label(category.name, language)}>
                  {category.items.map((product) => (
                    <option key={`${category.slug}-${product.slug}`} value={product.formValue}>
                      {label(product.name, language)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label>
            {t.quotePage.fields.size}
            <input name="size" placeholder={t.quotePage.fields.sizePlaceholder} />
          </label>
          <label>
            {t.quotePage.fields.material}
            <input name="material" placeholder={t.quotePage.fields.materialPlaceholder} />
          </label>
          <label>
            {t.quotePage.fields.printingRequirement}
            <input name="printingRequirement" placeholder={t.quotePage.fields.printingPlaceholder} />
          </label>
          <label>
            {t.quotePage.fields.quantity}
            <input name="quantity" required placeholder={t.quotePage.fields.quantityPlaceholder} />
          </label>
          <label>
            {t.quotePage.fields.targetPrice}
            <input name="targetPrice" placeholder={t.quotePage.fields.targetPricePlaceholder} />
          </label>
          <label>
            {t.quotePage.fields.needSample}
            <select name="needSample" defaultValue="Not sure">
              <option value="Yes">{t.quotePage.fields.sampleYes}</option>
              <option value="No">{t.quotePage.fields.sampleNo}</option>
              <option value="Not sure">{t.quotePage.fields.sampleNotSure}</option>
            </select>
          </label>
          <label>
            {t.quotePage.fields.upload}
            <input
              name="designFile"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.ai,.eps,.svg,.zip"
              aria-describedby="file-help"
            />
            <small id="file-help">{t.quotePage.fields.uploadHelp}</small>
          </label>
          <label className="full">
            {t.quotePage.fields.message}
            <textarea name="message" rows={6} placeholder={t.quotePage.fields.messagePlaceholder} />
          </label>
          <p className="quote-privacy full">{t.quotePage.privacyNote}</p>
          <button className="button primary full" type="submit" disabled={submitting}>
            {submitting ? t.quotePage.fields.submitting : t.quotePage.fields.submit}
          </button>
          {status && (
            <p className={`form-status ${statusType}`} role="status" aria-live="polite">
              {status}
            </p>
          )}
        </form>
        <aside className="quote-side">
          <h2>{t.quotePage.detailsTitle}</h2>
          <ul>
            {t.quotePage.helpfulDetails.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <div className="contact-box">
            <p>{t.quotePage.emailLabel}</p>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </div>
        </aside>
      </section>
    </>
  );
}

function CategoryGrid({
  t,
  language,
  large = false,
}: {
  t: (typeof content)[Language];
  language: Language;
  large?: boolean;
}) {
  const totalProducts = allProducts.length;

  return (
    <div className={large ? "category-grid large" : "category-grid"}>
      {productCategories.map((category) => (
        (() => {
          const image = (category.items.find((item) => !item.heroImage.pending) ?? category.items[0])?.heroImage;

          return (
            <a className="category-card" href={toHash(`/products/${category.slug}`)} key={category.slug}>
              <ResponsiveProductImage
                image={image}
                alt={label(category.name, language)}
                sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 900px) 45vw, 30vw"
              />
              <div>
                <div className="category-meta">
                  <span>
                    {category.items.length} {t.productsPage.productCountLabel}
                  </span>
                </div>
                <h3>{label(category.name, language)}</h3>
                <p>{label(category.summary, language)}</p>
                <strong>{t.productsPage.viewCategory}</strong>
              </div>
            </a>
          );
        })()
      ))}
      <div className="category-summary">
        <span>{productCategories.length}</span>
        <p>{t.productsPage.categoryCountLabel}</p>
        <span>{totalProducts}</span>
        <p>{t.productsPage.productCountLabel}</p>
      </div>
    </div>
  );
}

function ProductCatalog({
  selectedCategory,
  t,
  language,
}: {
  selectedCategory?: ProductCategory;
  t: (typeof content)[Language];
  language: Language;
}) {
  const visibleProducts = selectedCategory ? selectedCategory.items : allProducts;
  const activeLabel = selectedCategory ? label(selectedCategory.name, language) : t.productsPage.allCategories;

  return (
    <div className="catalog-shell">
      <div className="catalog-mobile-filter">
        <p>{t.productsPage.quickFilterLabel}</p>
        <div>
          <a className={!selectedCategory ? "active" : ""} href={toHash("/products")}>
            {t.productsPage.allCategories}
          </a>
          {productCategories.map((category) => (
            <a
              className={selectedCategory?.slug === category.slug ? "active" : ""}
              href={toHash(`/products/${category.slug}`)}
              key={category.slug}
            >
              {label(category.name, language)}
            </a>
          ))}
        </div>
      </div>

      <aside className="catalog-sidebar">
        <h2>{t.productsPage.sidebarTitle}</h2>
        <a className={!selectedCategory ? "active" : ""} href={toHash("/products")}>
          <span>{t.productsPage.allCategories}</span>
          <small>{allProducts.length}</small>
        </a>
        {productCategories.map((category) => (
          <a
            className={selectedCategory?.slug === category.slug ? "active" : ""}
            href={toHash(`/products/${category.slug}`)}
            key={category.slug}
          >
            <span>{label(category.name, language)}</span>
            <small>{category.items.length}</small>
          </a>
        ))}
        <div className="catalog-help">
          <h3>{t.productsPage.notSureTitle}</h3>
          <p>{t.productsPage.notSureText}</p>
          <a className="button primary" href={quotePath()}>
            {t.productsPage.getQuote}
          </a>
        </div>
      </aside>

      <div className="catalog-content">
        <div className="catalog-toolbar">
          <div>
            <p className="eyebrow">{t.productsPage.catalogTitle}</p>
            <h2>{activeLabel}</h2>
          </div>
          <span>
            {visibleProducts.length} {t.productsPage.productCountLabel}
          </span>
        </div>
        <ProductGrid
          products={visibleProducts}
          language={language}
          viewLabel={t.productsPage.viewDetails}
          quoteLabel={t.productsPage.getQuote}
        />
      </div>
    </div>
  );
}

function ProductGrid({
  products,
  language,
  viewLabel,
  quoteLabel,
}: {
  products: ProductItem[];
  language: Language;
  viewLabel: string;
  quoteLabel: string;
}) {
  return (
    <div className="product-grid catalog-products">
      {products.map((product) => (
        <article
          className="product-card"
          key={`${product.parentSlug}-${product.slug}`}
        >
          <a className="product-card-media" href={toHash(`/products/${product.parentSlug}/${product.slug}`)}>
            <ResponsiveProductImage
              image={product.heroImage}
              alt={label(product.name, language)}
              sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 900px) 45vw, 30vw"
            />
          </a>
          <div>
            <h3>{label(product.name, language)}</h3>
            <p>{label(product.subtitle, language)}</p>
            <div className="product-card-actions">
              <a className="button secondary" href={toHash(`/products/${product.parentSlug}/${product.slug}`)}>
                {viewLabel}
              </a>
              <a className="button primary" href={quotePath(product)}>
                {quoteLabel}
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ResponsiveProductImage({
  image,
  alt,
  sizes,
  priority = false,
}: {
  image?: ProductImage;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!image) {
    return null;
  }

  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

function RelatedProducts({
  category,
  currentSlug,
  t,
  language,
}: {
  category: ProductCategory;
  currentSlug: string;
  t: (typeof content)[Language];
  language: Language;
}) {
  const related = category.items.filter((product) => product.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="section soft">
      <div className="section-heading">
        <p className="eyebrow">{t.productDetail.relatedEyebrow}</p>
        <h2>{t.productDetail.relatedTitle}</h2>
      </div>
      <ProductGrid
        products={related}
        language={language}
        viewLabel={t.productsPage.viewDetails}
        quoteLabel={t.productsPage.getQuote}
      />
    </section>
  );
}

function Breadcrumb({ items }: { items: Array<{ label: string; path?: string }> }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.path ? <a href={toHash(item.path)}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="page-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function CallToAction({ t }: { t: (typeof content)[Language] }) {
  return (
    <section className="cta">
      <div>
        <p className="eyebrow">{t.cta.eyebrow}</p>
        <h2>{t.cta.title}</h2>
        <p>{t.cta.text}</p>
      </div>
      <a className="button primary" href={toHash("/quote")}>
        {t.cta.button}
      </a>
    </section>
  );
}

function NotFoundPage({ t }: { t: (typeof content)[Language] }) {
  return <PageHero eyebrow={t.notFound.eyebrow} title={t.notFound.title} text={t.notFound.text} />;
}

function Footer({ t, language }: { t: (typeof content)[Language]; language: Language }) {
  return (
    <footer className="footer">
      <div>
        <img src="./logo.svg" alt="Xintu Packaging Solutions" />
        <p>{t.footer.description}</p>
      </div>
      <div>
        <h3>{t.footer.productsTitle}</h3>
        {productCategories.slice(0, 5).map((category) => (
          <a key={category.slug} href={toHash(`/products/${category.slug}`)}>
            {label(category.name, language)}
          </a>
        ))}
      </div>
      <div>
        <h3>{t.footer.contactTitle}</h3>
        <a href={`mailto:${company.email}`}>{company.email}</a>
        <span>{company.domain}</span>
        <span>{language === "zh" ? company.locationZh : company.locationEn}</span>
      </div>
    </footer>
  );
}

export default App;
