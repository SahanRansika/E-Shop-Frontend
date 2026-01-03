import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'https://9c22bc06bdb1.ngrok-free.app' // ඔයාට ලැබුණු Ngrok URL එක මෙතනට දාන්න
    ]
  }
})