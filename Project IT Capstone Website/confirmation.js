document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("confirm-btn").addEventListener("click", function () {
        let enteredCode = document.getElementById("confirmation-code").value;
        let confirmationMessage = document.getElementById("confirmation-message");
        let weatherCheckSection = document.getElementById("weather-check");
        let closestStoreSection = document.getElementById("closest-store");
        let droneDeliverySection = document.getElementById("drone-delivery");

        if (enteredCode === "PaidForDelivery2025") {
            confirmationMessage.innerHTML = "✅ Confirmation successful! You can now enter your address for drone delivery.";
            confirmationMessage.style.color = "green";

            // Show "Enter Delivery Address & Check Weather" first
            weatherCheckSection.style.display = "block";
            weatherCheckSection.style.visibility = "visible";
            weatherCheckSection.style.height = "auto";
            weatherCheckSection.style.overflow = "visible";

            // Show "Closest Best Buy Store" right after
            closestStoreSection.style.display = "block";
            closestStoreSection.style.visibility = "visible";
            closestStoreSection.style.height = "auto";
            closestStoreSection.style.overflow = "visible";

            // Show the Drone Delivery Map last
            droneDeliverySection.style.display = "block";
            droneDeliverySection.style.visibility = "visible";
            droneDeliverySection.style.height = "auto";
            droneDeliverySection.style.overflow = "visible";

            // ✅ Ensure the map loads after the section is visible
            setTimeout(() => {
                loadDroneMap();
            }, 500);
        } else {
            confirmationMessage.innerHTML = "❌ Incorrect code. Please try again.";
            confirmationMessage.style.color = "red";

            // Keep all sections hidden if the code is wrong
            weatherCheckSection.style.display = "none";
            weatherCheckSection.style.visibility = "hidden";
            weatherCheckSection.style.height = "0";
            weatherCheckSection.style.overflow = "hidden";

            closestStoreSection.style.display = "none";
            closestStoreSection.style.visibility = "hidden";
            closestStoreSection.style.height = "0";
            closestStoreSection.style.overflow = "hidden";

            droneDeliverySection.style.display = "none";
            droneDeliverySection.style.visibility = "hidden";
            droneDeliverySection.style.height = "0";
            droneDeliverySection.style.overflow = "hidden";
        }
    });
});
