import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { Button } from '@material-ui/core';
import { Alert, AlertTitle } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

function Map(props) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [lat, setLat] = useState(props.location[0] || 35.6892);
  const [lng, setLng] = useState(props.location[1] || 51.3890);
  const id = props.location[2];
  const type = props.location[3];
  const token = localStorage.getItem('token');
  const [open, setOpen] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [openNetwork, setOpenNetwork] = useState(null);

  const handleClose = () => {
      setOpen(false);
  }

  const handleCloseNetwork = () => {
      setOpenNetwork(false);
  }
  useEffect(() => {
      if(alertMessage !== "" && alertSeverity !== ""){
          if(alertSeverity === "success"){
              toast.success(alertMessage, {
                          position: toast.POSITION.TOP_CENTER,
                          title: "Success",
                          autoClose: 7000,
                          pauseOnHover: true,
                      });
          } else {
              toast.error(alertMessage, {
                          position: toast.POSITION.TOP_CENTER,
                          title: "Error",
                          autoClose: 3000,
                          pauseOnHover: true
                      });
          }
          setAlertMessage("");
          setAlertSeverity("");
      }
  }, [alertMessage, alertSeverity]);

  const handleSaveClick = () => {
      if (markerRef.current) {
          const { lat, lng } = markerRef.current.getLatLng();
          setLat(lat);
          setLng(lng);
          const userData = {
              lat: lat,
              lon: lng
          };

        const url = type === "customer"
            ? `http://188.121.124.63:8000/user/${id}/lat_long/`
            : `http://188.121.124.63:8000/restaurant/${id}/lat_long`;
        if(type === "customer") {
            axios.patch(
                url, 
                userData, 
                {headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PATCH',
                    'Authorization': 'Bearer ' + token?.slice(1, -1)
                }}
            )
            .then((response) => {
                setAlertMessage("Location saved successfully.");
                setAlertSeverity("success");
            })
            .catch((error) => {
                setAlertMessage("An error occured. Please try agian later.");
                setAlertSeverity("error");
                if (error.response) {
                    console.log(error.response);
                }
            });
        } else {
          axios.put(
              url, 
              userData, 
              {headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET,PUT',
                  'Authorization': 'Token ' + token?.slice(1, -1)
              }}
          )
          .then((response) => {
              console.log(response);
          })
          .catch((error) => {
              if (error.response) {
                  console.log(error.response);
              }
          });
        }
      }
  };

  useEffect(() => {
      const map = L.map(mapRef.current).setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current = marker;

      marker.on('dragend', (event) => {
          const { lat, lng } = event.target.getLatLng();
      });

      return () => {
          map.remove();
      };
  }, [lat, lng]);

  return (
    <div 
        className="map-container"
    >
      <div>
        <ToastContainer />
      </div>
      <div 
          ref={mapRef} 
          className="leaflet-container" 
      />
      <div 
          className="edit-location-button"
      >
        <Button 
            className='confirm-btn' 
            onClick={handleSaveClick}
        >
            Confirm
        </Button>
      </div>
      {open && 
          <Alert 
              severity="error" 
              open={open} 
              onClose={handleClose} 
              className="alert-error" 
              variant="outlined"
          > 
              An error occurde!
          </Alert>}
      {openNetwork && 
          <Alert 
              severity="error" 
              open={openNetwork} 
              onClose={handleCloseNetwork} 
              variant="outlined" 
              className="alert-error"
          > 
              Network error! 
          </Alert>} 
    </div>
  );
}

export default Map;