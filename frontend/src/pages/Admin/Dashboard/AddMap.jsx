import React, { useState } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "./AddMap.scss";

const AddMap = (props) => {
  const [address, setAddress] = useState("");
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState({});
  const [selectedPlace, setSelectedPlace] = useState({});

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    setAddress(address);
    let formatted_address = "";
    geocodeByAddress(address)
      .then((results) => {
        formatted_address = results[0].formatted_address;
        return getLatLng(results[0]);
      })
      .then((latLng) => {
        console.log("Success", { ...latLng, formatted_address });

        // update end same as start loc
        if (props.showMap === "startLoc") {
          props.setEndGarageLocation({ ...latLng, formatted_address });
        }
        props.setMapCenter({ ...latLng, formatted_address });
      })
      .catch((error) => console.error("Error", error));
  };

  const handleMapClick = (mapProps, map, event) => {
    const { latLng } = event;

    const lat = latLng.lat();
    const lng = latLng.lng();

    // if (props.showMap === "startLoc") {
    //   props.setEndGarageLocation({ lat, lng });
    // }
    // props.setMapCenter({ lat, lng });

    const geocoder = new props.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK") {
        const place = results[0];

        if (props.showMap === "startLoc") {
          props.setEndGarageLocation({
            lat,
            lng,
            formatted_address: place.formatted_address,
          });
        }
        props.setMapCenter({
          lat,
          lng,
          formatted_address: place.formatted_address,
        });
      }
    });
    console.log(mapProps, map, event);
  };

  return (
    <div id="googleMaps">
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <>
            <div className="map-search-bar">
              <input
                {...getInputProps({
                  placeholder: "Search Places ...",
                  className: "location-search-input",
                })}
                // className="custom-form-field"
              />
            </div>
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item suggestion-item--active"
                  : "suggestion-item";

                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </PlacesAutocomplete>

      <Map
        google={props.google}
        initialCenter={{
          lat: props.mapCenter.lat,
          lng: props.mapCenter.lng,
        }}
        onClick={handleMapClick}
        center={{
          lat: props.mapCenter.lat,
          lng: props.mapCenter.lng,
        }}
        zoom={15}
        style={{
          position: "absolute",
          width: "95%",
          height: "90%",
          left: "6px",
          bottom: "8px",
        }}
      >
        <Marker
          position={{
            lat: props.mapCenter.lat,
            lng: props.mapCenter.lng,
          }}
        />
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAP_PLACE_API,
})(AddMap);

// import React, { useEffect, useRef } from "react";

// const AddMap = () => {
//   const mapRef = useRef(null);
//   const inputRef = useRef(null);
//   const infowindowContentRef = useRef(null);
//   const markerRef = useRef(null);

//   useEffect(() => {
//     const { google } = window;
//     const map = new google.maps.Map(mapRef.current, {
//       center: { lat: -33.8688, lng: 151.2195 },
//       zoom: 13,
//     });
//     const input = inputRef.current;
//     // Specify just the place data fields that you need.
//     const autocomplete = new google.maps.places.Autocomplete(input, {
//       fields: ["place_id", "geometry", "formatted_address", "name"],
//     });

//     autocomplete.bindTo("bounds", map);
//     map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

//     const infowindow = new google.maps.InfoWindow();
//     const infowindowContent = infowindowContentRef.current;

//     infowindow.setContent(infowindowContent);

//     const marker = new google.maps.Marker({ map: map });

//     marker.addListener("click", () => {
//       infowindow.open(map, marker);
//     });
//     autocomplete.addListener("place_changed", () => {
//       infowindow.close();

//       const place = autocomplete.getPlace();

//       if (!place.geometry || !place.geometry.location) {
//         return;
//       }

//       if (place.geometry.viewport) {
//         map.fitBounds(place.geometry.viewport);
//       } else {
//         map.setCenter(place.geometry.location);
//         map.setZoom(17);
//       }

//       // Set the position of the marker using the place ID and location.
//       // @ts-ignore This should be in @typings/googlemaps.
//       marker.setPlace({
//         placeId: place.place_id,
//         location: place.geometry.location,
//       });
//       marker.setVisible(true);
//       infowindowContent.children.namedItem("place-name").textContent =
//         place.name;
//       infowindowContent.children.namedItem("place-id").textContent =
//         place.place_id;
//       infowindowContent.children.namedItem("place-address").textContent =
//         place.formatted_address;
//       infowindow.open(map, marker);
//     });
//   }, []);

//   return (
//     <div>
//       <input type="text" id="pac-input" ref={inputRef} />
//       <div ref={mapRef} style={{ height: "400px" }}></div>
//       <div id="infowindow-content" ref={infowindowContentRef}>
//         <p id="place-name"></p>
//         <p id="place-id"></p>
//         <p id="place-address"></p>
//       </div>
//     </div>
//   );
// };

// export default AddMap;
