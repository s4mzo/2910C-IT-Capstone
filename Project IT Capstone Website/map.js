document.addEventListener("DOMContentLoaded", function () {
    // Initialize the first map for Best Buy store locations
    var storeMap = L.map('map').setView([28.5, -81.4], 8);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(storeMap);

    // Define custom drone icon
    var droneIcon = L.icon({
        iconUrl: 'drone_camera.png', // Local PNG for Best Buy store
        iconSize: [50, 50], // Adjust size
        iconAnchor: [25, 50]
    });

    // Best Buy store locations
    var stores = [
        { name: "Best Buy Orlando", coords: [28.5551492, -81.3284591] },
        { name: "Best Buy Ocoee", coords: [28.55328275, -81.5179287] },
        { name: "Best Buy Brandon", coords: [27.9521121, -82.3256155] }
    ];

    // Add store markers with drone icon
    stores.forEach(store => {
        L.marker(store.coords, { icon: droneIcon })
            .addTo(storeMap)
            .bindPopup(`<b>${store.name}</b>`);
    });
});
