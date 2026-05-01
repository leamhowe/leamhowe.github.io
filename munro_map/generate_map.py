import pandas as pd
import leafmap.foliumap as leafmap

# 1. Define your files
input_csv = 'munros_clean.csv'
output_html = 'my_munros_map.html'

print("Loading your Munro data...")

# Load the data
try:
    df = pd.read_csv(input_csv)
except FileNotFoundError:
    print(f"Error: Could not find '{input_csv}'.")
    exit()

# 2. Assign colors based on your progress
# If Status is 'Completed', make it green. Otherwise, make it red.
def get_color(status):
    if str(status).strip().lower() == 'completed':
        return 'green'
    return 'red'

df['Color'] = df['Status'].apply(get_color)

# 3. Initialize the map
# Centered roughly on the Scottish Highlands with an appropriate zoom level
print("Building the map...")
m = leafmap.Map(center=[56.8, -4.2], zoom=7)


m.add_basemap("OpenTopoMap", name="OpenTopoMap")
m.add_basemap("Esri.WorldTopoMap", name="Esri Topo", show=False)
m.add_basemap("Esri.WorldImagery", name="Satellite", show=False)

# 4. Add the Munros to the map
# We loop through the data to add them so we can apply the custom colors perfectly
for index, row in df.iterrows():
    m.add_marker(
        location=[row['Latitude'], row['Longitude']],
        popup=(
            f"<b>{row['Name']}</b><br>"
            f"<b>Status:</b> {row['Status']}<br>"
            f"<b>Elevation:</b> {row['Elevation (m)']}m<br>"
            f"<b>Region:</b> {row['Region']}<br>"
            f"<b>County:</b> {row['County']}<br>"
            f"<b>Grid Ref:</b> {row['Grid ref']}"
        ),
        tooltip=row['Name'],
        icon=leafmap.folium.Icon(color=row['Color'], icon='info-sign')
    )

# 5. Save the map to an HTML file
m.to_html(output_html)

print(f"Success! Your interactive map has been saved as '{output_html}'.")

# --- NEW CODE: Calculate and save the running total ---
# Count how many Munros have the status 'Completed' (case-insensitive)
completed_count = len(df[df['Status'].str.lower() == 'completed'])

# Save it to Quarto's standard variables file
with open('../_variables.yml', 'w') as f:
    f.write(f"munro_count: {completed_count}\n")

print(f"Updated _variables.yml with {completed_count} completions.")