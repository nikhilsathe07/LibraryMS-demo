import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function AddBook() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
    price: "",
    copies: 1,
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-lg font-medium">Please sign in to continue.</p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold mb-2">Access denied</h3>
          <p className="text-sm text-gray-600">
            Only admins can add new books.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const apiBase = import.meta.env.VITE_API_URL || "/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      toast.error("Title and author are required");
      return;
    }

    setLoading(true);
    try {
      const token =
        (user && user.token) || localStorage.getItem("token") || null;
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        isbn: form.isbn.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        price: form.price ? parseFloat(form.price) : 0,
        copies: form.copies ? parseInt(form.copies, 10) : 1,
      };

      const res = await fetch(`${apiBase}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add book");

      toast.success("Book added successfully");
      navigate("/admin/books"); // adjust if your admin book list route differs
    } catch (err) {
      toast.error(err.message || "Error adding book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Add New Book</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Title"
            required
            value={form.title}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="author"
            placeholder="Author"
            required
            value={form.author}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="isbn"
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <textarea
          name="description"
          placeholder="Short description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          className="input-field w-full"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="copies"
            type="number"
            min="1"
            placeholder="Copies"
            value={form.copies}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Adding..." : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
