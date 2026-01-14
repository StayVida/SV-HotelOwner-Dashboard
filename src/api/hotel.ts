import { API_BASE_URL, API_key } from "../config";

export interface HotelData {
    hotel_ID: string;
    name: string;
    type: string;
    destination: string;
    description: string;
    phone_no: string;
    longitude: string;
    latitude: string;
    status: string;
    remark: string;
    tags: string[];
    amenities: string[];
    features: string[];
    images: string[];
}

interface HotelResponse {
    status: number;
    message: string;
    data: HotelData[];
}

export const fetchHotels = async (): Promise<HotelData[]> => {
    const token = localStorage.getItem("token");
    console.log("token ", token);
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/hotels-profile`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch hotels");
    }

    const result: HotelResponse = await response.json();
    return result.data;
};

export const updateHotelProfile = async (hotelData: Partial<HotelData>): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/hotels/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(hotelData),
    });

    if (!response.ok) {
        console.log("response ", response);
        throw new Error("Failed to update hotel profile");
    }
};
