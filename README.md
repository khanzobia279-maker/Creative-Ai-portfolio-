# Zobia Khan – Portfolio
React + Tailwind CSS + GSAP (ScrollTrigger, @gsap/react).

    npm install
    npm run dev

Edit your content in `src/data.js`. Theme colors live in `src/lib/useTheme.js`.

## Contact form to Gmail

1. Go to https://web3forms.com, enter `khanzobia279@gmail.com` and copy the access key they email you.
2. Copy `.env.example` to `.env` and set `VITE_WEB3FORMS_KEY=` to that key. On Vercel or Netlify, add it under Environment Variables.
3. Rebuild or redeploy. Messages now arrive in your inbox, with the visitor's email set as the reply address.

Without a key the form opens a pre-filled Gmail compose window instead.
