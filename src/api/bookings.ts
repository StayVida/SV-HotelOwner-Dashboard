import { API_BASE_URL, API_key } from "../config";

export interface BookingData {
    booking_ID: string;
    user_ID: number;
    hotel_ID: string;
    room_ID: string;
    RoomNumber: number;
    booking_Status: string;
    checkIn: string;
    checkOut: string;
    payment_Status: string;
    is_refundable: boolean;
    "gross amount": number;
    "payment left": number;
    name: string;
    phone_number: string;
}

interface BookingsResponse {
    status: number;
    message: string;
    data: BookingData[];
}

export const fetchBookings = async (): Promise<BookingData[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/all-bookings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (response.status === 404) {
        const errorResult = await response.json();
        if (errorResult.message === "No bookings found") {
            return [];
        }
    }

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    const result: BookingsResponse = await response.json();
    return result.data;
};

export interface BookingDetailsData {
    booking_ID: string;
    booking_Status: string;
    checkIn: string;
    checkOut: string;
    payment_Status: string;
    payment_type?: string;
    is_refundable: boolean;
    tax_amount: number;
    platformFee: number;
    "Room Price": number;
    "amount paid by customer": number;
    "payment left to pay customer": number;
    "gross amount to be paid by customer": number;
    user_ID: number;
    name: string;
    phone_number: string;
    hotel_ID: string;
    hotel_name: string;
    room_ID: string;
    RoomNumber: number;
}

interface BookingDetailsResponse {
    status: number;
    message: string;
    data: BookingDetailsData;
}

export const fetchBookingDetails = async (bookingId: string): Promise<BookingDetailsData> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/${bookingId}/details`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch booking details");
    }

    const result: BookingDetailsResponse = await response.json();
    return result.data;
};
export interface MonthlyBookingsData {
    hotelId: number;
    hotelName: string;
    totalMonthlyBookings: number;
    bookingDifference: string;
    roomsOccupied: number;
    AvailableRooms: number;
    totalGuests: number;
    guestDifference: string;
    totalRevenue: number;
    revenueDifference: string;
    "last monthy": number;
}

interface MonthlyBookingsResponse {
    status: number;
    message: string;
    data: MonthlyBookingsData;
}

export const fetchMonthlyBookings = async (): Promise<MonthlyBookingsData> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/monthly-bookings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch monthly bookings");
    }

    const result: MonthlyBookingsResponse = await response.json();
    return result.data;
};

export interface UpcomingBookingData {
    booking_ID: string;
    room_ID: string;
    room_NO: number;
    name: string;
    checkIn: string;
    booking_Status: string;
}

interface UpcomingBookingsResponse {
    status: number;
    message: string;
    data: UpcomingBookingData[];
}

export const fetchUpcomingBookings = async (): Promise<UpcomingBookingData[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/upcoming-bookings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch upcoming bookings");
    }

    const result: UpcomingBookingsResponse = await response.json();
    return result.data;
};

export interface ActiveBookingData {
    booking_ID: string;
    user_ID: number;
    hotel_ID: string;
    room_ID: string;
    RoomNumber: number;
    booking_Status: string;
    checkIn: string;
    checkOut: string;
    payment_Status: string;
    name: string;
    "gross amount": number;
}

interface ActiveBookingsResponse {
    status: number;
    message: string;
    data: ActiveBookingData[];
}

export const fetchActiveBookings = async (): Promise<ActiveBookingData[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/active-bookings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch active bookings");
    }

    const result: ActiveBookingsResponse = await response.json();
    return result.data;
};

export const updateBookingStatus = async (bookingId: string, status: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/booking/${bookingId}/status?status=${status}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to update booking status to ${status}`);
    }
};
