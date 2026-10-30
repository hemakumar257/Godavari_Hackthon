import { useState, useCallback } from 'react';
import { UserLocation, Coordinates } from '../types/phase2';

export interface GeolocationState {
  location: UserLocation | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

// Calculate Haversine distance in kilometers between two points
export const calculateDistanceKm = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: false,
    permissionDenied: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser / మీ బ్రౌజర్ లొకేషన్‌ను సమర్థించదు.',
        permissionDenied: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          },
          error: null,
          loading: false,
          permissionDenied: false,
        });
      },
      (err) => {
        let msg = 'Unable to fetch your location.';
        let denied = false;
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location access was denied. You can still browse and search manually.';
          denied = true;
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out.';
        }

        setState({
          location: null,
          error: msg,
          loading: false,
          permissionDenied: denied,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const setManualLocation = useCallback((coords: Coordinates) => {
    setState({
      location: {
        lat: coords.lat,
        lng: coords.lng,
        accuracy: 100,
        timestamp: Date.now(),
      },
      error: null,
      loading: false,
      permissionDenied: false,
    });
  }, []);

  return {
    ...state,
    requestLocation,
    setManualLocation,
    calculateDistance: (dest: Coordinates) =>
      state.location ? calculateDistanceKm(state.location, dest) : undefined,
  };
};
