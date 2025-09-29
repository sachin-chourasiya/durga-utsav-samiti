// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [members, setMembers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [setAmount, setSetAmount] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:4000/members', {
        headers: { Authorization: token },
      });
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updatePayment = async (id, month, status, amount = 100) => {
    try {
      await axios.post(
        'http://localhost:4000/admin/update-payment',
        { memberId: id, month, status, amount },
        { headers: { Authorization: token } }
      );
      fetchMembers();
    } catch (err) {
      alert('Error updating payment!');
    }
  };

  const applyDefaultAmount = async () => {
    if (!setAmount) return alert('Enter amount first');
    try {
      await axios.post(
        'http://localhost:4000/admin/set-amount',
        { amount: Number(setAmount) },
        { headers: { Authorization: token } }
      );
      alert(`Default amount set to ₹${setAmount}`);
      setSetAmount('');
      fetchMembers();
    } catch (err) {
      alert('Error setting default amount');
    }
  };

  // Calculate total collected from DB
  const totalCollected = members.reduce(
    (sum, m) =>
      sum +
      m.payments.reduce(
        (s, p) => s + (p.status === 'paid' ? p.amount || 0 : 0),
        0
      ),
    0
  );

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: '#ff9933' }}
      >
        <div className="container-fluid">
          <span className="navbar-brand fw-bold text-white">Durga Samiti</span>
          <div className="d-flex align-items-center">
            <span className="text-white me-3 fw-semibold small">
              {user?.name}
            </span>
            <button className="btn btn-light btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Totals & Set Amount */}
      <div className="container py-3">
        <div className="row text-center mb-3 g-3">
          <div className="col-12 col-md-6">
            <div
              className="card shadow-sm border"
              style={{ borderColor: '#ff9933' }}
            >
              <div className="card-body">
                <h6 className="text-warning fw-bold">Total Collected</h6>
                <h5 className="fw-bold">₹{totalCollected}</h5>
              </div>
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="col-12 col-md-6">
              <div
                className="card shadow-sm border"
                style={{ borderColor: '#ff9933' }}
              >
                <div className="card-body">
                  <h6 className="text-warning fw-bold">Set Default Amount</h6>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="₹ Amount"
                      value={setAmount}
                      onChange={(e) => setSetAmount(e.target.value)}
                    />
                    <button
                      className="btn btn-warning"
                      style={{
                        backgroundColor: '#ff9933',
                        borderColor: '#ff9933',
                      }}
                      onClick={applyDefaultAmount}
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <h4 className="mb-3 text-center text-warning">
          Members Payment Status
        </h4>

        {/* Mobile Friendly Cards */}
        <div className="d-lg-none">
          {members.length > 0 ? (
            members.map((m) => {
              const totalUserPaid = m.payments.reduce(
                (s, p) => s + (p.status === 'paid' ? p.amount || 0 : 0),
                0
              );
              return (
                <div
                  key={m._id}
                  className="card mb-3 shadow-sm"
                  onClick={() => setExpanded(expanded === m._id ? null : m._id)}
                  style={{
                    cursor: 'pointer',
                    borderColor: '#ff9933',
                    borderWidth: 1,
                    borderStyle: 'solid',
                  }}
                >
                  <div className="card-body">
                    <h6 className="card-title mb-1 fw-bold">{m.name}</h6>
                    <p className="mb-1 text-muted">📞 {m.phone}</p>
                    <p className="fw-semibold text-success">
                      Total Paid: ₹{totalUserPaid}
                    </p>
                    <div>
                      {m.payments.slice(-2).map((p, i) => (
                        <span
                          key={i}
                          className={`badge me-1 ${
                            p.status === 'paid' ? 'bg-success' : 'bg-danger'
                          }`}
                        >
                          {p.month}: {p.status}
                        </span>
                      ))}
                      {m.payments.length > 2 && (
                        <span className="badge bg-secondary">+more</span>
                      )}
                    </div>

                    {expanded === m._id && (
                      <div className="mt-3">
                        <h6 className="fw-bold">Payment History</h6>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th>Month</th>
                                <th>Status</th>
                                <th>Amount</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {m.payments.map((p, i) => (
                                <tr key={i}>
                                  <td>{p.month}</td>
                                  <td
                                    className={
                                      p.status === 'paid'
                                        ? 'text-success fw-bold'
                                        : 'text-danger fw-bold'
                                    }
                                  >
                                    {p.status}
                                  </td>
                                  <td>₹{p.amount || 0}</td>
                                  <td>
                                    {p.date
                                      ? new Date(p.date).toLocaleDateString()
                                      : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {user?.role === 'admin' && (
                      <div className="d-flex gap-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePayment(m._id, 'Sept-2025', 'paid');
                          }}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: '#ff9933',
                            color: '#fff',
                            flex: 1,
                          }}
                        >
                          Paid
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePayment(m._id, 'Sept-2025', 'pending');
                          }}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: '#ff9933',
                            color: '#fff',
                            flex: 1,
                          }}
                        >
                          Pending
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-muted">No members found</p>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="d-none d-lg-block">
          <div
            className="card shadow-sm"
            style={{
              borderColor: '#ff9933',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          >
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-warning">
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Total Paid</th>
                      <th>Payments</th>
                      {user?.role === 'admin' && (
                        <th className="text-center">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => {
                      const totalUserPaid = m.payments.reduce(
                        (s, p) => s + (p.status === 'paid' ? p.amount || 0 : 0),
                        0
                      );
                      return (
                        <tr key={m._id}>
                          <td>{m.name}</td>
                          <td>{m.phone}</td>
                          <td className="fw-bold text-success">
                            ₹{totalUserPaid}
                          </td>
                          <td>
                            {m.payments.map((p, i) => (
                              <span
                                key={i}
                                className={`badge me-1 ${
                                  p.status === 'paid'
                                    ? 'bg-success'
                                    : 'bg-danger'
                                }`}
                              >
                                {p.month}: {p.status}
                              </span>
                            ))}
                          </td>
                          {user?.role === 'admin' && (
                            <td className="text-center">
                              <button
                                onClick={() =>
                                  updatePayment(m._id, 'Sept-2025', 'paid')
                                }
                                className="btn btn-sm me-2"
                                style={{
                                  backgroundColor: '#ff9933',
                                  color: '#fff',
                                }}
                              >
                                Paid
                              </button>
                              <button
                                onClick={() =>
                                  updatePayment(m._id, 'Sept-2025', 'pending')
                                }
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: '#ff9933',
                                  color: '#fff',
                                }}
                              >
                                Pending
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
