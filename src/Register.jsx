import React, { useState } from "react";
import SpaceBackground from "./SpaceBackground";

export default function Register({ onBack }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ FIXED: actually calls the backend /register endpoint
  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.status === "success") {
        alert("Registered successfully! Please login.");
        onBack && onBack(); // ✅ go back to home/login after register
      } else {
        alert("Registration failed. Email may already be in use.");
      }
    } catch (err) {
      alert("Server error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <SpaceBackground />

      <div className="login-card">
        <h1 className="login-title">Register</h1>

        <form onSubmit={submit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          {/* ✅ ADDED: back button to go back to home */}
          <button
            type="button"
            onClick={onBack}
            style={{ marginTop: "10px", background: "rgba(255,255,255,0.08)" }}
          >
            ← Back
          </button>
        </form>
      </div>

      <style>{`

.login-page{
height:100vh;
display:flex;
align-items:center;
justify-content:center;
position:relative;
overflow:hidden;
}

.login-card{
width:380px;
padding:40px;
background:rgba(10,10,20,0.55);
border:1px solid rgba(255,255,255,0.1);
backdrop-filter:blur(20px);
border-radius:20px;
color:white;
z-index:10;
position:relative;
}

.login-title{
font-size:32px;
margin-bottom:20px;
text-align:center;
color:#ff6b6b;
}

input{
width:100%;
padding:12px;
margin-bottom:15px;
background:rgba(255,255,255,0.05);
border:1px solid rgba(255,255,255,0.1);
border-radius:10px;
color:white;
font-size:14px;
outline:none;
box-sizing:border-box;
}

input:focus{
border-color:rgba(192,57,43,0.6);
}

button{
width:100%;
padding:12px;
background:linear-gradient(135deg,#c0392b,#e74c3c);
border:none;
border-radius:10px;
color:white;
font-weight:bold;
cursor:pointer;
font-size:15px;
}

button:hover{
opacity:0.9;
}

button:disabled{
opacity:0.6;
cursor:not-allowed;
}

`}</style>
    </div>
  );
}
