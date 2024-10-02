import axios from "axios";
import { logger } from "..";

const apiUrl = process.env.TRACCARR_API_URL;
const apiToken = process.env.TRACCARR_API_TOKEN;

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${apiToken}`,
  },
});

/**
 * API interface for a Traccar position.
 */
export interface TraccarPosition {
  id: number;
  attributes: {
    batteryLevel: number;
    distance: number;
    totalDistance: number;
    motion: boolean;
  };
  deviceId: number;
  protocol: string;
  serverTime: Date;
  deviceTime: Date;
  outdated: boolean;
  valid: boolean;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  course: number;
  address: string;
  accuracy: number;
  network: object;
  geofenceIds: number[];
}

/**
 * API interface for a Traccar device.
 */
export interface TraccarDevice {
  id: number;
  name: string;
  uniqueId: string;
  status: string;
  disabled: boolean;
  lastUpdate: Date;
  positionId: number;
  groupId: number;
  groupName?: string; // Filled by implementation
  phone: string;
  model: string;
  contact: string;
  category: string;
  attributes: {
    deviceImage: string;
  };
}

export interface TraccarGroup {
  id: number;
  name: string;
}

/**
 * Function to get all devices from Traccar.
 * @returns {Promise<Array>} - A promise that resolves to an array of devices.
 */
export async function getDevices(): Promise<Array<TraccarDevice>> {
  try {
    const response = await apiClient.get<TraccarDevice[]>("/api/devices");
    return response.data;
  } catch (error) {
    logger.error("Error fetching devices:", error);
    throw new Error("Could not fetch devices");
  }
}

/**
 * Function to get all positions from Traccar.
 * @returns {Promise<Array>} - A promise that resolves to an array of positions with device names.
 */
export async function getPositions(): Promise<Array<TraccarPosition>> {
  try {
    const devices = await getDevices();
    const response = await apiClient.get<TraccarPosition[]>("/api/positions");

    return response.data.map((position: TraccarPosition) => {
      const device = devices.find((device: TraccarDevice) => device.id === position.deviceId);
      return {
        ...position,
        deviceName: device ? device.name : "Unknown Device",
      };
    });
  } catch (error) {
    logger.error("Error fetching positions:", error);
    throw new Error("Could not fetch positions");
  }
}

/**
 * Function to get all groups from Traccar.
 * @returns {Promise<Array>} - A promise that resolves to an array of groups.
 */
export async function getGroups(): Promise<Array<TraccarGroup>> {
  try {
    const response = await apiClient.get<TraccarGroup[]>("/api/groups");
    return response.data;
  } catch (error) {
    logger.error("Error fetching groups:", error);
    throw new Error("Could not fetch groups");
  }
}
