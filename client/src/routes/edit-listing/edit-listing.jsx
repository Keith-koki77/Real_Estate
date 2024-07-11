import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "./edit-listing.scss"; // Make sure to create this CSS file

function EditListing() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [addressData, setAddressData] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`/api/listings/${id}`);
        setListing(response.data);
        setValue(response.data.desc || "");
        setImages(response.data.images || []);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError("Failed to fetch listing data");
      }
    };

    fetchListing();

    if (location.state) {
      setAddressData(location.state);
    }
  }, [id, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
  
    try {
      //setLoader(true); // Add a loader state if you haven't already
  
      const payload = {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: addressData ? addressData.address : inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: addressData ? addressData.latitude : inputs.latitude,
          longitude: addressData ? addressData.longitude : inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        }
      };
  
      console.log('Sending update payload:', payload); // Log the payload for debugging
  
      const response = await axios.put(`/api/listings/${id}`, payload);
      
      console.log('Update response:', response.data); // Log the response for debugging
  
      if (response.data && response.data.id) {
        navigate(`/profile/${response.data.id}`);
      } else {
        setError("Unexpected response format from server");
      }
    } catch (err) {
      console.error('Error updating listing:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', err.response.data);
        setError(`Failed to update listing: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        setError("No response received from server. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        setError(`An error occurred: ${err.message}`);
      }
    } 
  };

  if (!listing) return <div>Loading...</div>;

  return (
    <div className="editListingPage">
      <div className="formContainer">
        <h1>Edit Listing</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" defaultValue={listing.title} />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" defaultValue={listing.price} />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input 
                id="address" 
                name="address" 
                type="text" 
                defaultValue={addressData ? addressData.address : listing.address}
                readOnly={!!addressData}
              />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value}/>
            </div>
            {/* Add the rest of your form fields here, similar to the ones above */}
            <button className="sendButton" type="submit">Update Listing</button>
            { error && <span className="error">{error}</span> }
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget uwConfig={{
          multiple: true,
          cloudName:"koki",
          uploadPreset:"estate",
          folder:"posts",
        }}
        setState={setImages} />
      </div>
    </div>
  );
}

export default EditListing;






/*
import { useState,useEffect } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate, useLocation } from "react-router-dom";


function EditListing() {
  const [ value, setValue ] = useState("");
  const [ images, setImages ] = useState([]);
  const [error, setError ] = useState("");
  const [addressData, setAddressData] = useState(null);


  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setAddressData(location.state);
    }
  }, [location]);

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try{
      const res = await apiRequest.post("/posts",{
        postData:{
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail:{
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        }
      });
      navigate("/"+res.data.id);
    }catch(err){
      console.log(err);
      setError(error);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input 
                id="address" 
                name="address" 
                type="text" 
                value={addressData ? addressData.address : ''}
                readOnly
              />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value}/>
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input 
                id="latitude" 
                name="latitude" 
                type="text" 
                value={addressData ? addressData.latitude : ''}
                readOnly
              />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input 
                id="longitude" 
                name="longitude" 
                type="text" 
                value={addressData ? addressData.longitude : ''}
                readOnly
              />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Add</button>
            { error && <span>error</span> }
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index)=>(
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget uwConfig={{
          multiple: true,
          cloudName:"koki",
          uploadPreset:"estate",
          folder:"posts",
        }}
        setState={setImages} />
      </div>
    </div>
  );
}

export default EditListing;*/

