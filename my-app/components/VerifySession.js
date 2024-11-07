// Assuming this code is in a React component where you are handling session verification

import { useEffect, useState } from "react";

export default function VerifySession() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [sessionValid, setSessionValid] = useState(null);

    useEffect(() => {
        // Call session verification when the component mounts
        verifySession();
    }, []);

    // Function to get the token from the document's cookies
    const getTokenFromCookie = () => {
        const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
        if (match) return match[2];  // Return the token value
        return null;  // If no token is found
    };

    const verifySession = async () => {
        const token = getTokenFromCookie();
        if (!token) {
            setErrorMessage("Brak tokenu. Proszę zalogować się.");
            return;
        }

        setLoading(true);
        setErrorMessage("");  // Clear any previous error message

        try {
            // Make a POST request to verify the session using the token
            const response = await fetch("http://127.0.0.1:3096/sessions/verifySession/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,  // Use the token retrieved from cookies
                }),
            });

            // Check if the response status is OK (200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the response data as JSON
            const data = await response.json();
            console.log('Data:', data);

            // Check if the session verification was successful
            if (data.success) {
                setSessionValid(true);
                console.log("Session verified successfully!");
            } else {
                setSessionValid(false);
                console.log("Session verification failed:", data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message || "Wystąpił problem z weryfikacją sesji.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Weryfikacja sesji</h1>

            {loading && <p>Trwa weryfikacja...</p>}

            {sessionValid !== null && (
                <p>{sessionValid ? "Sesja jest ważna." : "Sesja jest nieważna."}</p>
            )}

            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}
