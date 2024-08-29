import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';
import MapComponent from './MapComponent';
import DatePicker from './DatePicker'; // Import the custom DatePicker component
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

// Dynamically import all images from the images folder
const importAllImages = (r) => {
  return r.keys().map(r);
};

const images = importAllImages(require.context('./images', false, /\.(png|jpe?g|svg)$/));





function App() {
  const [reservations, setReservations] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);

  const hourSlots = useMemo(() => [
    '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00'
  ], []);

  useEffect(() => {
    if (date) {
      fetch(`https://tenniscourt-backend.onrender.com/reservations?date=${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(data => {
          if (!Array.isArray(data)) {
            throw new Error('Unexpected data format');
          }
          setReservations(data); // Set reservations state
          const reservationsForDate = data.filter(reservation => reservation.date === date);
          const bookedTimes = reservationsForDate.map(reservation => ({
            startTime: reservation.startTime,
            endTime: reservation.endTime,
          }));
          
          const availableStartTimes = hourSlots.filter(slot => 
            !bookedTimes.some(reservation => 
              (slot >= reservation.startTime && slot < reservation.endTime)
            )
          );

          setAvailableTimes(availableStartTimes);
        })
        .catch(error => console.error('Error fetching reservations:', error));
    }
  }, [date, hourSlots]);

  const filterEndTimes = (start) => {
    console.log("Selected start time:", start);
  
    if (!start || !date) return [];
    
    // Filter reservations to include only those on the selected date
    const reservationsForDate = reservations.filter(reservation => reservation.date === date);
  
    // Find the next reservation that starts after the selected start time on the selected date
    const nextReservation = reservationsForDate
      .filter(reservation => reservation.startTime > start)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];
    
    // Determine the end limit based on the next reservation or default to end of the day
    const endLimit = nextReservation ? nextReservation.startTime : hourSlots[hourSlots.length - 1];
    
    // Filter available end times to ensure they are greater than the start time and less than or equal to the end limit
    const availableEndTimes = hourSlots.filter(slot => slot > start && slot <= endLimit);
  
    return availableEndTimes;
  };
  
  
  
  

  const sendVerification = () => {
    let formattedPhone = phone;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+972' + formattedPhone.slice(1);
    }

    fetch('https://tenniscourt-backend.onrender.com/send_verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: formattedPhone }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert('Verification code sent!');
        setVerificationSent(true);
      } else {
        alert('Failed to send verification code. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error sending verification:', error);
      alert('Error occurred. Please check the console for more details.');
    });
  };

  const verifyCode = () => {
    let formattedPhone = phone;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+972' + formattedPhone.slice(1);
    }

    

    fetch('https://tenniscourt-backend.onrender.com/verify_code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: formattedPhone, code: otp }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert('Phone number verified!');
        setIsVerified(true);
      } else {
        alert('Invalid verification code. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error verifying code:', error);
      alert('Error occurred. Please check the console for more details.');
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please verify your phone number before making a reservation.');
      return;
    }
    const newReservation = { firstName, lastName, phone, email, date, startTime, endTime };

    fetch('https://tenniscourt-backend.onrender.com/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReservation)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        setReservations([...reservations, newReservation]);
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setOtp('');
        setIsVerified(false);
        setVerificationSent(false);
      } else {
        alert('Reservation failed: ' + (data.error || 'Unknown error'));
      }
    })
    .catch(error => {
      console.error('Error creating reservation:', error);
      alert('Error occurred. Please check the console for more details.');
    });
  };

    // Format images for react-image-gallery
    const galleryImages = images.map(image => ({
      original: image,
      thumbnail: image
    }));

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tennis Playground Reservations</h1>
      </header>
      <main>
        <section className="reservation-form">
          <h2>Reserve Your Spot</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={sendVerification}
              disabled={verificationSent}
            >
              Send Verification Code
            </button>
            {verificationSent && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button type="button" onClick={verifyCode}>
                  Verify Code
                </button>
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="date">Reservation Date</label>
            <DatePicker
              selectedDate={date}
              onDateChange={(newDate) => setDate(newDate)}
            />
            <label htmlFor="startTime">Start Time</label>
            <select
              id="startTime"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setEndTime(''); // Reset end time when start time changes
              }}
              required
            >
              <option value="" disabled>Select Start Time</option>
              {availableTimes.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <label htmlFor="endTime">End Time</label>
            <select
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              disabled={!startTime} // Disable end time selection until start time is chosen
            >
              <option value="" disabled>Select End Time</option>
              {filterEndTimes(startTime).map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <button type="submit">Submit Reservation</button>
          </form>
        </section>
        <section className="contact-info">
          <h2>Contact Us</h2>
          <p>If you have any questions or need assistance, please call us at:</p>
          <p><strong>058-560-5002</strong></p>
        </section>
        <section className="gallery">
          <ImageGallery items={galleryImages} showPlayButton={false} showFullscreenButton={false} showNav={false} autoPlay={true} slideInterval={3000}/>
        </section>
        <section className="map">
          <MapComponent />
        </section>
      </main>
    </div>
  );
}

export default App;
