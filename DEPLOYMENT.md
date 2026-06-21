# GitHub Pages Deployment Guide

## What is already prepared

- GitHub Actions deployment file: `.github/workflows/deploy.yml`
- Custom domain file: `public/CNAME`
- Domain value: `xintutrade.com`
- Static build command: `npm run build`

## GitHub setup

1. Create a new GitHub repository, for example `xintu-packaging-website`.
2. Push this project to the repository's `main` branch.
3. Open the repository on GitHub.
4. Go to `Settings` -> `Pages`.
5. Set `Build and deployment` to `GitHub Actions`.
6. In `Custom domain`, enter:

```text
xintutrade.com
```

7. Wait for the GitHub Actions workflow to finish.
8. When HTTPS becomes available, enable `Enforce HTTPS`.

## Domain DNS records

At your domain provider, add these records for the root domain:

| Host | Type | Value |
| --- | --- | --- |
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |

Add this record for `www`:

| Host | Type | Value |
| --- | --- | --- |
| www | CNAME | your-github-username.github.io |

Replace `your-github-username` with your real GitHub username.

DNS changes can take minutes to 24 hours to fully take effect.

## Still required before real launch

- Replace `sales@xintutrade.com` if you want to use a different receiving email.
- Replace the placeholder WhatsApp number in `src/data/i18n.ts`.
- Configure `company.formEndpoint` after choosing a form service.
- Push the project to GitHub and confirm the Pages workflow is green.
- Check `https://xintutrade.com` and `https://www.xintutrade.com` on mobile after DNS is active.
