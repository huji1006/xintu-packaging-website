# Xintu Packaging Solutions Website

English / Chinese B2B inquiry website for Xintu Packaging Solutions.

## Local preview

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

## Build

```bash
npm run build
```

The production files are generated into `dist/`.

## Content editing

Most website text is in:

```text
src/data/i18n.ts
```

Update this file when editing English or Chinese copy, product categories, company details, or form labels.

## Inquiry form

The current form endpoint is empty:

```text
company.formEndpoint
```

After choosing a third-party form service, paste the form submission URL into that field.
