import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fileUploadPlugin from "./vite-file-upload-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8083,
    proxy: {
      // Proxy /api/users/count to backend on port 3013 (MUST be before general /api proxy)
      '/api/users/count': {
        target: 'http://localhost:3013',
        changeOrigin: true,
        secure: false,
      },
      // Proxy resume API requests to the backend server on port 8081
      '/api/resumes': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log('Proxying resume API request:', path);
          return path;
        }
      },
      // Proxy other API requests to the main backend on port 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Serve uploaded files from the backend server
      '/upload': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/list-uploads': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/direct-upload': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    fileUploadPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
