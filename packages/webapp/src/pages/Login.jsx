// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/login', {
        phone,
        password,
      });

      // Save user + token
      login({ name: res.data.name, role: res.data.role }, res.data.token);

      navigate('/');
    } catch (err) {
      alert('Login failed! Check phone & password.');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#fff3e0' }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: '22rem',
          border: '2px solid #ff9933',
          borderRadius: '1rem',
        }}
      >
        <h3
          className="text-center mb-4"
          style={{ color: '#ff9933', fontWeight: 'bold' }}
        >
          Durga Samiti Login
        </h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#ff9933' }}>
              Phone
            </label>
            <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ borderColor: '#ff9933' }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#ff9933' }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderColor: '#ff9933' }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: '#ff9933',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
