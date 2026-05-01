import pandas as pd
import os

# 1. Define your file names
input_file = '../data/DoBIH_v18_4.csv'
output_file = 'munros_clean.csv'

print("Loading Database of British and Irish Hills...")

try:
    # Load the CSV.
    df = pd.read_csv(input_file, encoding='ISO-8859-1', low_memory=False)
except FileNotFoundError:
    print(f"Error: Could not find '{input_file}'. Make sure it is in the same folder as this script.")
    exit()

# 2. Filter for Munros ('M' column = 1)
munros_df = df[df['M'] == 1].copy()

print(f"Found {len(munros_df)} Munros.")

# 3. Select columns requested
columns_to_keep = [
    'Number', 
    'Name', 
    'Metres', 
    'Region', 
    'County', 
    'Grid ref', 
    'Latitude', 
    'Longitude'
]

# Keep only those columns
clean_df = munros_df[columns_to_keep].copy()

# 4. Rename 'Metres' to 'Elevation (m)' for clarity
clean_df = clean_df.rename(columns={'Metres': 'Elevation (m)'})

# 5. Add the 'Status' column for tracking
clean_df['Status'] = 'To Do'

# 6. Save the cleaned data
clean_df.to_csv(output_file, index=False)

print(f"Successfully saved clean Munro list to '{output_file}'.")