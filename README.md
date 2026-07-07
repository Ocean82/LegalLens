# ⚖️ LegalLens — U.S. Legal Research Made Simple

![LegalLens Screenshot](legal-lens.png)

**LegalLens** is a free, open-source legal research platform that helps anyone search federal and state laws, scrape court cases from public sources, and build a personal research library — all in one place.

Legal information should be accessible to everyone. Whether you're a law student, paralegal, self-represented litigant, journalist, or just someone trying to understand your rights — LegalLens gives you the tools that used to cost hundreds per month.

---

## ✨ Features

- **🔍 Multi-Source Legal Search** — Scrapes and aggregates results from public legal databases (Google Scholar, CourtListener, Justia, Cornell LII)
- **🏛️ All 50 States + Federal** — Complete U.S. jurisdiction coverage
- **📚 Case Library** — Save, organize, and annotate search results into folders
- **📝 Research Notes** — Built-in note-taking system with jurisdiction and category tagging
- **🔐 User Accounts** — Secure authentication with personal research history
- **📊 Research Stats** — Track your research activity and saved cases
- **⚡ Demo Mode** — Try the full platform instantly without signing up

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via [Neon](https://neon.tech/) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Auth | JWT + bcrypt (custom, no vendor lock-in) |
| Scraping | [Cheerio](https://cheerio.js.org/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A PostgreSQL database (we recommend [Neon](https://neon.tech/) — free tier works great)

### Setup

```bash
# Clone the repo
git clone https://github.com/Ocean82/LegalLens.git
cd LegalLens

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL

# Push the database schema
npx drizzle-kit push

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **"Try Demo Account"** to explore with pre-loaded data.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
# PostgreSQL connection string (Neon, Supabase, or local)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# JWT secret for authentication (change this!)
JWT_SECRET=your-secret-key-here
```

---

## 🗺️ Roadmap

We have big plans. Here's where LegalLens is headed:

- [ ] **AI-powered case summarization** — Quick plain-English summaries of complex rulings
- [ ] **Citation graph** — Visualize how cases cite each other
- [ ] **Alerts & monitoring** — Get notified when new cases match your research areas
- [ ] **Collaborative workspaces** — Share research with colleagues or study groups
- [ ] **PDF export** — Generate formatted research briefs
- [ ] **Browser extension** — Save cases from any legal site directly to your library
- [ ] **API access** — Build your own tools on top of LegalLens data
- [ ] **Mobile app** — Research on the go
- [ ] **Multi-language support** — Make legal research accessible worldwide

---

## 🤝 Contributing

We welcome contributions of all kinds! This project exists to make legal research accessible — and we need help from developers, designers, legal professionals, and writers.

### How to Contribute

1. **Fork** the repository
2. **Create a branch** for your feature (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to your branch (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Areas Where We Need Help

| Area | Skills Needed |
|------|--------------|
| 🔍 Search quality | NLP, web scraping, data engineering |
| 🎨 UI/UX | React, Tailwind, accessibility, design |
| 📱 Mobile | React Native or PWA experience |
| 🧠 AI features | LLM integration, summarization, embeddings |
| 📖 Documentation | Technical writing, legal knowledge |
| 🧪 Testing | Jest, Playwright, QA |
| 🌐 i18n | Translation, internationalization |
| ♿ Accessibility | WCAG compliance, screen reader testing |
| 🔒 Security | Auth hardening, rate limiting, input sanitization |

### First-Time Contributors

Look for issues tagged [`good first issue`](../../issues?q=label%3A%22good+first+issue%22) — these are specifically scoped for newcomers.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 💖 Sponsorship

If LegalLens helps you or you believe in making legal information accessible, consider sponsoring the project:

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-pink?style=for-the-badge&logo=github-sponsors)](https://github.com/sponsors/Ocean82)

Sponsorship funds go directly toward:
- Server and database costs
- Adding AI-powered features (summarization, citation analysis)
- Expanding jurisdiction coverage
- Keeping the platform free for everyone

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

**TL;DR**: Use it however you want, commercially or otherwise. Just include the copyright notice and give credit.

---

## 🙏 Acknowledgments

Built with love for everyone who needs legal information but can't afford premium research tools.

Special thanks to the open data efforts at [CourtListener](https://www.courtlistener.com/), [Cornell LII](https://www.law.cornell.edu/), and [Justia](https://www.justia.com/) that make projects like this possible.

---

<p align="center">
  <strong>⭐ Star this repo if you believe legal research should be free and accessible ⭐</strong>
</p>
