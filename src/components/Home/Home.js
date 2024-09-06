import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './Home.css';

const URL = "http://localhost:4000/users";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return { users: [] };
  }
};

function Home() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, ""]);
  const [selectedType, setSelectedType] = useState("");
  const [minCapacity, setMinCapacity] = useState("");

  useEffect(() => {
    fetchHandler().then((data) => {
      setAllUsers(data.users || []);
      setFilteredUsers(data.users || []);
    });
  }, []);

  const handleSearch = () => {
    let result = allUsers;

    if (searchQuery) {
      result = result.filter((user) =>
        Object.values(user).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (selectedType) {
      result = result.filter((user) => user.Hall_Type === selectedType);
    }

    if (minCapacity) {
      result = result.filter((user) => user.Capacity >= parseInt(minCapacity));
    }

    if (priceRange[0] !== 0 || priceRange[1] !== "") {
      result = result.filter((user) => 
        user.Price >= priceRange[0] && 
        (priceRange[1] === "" || user.Price <= priceRange[1])
      );
    }

    setFilteredUsers(result);
  };

  return (
    <div className="home-container">
      <h1>Find Your Perfect Venue</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search halls..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      <div className="filters-container">
        <div className="filter-item">
          <label htmlFor="capacity">Min Capacity</label>
          <input
            type="number"
            id="capacity"
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
            min="0"
            placeholder="Enter minimum capacity"
          />
        </div>
        <div className="filter-item price-filter">
          <label>Price Range</label>
          <div className="price-range">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              placeholder="Min Price"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], e.target.value === "" ? "" : parseInt(e.target.value)])}
              placeholder="Max Price"
            />
          </div>
        </div>
        <div className="filter-item">
          <label htmlFor="type">Hall Type</label>
          <select 
            id="type" 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Conference">Conference</option>
            <option value="Meeting">Meeting</option>
            <option value="Banquet">Banquet</option>
            <option value="Ballroom">Ballroom</option>
          </select>
        </div>
      </div>

      <div className="hall-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, i) => (
            <div className="hall-item" key={i}>
              <img
                src={`data:${user.Photos.contentType};base64,${user.Photos.data}`}
                alt={user.Hall_Name}
                className="hall-image"
              />
              <div className="hall-details">
                <h2>{user.Hall_Name}</h2>
                <p><i className="fas fa-users"></i> Capacity: {user.Capacity} people</p>
                <p><i className="fas fa-tag"></i> Price: Rs.{user.Price}/day</p>
                <p><i className="fas fa-building"></i> Type: {user.Hall_Type}</p>
                <Link to={`/halls/${user._id}`} className="view-details-btn">View Details</Link>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No halls found matching your criteria</p>
        )}
      </div>
    </div>
  );
}

export default Home;