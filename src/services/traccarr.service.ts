import axios from "axios";

const apiUrl = process.env.TRACCARR_API_URL;
const apiToken = process.env.TRACCARR_API_TOKEN;

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${apiToken}`,
  },
});

/**
 * Function to get all devices from Traccar.
 * @returns {Promise<Array>} - A promise that resolves to an array of devices.
 */
export async function getDevices() {
  try {
    const response = await apiClient.get("/api/devices");
    return response.data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw new Error("Could not fetch devices");
  }
}

/**
 * Function to get all positions from Traccar.
 * @returns {Promise<Array>} - A promise that resolves to an array of positions with device names.
 */
export async function getPositions() {
  try {
    const devices = await getDevices();
    const response = await apiClient.get("/api/positions");

    const positionsWithDeviceNames = response.data.map((position) => {
      const device = devices.find((device) => device.id === position.deviceId);
      return {
        ...position,
        deviceName: device ? device.name : "Unknown Device",
      };
    });

    return positionsWithDeviceNames;
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw new Error("Could not fetch positions");
  }
}
