import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Try to load local certs in ./cert to enable HTTPS for camera access
  const certDir = path.resolve(__dirname, 'cert');
  let https = false;

  try {
    const keyPath = path.join(certDir, 'key.pem');
    const certPath = path.join(certDir, 'cert.pem');

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      https = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
      console.log('Vite: using local HTTPS certs from', certDir);
    }
  } catch (err) {
    // ignore — fall back to non-https
    console.warn('Vite: failed to load certs, falling back to HTTP', err?.message || err);
  }

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      https,
    },
  };
});
