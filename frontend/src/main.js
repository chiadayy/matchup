// console.log("GOOGLE len:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.length);
// console.log("OWM len:", import.meta.env.VITE_OPENWEATHER_API_KEY?.length);
// import { configureGoogle } from './googleMaps';
// configureGoogle();
// import { createApp } from 'vue'
// import App from './App.vue'
// import './style.css'
// import router from './router'
// createApp(App).use(router).mount('#app')


// 1) Imports first
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { configureGoogle } from './googleMaps'
import axios from "axios";

// 2) Quick sanity logs (should print numbers > 10)
console.log("GOOGLE len:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.length);
console.log("OWM len:", import.meta.env.VITE_OPENWEATHER_API_KEY?.length);

// 3) Configure Google (must run BEFORE any component calls importLibrary)
configureGoogle();

// 4) Mount app
createApp(App).use(router).mount('#app');

// async function init() {
//   await customElements.whenDefined('gmp-map');

//   const map = document.querySelector('gmp-map');
//   const marker = document.querySelector('gmp-advanced-marker');
//   const placePicker = document.querySelector('gmpx-place-picker');
//   const infowindow = new google.maps.InfoWindow();

//   map.innerMap.setOptions({
//     mapTypeControl: false
//   });

//   placePicker.addEventListener('gmpx-placechange', () => {
//     const place = placePicker.value;

//     if (!place.location) {
//       window.alert(
//         "No details available for input: '" + place.name + "'"
//       );
//       infowindow.close();
//       marker.position = null;
//       return;
//     }

//     if (place.viewport) {
//       map.innerMap.fitBounds(place.viewport);
//     } else {
//       map.center = place.location;
//       map.zoom = 17;
//     }

//     marker.position = place.location;
//     infowindow.setContent(
//       `<strong>${place.displayName}</strong><br>
//        <span>${place.formattedAddress}</span>
//     `);
//     infowindow.open(map.innerMap, marker);
//   });
// }

// document.addEventListener('DOMContentLoaded', init);