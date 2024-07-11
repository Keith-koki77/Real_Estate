import React, { useState, useEffect } from 'react';
//import { Button } from '@/components/ui/button';
//import { toast } from 'sonner';
//import { useHistory } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import axios from 'axios';
import GoogleAddressSearch from "../../components/googleAddressSearch/GoogleAddressSearch";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import "./add-new-listing.scss";

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 0,
  lng: 0
};

function AddNewListing() {
  const [coordinates, setCoordinates] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loader, setLoader] = useState(false);
  const [listings, setListings] = useState([]);
  const [map, setMap] = useState(null);
  const navigate = useNavigate();
  //const history = useHistory();

  useEffect(() => {
    fetchListings();
  }, []);

  
  useEffect(() => {
    console.log('Listings updated:', listings);
  }, [listings]);

  const fetchListings = async () => {
    try {
      setLoader(true);
      const response = await axios.get('/api/listings');
      setListings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]); // Set to empty array on error
    } finally {
      setLoader(false);
    }
  };

  /*const fetchListings = async () => {
    try {
      setLoader(true);
      const response = await axios.get('/api/listings');
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      //toast('Failed to fetch listings');
    } finally {
      setLoader(false);
    }
  };*/

  const nextHandler = async () => {
    setLoader(true);

    if (!selectedAddress || !coordinates) {
      setLoader(false);
      console.log('Please select an address and wait for coordinates');
      //toast('Please select an address and wait for coordinates');
      return;
    }

    try {
      const response = await axios.post('/api/listings', {
        address: selectedAddress.label,
        coordinates: coordinates,
      });

      setLoader(false);
      console.log('New Data added,', response.data);
      toast('New Address added for listing');
      setListings([...listings, response.data]);
      navigate(`/add/${response.data.id}`);
      //navigate.replace('/add' + response.data.id);
      //router.replace('/edit-listing/' + data[0].id);
      //router.replace('/edit-listing/' + response.data.id);
    } catch (error) {
      setLoader(false);
      console.error(error);
      toast('Error adding new listing');
    }
  };

  const onMapLoad = (map) => {
    setMap(map);
  };

  return (
    <div className="add-new-listing">
      <div className="listing-container">
        <h2>Add New Listing</h2>
        <div className="listing-form">
          <h2>Enter Address which you want to list</h2>
          <GoogleAddressSearch
            setCoordinates={setCoordinates}
            setSelectedAddress={setSelectedAddress}
          />
        <Link to="/edit-listing">
           <button
            disabled={!coordinates || loader}
            onClick={nextHandler}
            className="button"
          >
            {loader ? <Loader className="loader" /> : "Next"}
          </button>
          </Link>
        </div>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={coordinates || center}
            zoom={coordinates ? 15 : 2}
            onLoad={onMapLoad}
          >
            {coordinates && (
              <Marker
                position={coordinates}
                title={selectedAddress?.label}
              />
            )}
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
      </div>
    </div>
  );
}

export default AddNewListing;
