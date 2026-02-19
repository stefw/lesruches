# Les Ruches

Blog photo mono-colonne. Les posts sont publiés depuis Telegram.

## Stack

- **Next.js** (App Router) déployé sur **Vercel**
- **Webhook Telegram** (`/api/telegram`) — reçoit photo + légende, commit dans le repo via l'API GitHub → Vercel rebuild automatiquement

## Flux

1. Tu envoies une photo au bot Telegram (avec légende optionnelle)
2. Le webhook reçoit la photo, la commit dans `public/photos/` et met à jour `public/posts.json`
3. Vercel détecte le commit et rebuild le site (~30s)

## Setup

### 1. Créer le bot Telegram
- [@BotFather](https://t.me/BotFather) → `/newbot` → copie le token

### 2. GitHub Personal Access Token
- GitHub → Settings → Developer settings → Personal access tokens → scope `repo`

### 3. Ton Chat ID Telegram
- Envoie un message à [@userinfobot](https://t.me/userinfobot)

### 4. Déployer sur Vercel
- Connecte le repo sur [vercel.com](https://vercel.com)
- Ajoute les variables d'environnement :

| Variable | Description |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Token du bot (via @BotFather) |
| `GITHUB_TOKEN` | Personal Access Token GitHub (scope `repo`) |
| `GITHUB_OWNER` | `stefw` |
| `GITHUB_REPO` | `lesruches` |
| `ALLOWED_CHAT_ID` | Ton chat ID Telegram (via @userinfobot) |

### 5. Enregistrer le webhook Telegram

Une fois le site déployé sur Vercel, enregistre le webhook (remplace l'URL par la tienne) :

```
https://api.telegram.org/bot<TON_TOKEN>/setWebhook?url=https://lesruch.es/api/telegram
```

## Dev local

```bash
npm install
npm run dev
```

