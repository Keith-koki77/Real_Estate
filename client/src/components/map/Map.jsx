import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 0,
  lng: 0
};

function ListingMap() {
  const [listings, setListings] = useState([]);
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/listings');
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Failed to fetch listings');
    } finally {
      setIsLoading(false);
    }
  };

  const onMapClick = useCallback(async (event) => {
    const newListing = {
      address: 'New Listing', // You might want to use a reverse geocoding service to get the address
      coordinates: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      },
      // createdById: "user_id_here", // Replace with actual user ID or remove if not needed
    };

    try {
      const response = await axios.post('/api/listings', newListing);
      setListings([...listings, response.data]);
    } catch (error) {
      console.error('Error creating new listing:', error);
    }
  }, [listings]);

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={2}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {Array.isArray(listings) && listings.map((listing) => (
          <Marker
            key={listing.id}
            position={{
              lat: listing.coordinates.lat,
              lng: listing.coordinates.lng
            }}
            title={listing.address}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default ListingMap;