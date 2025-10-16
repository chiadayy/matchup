import { setOptions } from "@googlemaps/js-api-loader";

let configured = false;

export function configureGoogle() {
  if (configured) return;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  console.log("Configuring Google Maps with API key:", apiKey ? `${apiKey.substring(0, 10)}...` : "MISSING");
  setOptions({
    apiKey: apiKey,
    version: "weekly",
    libraries: ["maps", "places", "marker"],
  });
  configured = true;
}
