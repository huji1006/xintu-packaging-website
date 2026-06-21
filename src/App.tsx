import { FormEvent, useEffect, useMemo, useState } from "react";
import { company, content, type Language, type Product } from "./data/i18n";

const routeFromHash = () => {
  const raw = window.location.hash.replace(/^#/, "");
  return raw || "/";
};

const toHash = (path: string) => `#${path}`;

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") {
    return "en";
  }
  return window.localStorage.getItem("xintu-language") === "zh" ? "zh" : "en";
};

function App() {
  const [route, setRoute] = useState(routeFromHash());
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const t = content[language];

  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash());
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const activeProduct = useMemo(() => {
    const slug = route.replace("/products/", "");
    return t.products.find((product) => product.slug === slug);
  }, [route, t.products]);

  return (
    <div>
      <Header
        route={route}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
      <main>
        {route === "/" && <HomePage t={t} />}
        {route === "/products" && <ProductsPage t={t} />}
        {route === "/about" && <AboutPage t={t} />}
        {route === "/quote" && <QuotePage t={t} />}
        {route.startsWith("/products/") && activeProduct && <ProductPage product={activeProduct} t={t} />}
        {route.startsWith("/products/") && !activeProduct && <NotFoundPage t={t} />}
      </main>
      <Footer t={t} />
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
          <a key={item.path} className={route === item.path ? "active" : ""} href={toHash(item.path)}>
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
          <div className="language-options" role="menu">
            <button
              className={language === "en" ? "selected" : ""}
              type="button"
              role="menuitem"
              onClick={() => chooseLanguage("en")}
            >
              <span>English</span>
              <small>EN</small>
            </button>
            <button
              className={language === "zh" ? "selected" : ""}
              type="button"
              role="menuitem"
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

function HomePage({ t }: { t: (typeof content)[Language] }) {
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
        </div>
        <div className="hero-visual" aria-label={t.home.heroImageAlt}>
          <img src="./assets/hero-packaging.svg" alt={t.home.heroImageAlt} />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">{t.home.productsEyebrow}</p>
          <h2>{t.home.productsTitle}</h2>
          <p>{t.home.productsText}</p>
        </div>
        <ProductGrid products={t.products} />
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

function ProductsPage({ t }: { t: (typeof content)[Language] }) {
  return (
    <>
      <PageHero eyebrow={t.productsPage.eyebrow} title={t.productsPage.title} text={t.productsPage.text} />
      <section className="section">
        <ProductGrid products={t.products} large />
      </section>
      <CallToAction t={t} />
    </>
  );
}

function ProductPage({ product, t }: { product: Product; t: (typeof content)[Language] }) {
  return (
    <>
      <section className="product-hero">
        <div className="product-hero-copy">
          <p className="eyebrow">{t.productDetail.eyebrow}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <a className="button primary" href={`${toHash("/quote")}?product=${product.slug}`}>
            {t.productDetail.requestButton}
          </a>
        </div>
        <img src={product.image} alt={product.name} />
      </section>
      <section className="section">
        <div className="detail-grid">
          <article>
            <h2>{t.productDetail.bestFor}</h2>
            <ul>
              {product.bestFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <h2>{t.productDetail.commonOptions}</h2>
            <ul>
              {product.commonOptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <h2>{t.productDetail.sourcingNote}</h2>
            <p>{product.sourcingNotes}</p>
          </article>
        </div>
      </section>
      <RelatedProducts currentSlug={product.slug} t={t} />
      <CallToAction t={t} />
    </>
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

function QuotePage({ t }: { t: (typeof content)[Language] }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    setStatus("");
  }, [t]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!company.formEndpoint) {
      event.preventDefault();
      setStatus(t.quotePage.status.noEndpoint);
      return;
    }

    event.preventDefault();
    setStatus(t.quotePage.status.sending);
    try {
      const response = await fetch(company.formEndpoint, {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      if (!response.ok) {
        throw new Error("Form service returned an error.");
      }
      event.currentTarget.reset();
      setStatus(t.quotePage.status.success);
    } catch {
      setStatus(t.quotePage.status.error);
    }
  };

  return (
    <>
      <PageHero eyebrow={t.quotePage.eyebrow} title={t.quotePage.title} text={t.quotePage.text} />
      <section className="section quote-layout">
        <form className="quote-form" onSubmit={handleSubmit}>
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
            <select name="productType" required defaultValue="">
              <option value="" disabled>
                {t.quotePage.fields.productTypePlaceholder}
              </option>
              {t.products.map((product) => (
                <option key={product.slug} value={product.formValue}>
                  {product.name}
                </option>
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
            <input name="designFile" type="file" />
          </label>
          <label className="full">
            {t.quotePage.fields.message}
            <textarea name="message" rows={6} placeholder={t.quotePage.fields.messagePlaceholder} />
          </label>
          <button className="button primary full" type="submit">
            {t.quotePage.fields.submit}
          </button>
          {status && <p className="form-status">{status}</p>}
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

function ProductGrid({ products, large = false }: { products: Product[]; large?: boolean }) {
  return (
    <div className={large ? "product-grid large" : "product-grid"}>
      {products.map((product) => (
        <a className="product-card" href={toHash(`/products/${product.slug}`)} key={product.slug}>
          <img src={product.image} alt={product.name} />
          <div>
            <h3>{product.name}</h3>
            <p>{product.subtitle}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

function RelatedProducts({ currentSlug, t }: { currentSlug: string; t: (typeof content)[Language] }) {
  const related = t.products.filter((product) => product.slug !== currentSlug).slice(0, 3);

  return (
    <section className="section soft">
      <div className="section-heading">
        <p className="eyebrow">{t.productDetail.moreEyebrow}</p>
        <h2>{t.productDetail.moreTitle}</h2>
      </div>
      <ProductGrid products={related} />
    </section>
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

function Footer({ t }: { t: (typeof content)[Language] }) {
  return (
    <footer className="footer">
      <div>
        <img src="./logo.svg" alt="Xintu Packaging Solutions" />
        <p>{t.footer.description}</p>
      </div>
      <div>
        <h3>{t.footer.productsTitle}</h3>
        {t.products.slice(0, 4).map((product) => (
          <a key={product.slug} href={toHash(`/products/${product.slug}`)}>
            {product.shortName}
          </a>
        ))}
      </div>
      <div>
        <h3>{t.footer.contactTitle}</h3>
        <a href={`mailto:${company.email}`}>{company.email}</a>
        <span>{company.domain}</span>
        <span>{company.locationEn}</span>
      </div>
    </footer>
  );
}

export default App;
