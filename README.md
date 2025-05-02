
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/6582d26c-df07-49e0-8a98-9fed78735e07

## Environment Variables

The following environment variables are required for the application:

- `SUPABASE_URL`: The URL of your Supabase project
- `SUPABASE_ANON_KEY`: The public API key for your Supabase project
- `SUPABASE_SERVICE_KEY`: The service role API key for privileged operations (used by Edge Functions)
- `ETHEREUM_RPC_URL`: URL to Ethereum RPC provider (e.g., Infura, Alchemy)
- `CONTRACT_ADDRESS`: Ethereum address of the NFT contract
- `SORA_URL`: URL for the Sora AI API
- `SORA_API_KEY`: API key for the Sora AI service
- `ALLOWED_ORIGIN`: Comma-separated list of allowed origins for CORS (e.g., `http://localhost:3000,https://your-production-site.com`)

For development, you can set these in a `.env.local` file:
```
ALLOWED_ORIGIN=http://localhost:3000
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6582d26c-df07-49e0-8a98-9fed78735e07) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6582d26c-df07-49e0-8a98-9fed78735e07) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
