import { API_BASE_URL, API_key } from "../config";

export interface RoomData {
    room_ID: string;
    room_NO: number;
    room_Type: string;
    hotel_ID: string;
    features: string[];
    price: number;
    availability: boolean;
    isEnable: boolean;
    createdAt: string;
    images: string[];
}

export interface FeatureData {
    feature_id: number;
    name: string;
    status: "enable" | "disable";
}

interface RoomsResponse {
    status: number;
    message: string;
    data: RoomData[];
}

export const fetchRooms = async (): Promise<RoomData[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/allrooms`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch rooms");
    }

    const result: RoomsResponse = await response.json();
    return result.data;
};

export const fetchFeatures = async (): Promise<FeatureData[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/lookup/features`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch features");
    }

    const result = await response.json();
    return result; // The user provided the array directly as response
};
export interface RegisterRoomData {
    roomType: string;
    features: string[];
    maxAdults: number;
    maxChildren: number;
    bedCount: number;
    price: number;
}

export const registerRoomWithImages = async (roomData: RegisterRoomData): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/hotels/register_room_with_images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("errorData ", errorData);
        throw new Error(errorData.message || "Failed to register room");
    }

    return await response.json();
};
