# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## Location & Weather Setup

1. **Create `.env` file** with your API keys:
   - Copy `.env.example` to `.env`
   - Add your real Google Maps and OpenWeather API keys

2. **Google Maps API Configuration**:
   - Your Google API key must allow HTTP referrers:
     - `http://localhost:5173/*`
     - `http://127.0.0.1:5173/*`
   - Enable the following APIs in Google Cloud Console:
     - Maps JavaScript API
     - Places API
   - Ensure billing is enabled for the project

3. **Restart the dev server** after editing `.env` file to load new environment variables
