# Les Ruches

Blog photo mono-colonne. Les posts sont publiés depuis Telegram.

## Stack

- **Next.js** (App Router, statique)
- **Bot Telegram** (`bot/`) — reçoit photo + légende, commit dans le repo via l'API GitHub

## Setup du bot

```bash
cd bot
npm install
cp .env.example .env
# Remplir .env avec les tokens
node index.js
```

### Variables d'environnement (`bot/.env`)

| Variable | Description |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Token du bot (via @BotFather) |
| `GITHUB_TOKEN` | Personal Access Token GitHub (scope `repo`) |
| `GITHUB_OWNER` | `stefw` |
| `GITHUB_REPO` | `lesruches` |
| `ALLOWED_CHAT_ID` | Ton chat ID Telegram (via @userinfobot) |

## Poster une photo

Envoie une photo au bot Telegram avec une légende (optionnelle). Le bot commit automatiquement dans le repo et le site se met à jour.

## Dev

```bash
npm run dev
```

