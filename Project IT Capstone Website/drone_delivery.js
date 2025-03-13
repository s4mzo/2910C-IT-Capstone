function loadDroneMap() {
    var deliveryMap = L.map('drone-map').setView([28.5, -81.4], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(deliveryMap);

    function getDistance(lat1, lon1, lat2, lon2) {
        function toRad(value) {
            return value * Math.PI / 180;
        }

        var R = 6371; // Earth's radius in km
        var dLat = toRad(lat2 - lat1);
        var dLon = toRad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    var stores = [
        { name: "Best Buy Orlando", coords: [28.5551492, -81.3284591] },
        { name: "Best Buy Ocoee", coords: [28.55328275, -81.5179287] },
        { name: "Best Buy Brandon", coords: [27.9521121, -82.3256155] }
    ];

    function findClosestStore(userLat, userLon) {
        let closestStore = null;
        let minDistance = Infinity;

        stores.forEach(store => {
            let distance = getDistance(userLat, userLon, store.coords[0], store.coords[1]);
            if (distance < minDistance) {
                minDistance = distance;
                closestStore = store;
            }
        });

        return closestStore;
    }

    document.getElementById("checkWeatherBtn").addEventListener("click", function () {
        let address = document.getElementById("delivery-address").value;
        if (!address) {
            alert("Please enter a valid delivery address.");
            return;
        }

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    alert("Address not found. Please try again.");
                    return;
                }

                let userLat = parseFloat(data[0].lat);
                let userLon = parseFloat(data[0].lon);

                let closestStore = findClosestStore(userLat, userLon);

                document.getElementById("closest-store-result").innerHTML =
                    `🚀 <b>${closestStore.name}</b> will be sending the drone with your package!`;

                // Define custom icons
                let droneIcon = L.icon({
                    iconUrl: 'drone_camera.png', // Local PNG for Best Buy store
                    iconSize: [50, 50], // Adjust size
                    iconAnchor: [25, 50]
                });

                let bluePinIcon = L.icon({
                    iconUrl: 'road_map.png', // Local PNG for delivery location
                    iconSize: [30, 30], // Adjust size
                    iconAnchor: [15, 30]
                });

                // Add marker for Best Buy store (Start Point)
                L.marker(closestStore.coords, { icon: droneIcon }).addTo(deliveryMap)
                    .bindPopup("<b>Best Buy Store</b><br>Sending your package.")
                    .openPopup();

                // Add marker for Delivery Location (End Point)
                L.marker([userLat, userLon], { icon: bluePinIcon }).addTo(deliveryMap)
                    .bindPopup("<b>Delivery Location</b><br>Package destination.");

                // Draw a **red dashed line** from the store to the delivery destination
                L.polyline([closestStore.coords, [userLat, userLon]], {
                    color: "red",
                    weight: 3,
                    opacity: 0.7,
                    dashArray: "10, 10"
                }).addTo(deliveryMap);

                // Adjust the map to fit the markers
                let bounds = L.latLngBounds([closestStore.coords, [userLat, userLon]]);
                deliveryMap.fitBounds(bounds);
            })
            .catch(error => {
                console.error("Error fetching address:", error);
                alert("Error retrieving address details.");
            });
    });
}
