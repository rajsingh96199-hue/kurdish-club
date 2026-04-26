# Kurdish Social Club

Premium React website for the Kurdish Social Club lounge cafe.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

## EmailJS setup

Create a `.env` file with your EmailJS credentials:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

The checkout sends these template variables:

- `to_email`: `raj24cs@student.mes.ac.in`
- `customer_name`
- `phone`
- `email`
- `order_details`
- `total`

Use `to_email` as the recipient in the EmailJS template.