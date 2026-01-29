import { API_BASE_URL, API_key } from "../config";

export interface RoomData {
    room_ID: string;
    room_NO: number;
    room_Type: string;
    hotel_ID: string;
    features: string[];
    price: number;
    Status: string;
    isEnable: boolean;
    createdAt: string;
    images: string[];
    maxAdults?: number;
    maxChildren?: number;
    bedCount?: number;
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
    room_NO: string;
    features: string[];
    maxAdults: number;
    maxChildren: number;
    bedCount: number;
    price: number;
    images: File[];
}

export const registerRoomWithImages = async (roomData: RegisterRoomData): Promise<any> => {
    const token = localStorage.getItem("token");
    const { roomType, room_NO, maxAdults, maxChildren, bedCount, price, features, images } = roomData;

    const formData = new FormData();
    formData.append("roomType", roomType);
    formData.append("roomNumber", room_NO.toString());
    formData.append("maxAdults", maxAdults.toString());
    formData.append("maxChildren", maxChildren.toString());
    formData.append("bedCount", bedCount.toString());
    formData.append("price", price.toString());

    // Send features as a JSON string with double quotes
    formData.append("features", JSON.stringify(features));
    images.forEach(image => formData.append("images", image));
    console.log("formData ", roomData);
    const response = await fetch(`${API_BASE_URL}/api/hotels/register_room_with_images`, {
        method: "POST",
        headers: {
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
            // Content-Type is intentionally omitted for FormData
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("errorData ", errorData);
        throw new Error(errorData.message || "Failed to register room");
    }

    return await response.json();
};

export const updateRoom = async (roomId: string, roomData: Partial<RegisterRoomData>): Promise<any> => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    if (roomData.roomType) formData.append("roomType", roomData.roomType);
    if (roomData.room_NO) formData.append("roomNumber", roomData.room_NO.toString());
    if (roomData.maxAdults !== undefined) formData.append("maxAdults", roomData.maxAdults.toString());
    if (roomData.maxChildren !== undefined) formData.append("maxChildren", roomData.maxChildren.toString());
    if (roomData.bedCount !== undefined) formData.append("bedCount", roomData.bedCount.toString());
    if (roomData.price !== undefined) formData.append("price", roomData.price.toString());
    if (roomData.features) formData.append("features", JSON.stringify(roomData.features));

    if (roomData.images) {
        roomData.images.forEach(image => formData.append("images", image));
    }

    const response = await fetch(`${API_BASE_URL}/owner/dashboard/rooms/${roomId}`, {
        method: "PUT",
        headers: {
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update room");
    }

    return await response.json();
};

export const deleteRoom = async (roomId: string, hotelId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/${roomId}/${hotelId}/status/false`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete room");
    }
};
