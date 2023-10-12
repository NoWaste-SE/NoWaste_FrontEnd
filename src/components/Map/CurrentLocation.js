import * as React from 'react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './Map.css';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { Map, MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import GeoSearchField from './GeoSearch';
import {geolocated} from 'react-geolocated';

const DEFAULT_LANG = -123;
const DEFAULT_Lat = 48;

class CurrentLocation extends React.Component {
    render(){
        const lang = this.this.props.coords? this.props.langitude: DEFAULT_LANG;
        const lat = this.this.props.coords? this.props.latitude: DEFAULT_Lat;
    
        return (
            <Map center={[DEFAULT_Lat, DEFAULT_LANG]}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />  
                {
                    !this.props.coords?
                    <div className='loading-location'>
                        Loading
                    </div>
                    :
                    <Marker position={[DEFAULT_Lat, DEFAULT_LANG]}>
                        <Popup>
                            You are Here!
                        </Popup>
                    </Marker>
                }      
            </Map>
        );
    }
    }


export default geolocated ({
    positionOptions: {
        enableHighAccuracy: false
    },
    userDesicionTimeout: 10000
})(CurrentLocation)