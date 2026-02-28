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

export interface TransactionRequest {
    sr: number;
    hotel_id: string;
    txn_date: string;
    amount: number;
    status: string;
    remark: string | null;
}

export interface BankDetails {
    hotel_id: string;
    bank_account_no: string;
    ifsc_code: string;
    upi_id: string;
    bank_name: string;
    created_at: string;
    updated_at: string;
}

export interface AddBankDetailsRequest {
    bank_account_no?: string;
    ifsc_code?: string;
    bank_name?: string;
    upi_id?: string;
}

interface TransactionResponse {
    count: number;
    data: TransactionRequest[];
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

export const fetchTransactionRequests = async (status?: string): Promise<TransactionRequest[]> => {
    const token = localStorage.getItem("token");
    let url = `${API_BASE_URL}/owner/dashboard/fetch_requests`;
    if (status && status !== "ALL") {
        url += `?status=${status}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch transaction requests");
    }

    const result: TransactionResponse = await response.json();
    return result.data;
};

export const withdrawFunds = async (amount: number): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/withdraw`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
        throw new Error("Failed to process withdrawal");
    }
};

export const fetchBankDetails = async (): Promise<BankDetails[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/details`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch bank details");
    }

    const result = await response.json();
    return result;
};

export const addBankDetails = async (details: AddBankDetailsRequest): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(details),
    });

    if (!response.ok) {
        throw new Error("Failed to add bank details");
    }
};
export interface LedgerEntry {
    sr: number;
    hotel_id: string;
    booking_id: string | null;
    txn_date: string;
    via: string;
    transaction_id: string;
    type: "CR" | "WITHDRAW";
    amount: number;
    balance_after: number;
}

interface LedgerResponse {
    count: number;
    data: LedgerEntry[];
}

export const fetchLedger = async (): Promise<LedgerEntry[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/hotels/ledger`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch ledger");
    }

    const result: LedgerResponse = await response.json();
    return result.data;
};

export interface FinancialSummary {
    totalIncome: number;
    balance: number;
    month: string;
    year: number;
    totalWithdraw: number;
}

export const fetchFinancialSummary = async (): Promise<FinancialSummary> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/owner/dashboard/hotels/financial-summary`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch financial summary");
    }

    const result = await response.json();
    return result;
};
