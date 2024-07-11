import { MapPin } from 'lucide-react';
import React from 'react';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

function GoogleAddressSearch({ setCoordinates, setSelectedAddress }) {
  return (
    <div className='flex gap-2 items-center w-full'>
      <MapPin className='h-10 w-10 p-2 rounded-full text-primary bg-primary/10' />
      <GooglePlacesAutocomplete
        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
        selectProps={{
          placeholder: 'Search Property Address',
          isClearable: true,
          className: 'w-full',
          onChange: (place) => {
            if (!place) {
              setCoordinates(null);
              setSelectedAddress(null);
              return;
            }
            console.log(place);
            geocodeByAddress(place.label)
              .then(result => getLatLng(result[0]))
              .then(({ lat, lng }) => {
                setCoordinates({ lat, lng });
                setSelectedAddress(place);
              })
              .catch(error => {
                console.error("Error fetching coordinates:", error);
              });
          }
        }}
      />
    </div>
  );
}

export default GoogleAddressSearch;