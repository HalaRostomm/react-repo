import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import userservice from "../service/userservice";
import VetHeroImage from "../assets/Veterinary-Staff-Practice-Well-Being.png";

// Fix leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Haversine function
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const doctorIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const UrgentDrList = ({ token }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [addresses, setAddresses] = useState({});

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser");
      setUserLocation([0, 0]);
      setLoading(false);
      return;
    }
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (err) => {
        console.error(err);
        setLocationError("Unable to retrieve your location.");
        setUserLocation([0, 0]);
      }
    );
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    async function fetchDoctors() {
      setLoading(true);
      try {
        const savedToken = token || localStorage.getItem("jwtToken");
        if (!savedToken) {
          alert("No token found");
          setLoading(false);
          return;
        }

        const res = await userservice.getUrgentCasesDoctors();
        const data = res.data;

        data.sort((a, b) => {
          const [latA, lngA] = a.address.split(",").map(Number);
          const [latB, lngB] = b.address.split(",").map(Number);
          const distA = getDistanceFromLatLonInKm(userLocation[0], userLocation[1], latA, lngA);
          const distB = getDistanceFromLatLonInKm(userLocation[0], userLocation[1], latB, lngB);
          return distA - distB;
        });

        setDoctors(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [userLocation, token]);

  async function reverseGeocode(lat, lng) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed reverse geocode");
      const json = await res.json();
      return json.display_name || "Unknown location";
    } catch {
      return "Location not found";
    }
  }

  useEffect(() => {
    async function fetchAddresses() {
      const newAddresses = {};
      await Promise.all(
        doctors.map(async (doc) => {
          const [lat, lng] = doc.address.split(",").map(Number);
          newAddresses[doc.id || doc.firstname + doc.lastname] = await reverseGeocode(lat, lng);
        })
      );
      setAddresses(newAddresses);
    }
    if (doctors.length > 0) fetchAddresses();
  }, [doctors]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        {locationError ? locationError : "Loading..."}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tinos&display=swap');
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Tinos', serif;
          background-color: #E5E5E5;
          height: 100%;
        }
        .layout {
          display: flex;
          min-height: 100vh;
          overflow: hidden;
        }
        .left-content {
          background-color: #ffffff;
          flex: 1 1 50%;
          padding: 3rem 2rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .right-background {
          flex: 1 1 50%;
          background-image: url(${VetHeroImage});
          background-size: cover;
          background-position: left center;
          background-repeat: no-repeat;
        }
        h1 {
          font-size: 2rem;
          color: #14213D;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }
        .leaflet-container {
          border-radius: 12px;
          border: 2px solid #FCA311;
          margin-bottom: 1.5rem;
            z-index: 0;
            position: relative;
        }
        .doctor-card {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 12px;
          background-color: #FFFFFF;
          border-left: 5px solid #FCA311;
          transition: transform 0.2s ease;
        }
        .doctor-card:hover {
          transform: translateY(-3px);
        }
        .doctor-card h2 {
          margin: 0;
          font-size: 1.3rem;
          color: #14213D;
          font-weight: bold;
        }
        .doctor-card p {
          margin: 6px 0;
          font-weight: bold;
          color: #000000;
        }
        @media (max-width: 768px) {
          .layout {
            flex-direction: column;
          }
          .left-content, .right-background {
            flex: 1 1 100%;
            min-height: 50vh;
          }
          .left-content {
            padding: 2rem 1rem;
          }
        }
      `}</style>

      <div className="layout">
        <div className="left-content">
          <h1>We've Got You! Don’t worry</h1>
          <div style={{ height: 250 }}>
            {userLocation && (
              <MapContainer
                center={
                  doctors.length > 0
                    ? (() => {
                        const [lat, lng] = doctors[0].address.split(",").map(Number);
                        return [lat, lng];
                      })()
                    : [0, 0]
                }
                zoom={12}
                className="leaflet-container"
                style={{ height: "250px", width: "100%" }}
              >
                <ChangeMapView
                  center={
                    doctors.length > 0
                      ? (() => {
                          const [lat, lng] = doctors[0].address.split(",").map(Number);
                          return [lat, lng];
                        })()
                      : [0, 0]
                  }
                  zoom={12}
                />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={userLocation}>
                  <Popup>Your Location</Popup>
                </Marker>
                {doctors.map((doc) => {
                  const [lat, lng] = doc.address.split(",").map(Number);
                  const docKey = doc.id || doc.firstname + doc.lastname;
                  const address = addresses[docKey] || "Loading location...";
                  return (
                    <Marker key={docKey} position={[lat, lng]} icon={doctorIcon}>
                      <Popup>
                        <strong>{doc.firstname} {doc.lastname}</strong><br />
                        Phone: {doc.phone}<br />
                        {address}
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
          </div>

          <div>
            {doctors.map((doc) => {
              const docKey = doc.id || doc.firstname + doc.lastname;
              const address = addresses[docKey] || "Loading location...";
              return (
                <div key={docKey} className="doctor-card">
                  <h2>{doc.firstname} {doc.lastname}</h2>
                  <p>Phone: {doc.phone}</p>
                  <p>{address}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="right-background" />
      </div>
    </>
  );
};

export default UrgentDrList;
