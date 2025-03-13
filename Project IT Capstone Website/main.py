import folium
import requests
from geopy.geocoders import Nominatim

# Initialize Geopy
geolocator = Nominatim(user_agent="best_buy_drone_delivery_app")

# Best Buy store data
store_data = {
    "Best Buy Orlando": {"address": "4601 E Colonial Dr, Orlando, FL 32803"},
    "Best Buy Ocoee": {"address": "9537 W Colonial Dr, Ocoee, FL 34761"},
    "Best Buy Brandon": {"address": "116 Grand Regency Blvd, Brandon, FL 33510"},
}

# Function to geocode an address
def geocode(address):
    location = geolocator.geocode(address)
    if location:
        return (location.latitude, location.longitude)
    return None

# Function to generate Best Buy store locations map
def generate_bestbuy_map():
    map_center = (28.5, -81.4)  # Roughly Central Florida
    store_map = folium.Map(location=map_center, zoom_start=8, tiles="OpenStreetMap")

    # Add store markers
    for store, info in store_data.items():
        coords = geocode(info["address"])
        if coords:
            folium.Marker(coords, popup=store, icon=folium.Icon(color="blue")).add_to(store_map)

    # Save store locations map
    store_map.save("bestbuy_stores_map.html")
    print("✅ Best Buy Store Map generated: 'bestbuy_stores_map.html'")

# Function to generate drone delivery route map
def generate_delivery_map(store_coords, user_coords, route):
    delivery_map = folium.Map(location=store_coords, zoom_start=12, tiles="OpenStreetMap")

    # Add store and destination markers
    folium.Marker(store_coords, popup="Best Buy (Starting Point)", icon=folium.Icon(color="blue")).add_to(delivery_map)
    folium.Marker(user_coords, popup="Delivery Destination", icon=folium.Icon(color="red")).add_to(delivery_map)

    # Add route to the map
    if route:
        folium.PolyLine(route, color="green", weight=5, opacity=0.8).add_to(delivery_map)
    
    # Save delivery map
    delivery_map.save("drone_delivery_simulation.html")
    print("✅ Delivery Map generated: 'drone_delivery_simulation.html'")

# Function to get a route using OSRM API
def get_route(start_coords, end_coords):
    base_url = "http://router.project-osrm.org/route/v1/driving/"
    coords = f"{start_coords[1]},{start_coords[0]};{end_coords[1]},{end_coords[0]}"
    url = f"{base_url}{coords}?overview=full&geometries=geojson"
    
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        route_coords = data["routes"][0]["geometry"]["coordinates"]
        return [(pt[1], pt[0]) for pt in route_coords]  # Convert [lon, lat] to (lat, lon)
    else:
        print("⛔ Error fetching route data.")
        return []

# Main Execution
def main():
    print("Welcome to Best Buy Drone Delivery!\n")

    # Generate Best Buy store map
    generate_bestbuy_map()

    # Ask for confirmation code
    confirmation = input("Enter your confirmation code to start delivery: ")
    if confirmation != "PaidForDelivery2025":
        print("❌ Invalid confirmation code. Exiting.")
        return

    # Ask for user's address
    user_address = input("\nEnter your full delivery address: ")
    user_coords = geocode(user_address)
    if not user_coords:
        print("⛔ Unable to locate your address.")
        return

    # Select the closest Best Buy store
    selected_store = None
    selected_store_coords = None
    for store, info in store_data.items():
        coords = geocode(info["address"])
        if coords:
            selected_store = store
            selected_store_coords = coords
            break  # First valid store found, use it

    if not selected_store_coords:
        print("⛔ No Best Buy stores found.")
        return

    print(f"✅ Delivery will start from {selected_store}.")

    # Get route from store to delivery location
    route_points = get_route(selected_store_coords, user_coords)

    # Generate delivery map
    generate_delivery_map(selected_store_coords, user_coords, route_points)

if __name__ == "__main__":
    main()
