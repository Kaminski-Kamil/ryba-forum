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

        // Prosta walidacja formularza
        if (!username || !password) {
            setErrorMessage("Proszę wypełnić wszystkie pola.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            // Fetch rejestracja (register)
            const result1 = await fetch("http://127.0.0.1:3096/sessions/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            console.log('Response from registration:', result1);

            if (!result1.ok) {
                throw new Error(`Błąd rejestracji! Status: ${result1.status}`);
            }

            // Parse the registration response
            const data1 = await result1.json();
            console.log('Registration response data:', data1);

            if (data1.success) {
                console.log(data1.message);  // "User was registered."
            } else {
                throw new Error("Wystąpił problem z rejestracją.");
            }

            // Fetch logowanie (login)
            const result2 = await fetch("http://127.0.0.1:3096/sessions/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            console.log('Response from login:', result2);

            if (!result2.ok) {
                throw new Error(`Błąd logowania! Status: ${result2.status}`);
            }

            // Parse the login response
            const data2 = await result2.json();
            console.log('Login response data:', data2);

            // Since the login response does not have sessionId, we check if login was successful
            if (data2.success) {
                console.log('Login successful!');
                // You could redirect or show a success message here
                document.location = "/"; // Redirect after successful login
            } else {
                throw new Error("Błąd logowania! Sprawdź dane użytkownika.");
            }

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message || "Wystąpił problem z rejestracją lub logowaniem.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className={styles.pageTitle}>Zarejestruj się</h1>
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
                        <input type="submit" value={loading ? "Trwa rejestracja..." : "Zarejestruj się"} disabled={loading} />
                    </p>
                </form>
            </div>
        </>
    );
}
