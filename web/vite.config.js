import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Sandbox-only networking tweaks. When BASE44_PREVIEW_MODE is unset (or any
// value other than "1") the dev server keeps its stock, localhost-only
// behaviour. See AGENTS.md.
const previewMode = process.env.BASE44_PREVIEW_MODE === '1'
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN
const publicHostSuffix = process.env.BASE44_PUBLIC_HOST_SUFFIX

function allowedHosts() {
  if (!previewMode) return []
  const hosts = []
  // The preview proxy forwards Host: <port>-<sandbox id>.<sandbox domain>,
  // and the sandbox id changes whenever the environment is recreated, so we
  // allow the whole sandbox domain rather than one exact host.
  if (sandboxHostDomain) hosts.push(`.${sandboxHostDomain}`)
  // Also accept the public host outright (it is a different site).
  if (publicHostSuffix) hosts.push(`3000-${publicHostSuffix}`)
  return hosts
}

// The API service, reached over the compose network in the sandbox and over
// localhost for a plain `npm run dev`. Proxying keeps the browser on a single
// origin, so no CORS setup is needed anywhere.
const apiTarget = process.env.API_PROXY_TARGET || 'http://localhost:8000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: allowedHosts(),
    // HMR reaches the browser through the HTTPS preview proxy.
    hmr: previewMode ? { protocol: 'wss', clientPort: 443 } : undefined,
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
    },
  },
})
