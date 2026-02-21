# Portfolio 2026

## Contact Form Routing
The contact form is connected through Formspree.

1. Create a Formspree form and copy your endpoint URL (`https://formspree.io/f/...`).
2. In the project root, create or update `.env`.
3. Add this line in `.env`:

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
```

4. Restart the dev server.

When a visitor submits the form, Formspree forwards the message to your configured email inbox.
