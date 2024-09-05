import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

function AdminPage() {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchReservations = () => {
    const token = localStorage.getItem('access_token');

    fetch('https://tenniscourt-backend.onrender.com/reservations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.status === 401) {  // Check if unauthorized
        navigate('/login');
        return;
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setReservations(data);
      setLoading(false);
    })
    .catch(error => {
      setError(error);
      setLoading(false);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');  // Redirect to login if not logged in
      return;
    }

    fetchReservations();
  }, [navigate]);

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedReservation = {
      firstName: selectedReservation.firstName,
      lastName: selectedReservation.lastName,
      phone: selectedReservation.phone,
      email: selectedReservation.email,
      date: selectedReservation.date,
      startTime: selectedReservation.startTime,
      endTime: selectedReservation.endTime
    };

    fetch(`https://tenniscourt-backend.onrender.com/reservations/${selectedReservation._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedReservation)
    })
    .then(response => {
      if (response.ok) {
        alert('Reservation updated successfully');
        setSelectedReservation(null);  // Clear the selected reservation after updating
        fetchReservations();  // Reload the reservations list
      } else {
        return response.json().then(data => {
          throw new Error(data.error || 'Update failed');
        });
      }
    })
    .catch(error => {
      console.error('Error updating reservation:', error);
      alert('Error occurred. Please check the console for more details.');
    });
  };

  const handleDelete = (reservationId) => {
    const token = localStorage.getItem('access_token');

    if (window.confirm('Are you sure you want to delete this reservation?')) {
      fetch(`https://tenniscourt-backend.onrender.com/reservations/${reservationId}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          alert('Reservation deleted successfully');
          setReservations(reservations.filter(reservation => reservation._id !== reservationId));
        } else {
          alert('Delete failed: ' + response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting reservation:', error);
        alert('Error occurred. Please check the console for more details.');
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedReservation({
      ...selectedReservation,
      [name]: value
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="AdminPage">
      <header className="AdminPage-header">
        <h1>Admin - Reservations</h1>
      </header>
      <main>
        <section className="reservations-list">
          <h2>All Reservations</h2>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation._id}>
                  <td>{reservation.firstName}</td>
                  <td>{reservation.lastName}</td>
                  <td>{reservation.phone}</td>
                  <td>{reservation.email}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.startTime}</td>
                  <td>{reservation.endTime}</td>
                  <td>
                    <button onClick={() => handleEdit(reservation)}>Edit</button>
                    <button onClick={() => handleDelete(reservation._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {selectedReservation && (
          <section className="edit-form">
            <h2>Edit Reservation</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                name="firstName"
                value={selectedReservation.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                value={selectedReservation.lastName}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                value={selectedReservation.phone}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                value={selectedReservation.email}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="date"
                value={selectedReservation.date}
                onChange={handleChange}
                required
              />
              <input
                type="time"
                name="startTime"
                value={selectedReservation.startTime}
                onChange={handleChange}
                required
              />
              <input
                type="time"
                name="endTime"
                value={selectedReservation.endTime}
                onChange={handleChange}
                required
              />
              <button type="submit">Update Reservation</button>
              <button type="button" onClick={() => setSelectedReservation(null)}>Cancel</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
