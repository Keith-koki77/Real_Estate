export const validateListingInput = (input) => {
    const { address, coordinates } = input;
    
    if (!address || typeof address !== 'string') {
      return 'Address is required and must be a string';
    }
    
    if (!coordinates || typeof coordinates !== 'object') {
      return 'Coordinates are required and must be an object';
    }
    
    if (typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
      return 'Latitude and longitude must be numbers';
    }
    
    return null; // No validation errors
  };