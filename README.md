# wedding-api

## Email configuration

Emails are sent through the Brevo transactional email API. Set these environment
variables before starting the application:

- `BREVO_API_KEY`: Brevo API key with transactional email access.
- `EMAIL_FROM`: email address of a verified sender in Brevo.
- `EMAIL_FROM_NAME`: optional sender display name.
- `EMAIL_SEND`: address(es) that receive invitation notifications. Separate
  multiple addresses with commas (`a@example.com,b@example.com`).

Use `.env.example` as a template for local configuration. Do not commit `.env`
or other files containing credentials.
