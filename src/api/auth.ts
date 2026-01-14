import { API_BASE_URL,API_key } from "../config";

export interface VerifyOtpResponse {
    success: boolean;
    token: string;
    email: string;
    role: string;
    message: string;
    profileExists: boolean;
    userID: number;
}

export const requestOtp = async (email: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/otplogin/get-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error("Failed to request OTP");
    }

    // The user prompt suggests the response is a plain text message
    const text = await response.text();
    return text;
};

export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const response = await fetch(`${API_BASE_URL}/otplogin/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_key
        },
        body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
        throw new Error("Failed to verify OTP");
    }

    return response.json();
};
