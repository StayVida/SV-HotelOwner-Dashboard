import { API_BASE_URL, API_key } from "../config";

export interface Feature {
    feature_id: number;
    name: string;
    status: string;
}

export interface Amenity {
    amenity_id: number;
    name: string;
    status: string;
}

export interface Tag {
    tag_id: number;
    name: string;
    status: string;
}

export const fetchFeatures = async (): Promise<Feature[]> => {
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

    return response.json();
};

export const fetchAmenities = async (): Promise<Amenity[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/lookup/amenities`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch amenities");
    }

    return response.json();
};

export const fetchTags = async (): Promise<Tag[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/lookup/tags`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tags");
    }

    return response.json();
};
