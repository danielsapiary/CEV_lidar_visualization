import requests
import json
import time

# Set the server URL and endpoint
server_url = 'http://localhost:3001/upload-lidar'

# Load the list of LIDAR scans from the JSON file
with open('scan.json', 'r') as file:
    lidar_scans = json.load(file)

# Replace 'Infinity' values with None in each LIDAR scan
for scan in lidar_scans:
    scan['ranges'] = [None if value == float('inf') else value for value in scan['ranges']]

# Iterate through each LIDAR scan and send it
headers = {'Content-Type': 'application/json'}
for lidar_data in lidar_scans:
    try:
        response = requests.post(server_url, json=lidar_data, headers=headers)

        # Handling response
        if response.status_code == 200:
            try:
                response_data = response.json()  # Attempt to parse JSON response
                print('Success:', response_data)
            except json.JSONDecodeError:
                print('Success!')
        else:
            print(f'Failed with status code {response.status_code}')
            print('Error message:', response.text)
    except requests.exceptions.RequestException as e:
        print('Error sending request:', e)

    # Wait for 0.02 seconds before sending the next scan
    time.sleep(0.02)
