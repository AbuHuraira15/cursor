# MiniMates Django Backend

## Features

- JWT auth (signup/login/refresh)
- Role-aware users (client, worker, admin)
- Task posting and browsing
- Bid placement and assignment
- Task conversations and messages
- Payment records with platform fee
- Django admin support for all entities

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Copy env file:
   - `copy .env.example .env` (Windows)
4. Run migrations:
   - `python manage.py makemigrations`
   - `python manage.py migrate`
5. Create admin:
   - `python manage.py createsuperuser`
6. Start server:
   - `python manage.py runserver`

## API base

- Base URL: `/api/`
- Health: `GET /api/health/`
- Auth:
  - `POST /api/auth/signup/`
  - `POST /api/auth/login/`
  - `POST /api/auth/refresh/`
  - `GET/PATCH /api/auth/me/`
- Marketplace:
  - `/api/tasks/`
  - `/api/bids/`
- Messaging:
  - `/api/conversations/`
  - `/api/messages/`
- Payments:
  - `/api/payments/`
