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

export interface AvailableRoom {
    room_ID: string;
    room_NO: number;
    hotel_ID: string;
    room_Type: string;
    price_per_night: number;
    total_nights: number;
    total_price: number;
    images: string[];
}

interface AvailableRoomsResponse {
    status: number;
    message: string;
    data: AvailableRoom[];
}

export const fetchAvailableRooms = async (checkIn: string, checkOut: string): Promise<AvailableRoom[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/available-rooms?checkIn=${checkIn}&checkOut=${checkOut}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch available rooms");
    }

    const result: AvailableRoomsResponse = await response.json();
    return result.data;
};

export interface LockRoomRequest {
    roomId: string;
    checkIn: string;
    checkOut: string;
}

export interface LockRoomResponse {
    hotelId: string;
    roomId: string;
    roomNo: number;
    roomType: string;
    checkIn: string;
    checkOut: string;
    roomPrice: number;
    lockExpiry: string;
}

export const lockRoom = async (data: LockRoomRequest): Promise<LockRoomResponse> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/lock-room`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to lock room");
    }

    return await response.json();
};

export interface CreateOfflineBookingRequest {
    email: string;
    lockRoomId: string;
    adults: number;
    children: number;
    paymentType: string;
    name: string;
    countryCode: string;
    phoneNo: string;
    checkIn: string;
    checkOut: string;
}

export interface CreateOfflineBookingResponse {
    status: number;
    message: string;
    data: {
        name: string;
        bookingId: string;
        bookingStatus: string;
        paymentStatus: string;
        roomPrice: number;
        platformCharges: number;
        taxAmount: number;
        createdAt: string;
        checkIn: string;
        checkOut: string;
        duration: number;
        advanceRate: number;
        totalAmount_ADV: number;
        totalAmount: number;
        paymentType: string;
    };
}

export const createOfflineBooking = async (data: CreateOfflineBookingRequest): Promise<CreateOfflineBookingResponse> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create offline booking");
    }

    return await response.json();
};
