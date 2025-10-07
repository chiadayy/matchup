import { setOptions } from "@googlemaps/js-api-loader";

let configured = false;

export function configureGoogle() {
  if (configured) return;
  setOptions({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["maps", "places", "marker"],
  });
  configured = true;
}
