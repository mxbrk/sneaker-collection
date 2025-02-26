"use client";

import { useState } from "react";

export default function ProfileUpdateForm() {
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (error) {
      setMessage("Ein Fehler ist aufgetreten.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center min-h-screen">
      <input
        type="email"
        name="email"
        placeholder="E-Mail"
        value={formData.email}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        name="username"
        placeholder="Benutzername"
        value={formData.username}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Passwort"
        value={formData.password}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Profil aktualisieren
      </button>
      {message && <p className="text-center text-red-500">{message}</p>}
    </form>
  );
}
