import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './HallDetails.css';

const HallDetails = () => {
  const { id } = useParams();
  const [hall, setHall] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/users/${id}`);
        const hallData = response.data.user;
        setHall(hallData);

        if (hallData.Photos && hallData.Photos.data) {
          const base64String = btoa(
            new Uint8Array(hallData.Photos.data.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          setImageSrc(`data:${hallData.Photos.contentType};base64,${base64String}`);
        }
      } catch (error) {
        console.error("Error fetching hall details", error);
      }
    };
    fetchHall();
  }, [id]);

  const handleBooking = () => {
    navigate(`/booking/${id}`);
  };

  if (!hall) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading hall details...</p>
      </div>
    );
  }

  return (
    <div className="hall-details-container">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={hall.Hall_Name}
          className="hall-details-image"
        />
      )}
      <h1>{hall.Hall_Name}</h1>
      <p>Capacity: {hall.Capacity} people</p>
      <p>Location: {hall.Location}</p>
      <p>Price: Rs.{hall.Price}/day</p>
      <p>Type: {hall.Hall_Type}</p>
      <button onClick={handleBooking} className="buttonh" >Book Now</button>
    </div>
  );
};

export default HallDetails;
