import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: base must match your GitHub repo name exactly, wrapped in slashes.
// Your repo is yunghit/Biust-Maintenance-Log, so it's set below.
// If you ever rename the repo, update this to match.
export default defineConfig({
  plugins: [react()],
  base: '/Biust-Maintenance-Log/',
})
