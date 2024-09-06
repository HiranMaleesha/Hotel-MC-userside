import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './Booking.css';

const Booking = () => {
  const { id } = useParams();
  const [hall, setHall] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/users/${id}`);
        setHall(response.data.user);
      } catch (error) {
        console.error("Error fetching hall data", error);
      }
    };

    fetchHall();
  }, [id]);

  const confirmBooking = async () => {
    try {
      await axios.patch(`http://localhost:4000/users/${id}`, { status: "booked" });
      setMessage("Booking confirmed!");
    } catch (error) {
      console.error("Error confirming booking", error);
    }
  };

  if (!hall) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <h1>Booking Details</h1>
      <div className="booking-details">
        <p><strong>Hall Name:</strong> {hall.Hall_Name}</p>
        <p><strong>Capacity:</strong> {hall.Capacity} people</p>
        <p><strong>Price:</strong> Rs.{hall.Price}/day</p>
        <p><strong>Location:</strong> {hall.Location}</p>
      </div>
      <button onClick={confirmBooking} className="confirm-button">
        Confirm Booking
      </button>
      {message && <p className="booking-message">{message}</p>}
    </div>
  );
};

export default Booking;
