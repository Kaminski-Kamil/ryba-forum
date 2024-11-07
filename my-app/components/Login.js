"use client"
// Komponent kliencki

import { useState } from "react";
import styles from "@/styles/RegisterForm.module.css"

export default function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const { target: { username: { value: username }, password: { value: password } } } = e;

        // Simple form validation
        if (!username || !password) {
            setErrorMessage("Proszę wypełnić wszystkie pola.");
            return;
        }

        setLoading(true);
        setErrorMessage(""); // Clear any previous error

        try {
            // Login API request
            const response = await fetch("http://127.0.0.1:3096/sessions/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            console.log('Response:', response);

            // Check if the response status is OK (200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse JSON from the response
            const data = await response.json();
            console.log('Data:', data);

            // Check if the login was successful
            if (data.success) {
                // Log the token or store it in a secure cookie
                const token = data.data.token;
                console.log('Login successful! Token:', token);

                // Set the token as a secure HttpOnly cookie
                document.cookie = `auth_token=${token}; Secure; HttpOnly; SameSite=Strict; path=/; max-age=3600`;

                // Redirect to home or dashboard after successful login
                document.location = "/"; // Redirect to the homepage or dashboard
            } else {
                setErrorMessage("Błąd logowania! Sprawdź dane użytkownika.");
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message || "Wystąpił problem z logowaniem.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className={styles.pageTitle}>Zaloguj się</h1>
            <div className={styles.container}>
                <form onSubmit={handleSubmit}>
                    <label>
                        <p>Nazwa użytkownika:</p>
                        <input type="text" name="username" required />
                    </label>
                    <label>
                        <p>Hasło:</p>
                        <input type="password" name="password" required />
                    </label>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    <p>
                        <input type="submit" value={loading ? "Trwa logowanie..." : "Zaloguj się"} disabled={loading} />
                    </p>
                </form>
            </div>
        </>
    );
}
