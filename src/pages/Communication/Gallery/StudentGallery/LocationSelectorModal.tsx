// @ts-nocheck 
import React, { useEffect, useRef, useState } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { useHistory } from "react-router-dom";
import { latLongToPlace } from "../../../../utility/mapUtility";
import Button from "../../../../Components/Common/Button";

export default function LocationSelectorModal({ latitude,longitude,modalData,isOpen,selectedLocation,toggle,showApiLoader}: any) {

    const history = useHistory()
    const mapDivRef = useRef(null);
    const markerRef = useRef(null);
    const inputRef = useRef(null);

    const [selectedAddress, setSelectedAddress] = useState("");
    const [markerState, setMarkerState] = useState({
        lat: selectedLocation?.lat || latitude || "17.4403",
        long: selectedLocation?.long || longitude || "78.5559"
    });

    useEffect(() => {
        if (isOpen || latitude || longitude) {
            loadMapHndlr();
        }
    }, [selectedLocation, isOpen, latitude, longitude]);

    async function loadMapHndlr() {
        try {
            const loader = new Loader({
                apiKey: import.meta.env.VITE_MAP_KEY,
                version: 'weekly',
                libraries: ['places']
            });

            await loader.importLibrary('maps');
            const mapCenter = {
                lat: parseFloat(markerState.lat),
                lng: parseFloat(markerState.long)
            };
            mapDivRef.current = new window.google.maps.Map(mapDivRef.current, {
                center: mapCenter,
                zoom: 14
            });

            // Add Marker
            const position = new window.google.maps.LatLng(mapCenter.lat, mapCenter.lng);
            markerRef.current = new window.google.maps.Marker({
                position: position,
                id: 'start-marker',
                map: mapDivRef.current,
            });

            if (isOpen) {
                initializeAutocomplete(mapCenter);
                addMapClickListener();
            }
        } catch (e) {
            console.error("Error loading map:", e);
        }
    }

    function initializeAutocomplete(mapCenter) {
        const options = {
            componentRestrictions: { country: "in" },
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
        };
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, options);

        inputRef.current.value = selectedLocation?.address || "";
        if (!inputRef.current.value) {
            latLongToPlace(mapCenter.lat, mapCenter.lng).then(address => {
                inputRef.current.value = address;
            });
        }

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const { formatted_address, geometry: { location } } = place;
                const latitude = location.lat();
                const longitude = location.lng();

                setSelectedAddress(formatted_address);
                setMarkerState({ lat: latitude, long: longitude });
                mapDivRef.current.setCenter({ lat: latitude, lng: longitude });
                markerRef.current.setPosition(location);
            }
        });
    }

    function addMapClickListener() {
        window.google.maps.event.addListener(mapDivRef.current, 'click', async (event) => {
            const latitude = event.latLng.lat();
            const longitude = event.latLng.lng();
            const newLatLng = new google.maps.LatLng(latitude, longitude);

            markerRef.current.setPosition(newLatLng);
            const address = await latLongToPlace(latitude, longitude);

            setSelectedAddress(address);
            inputRef.current.value = address;
            setMarkerState({ lat: latitude, long: longitude });
        });
    }

    function confirmLocationHndlr() {
        const { lat, long } = markerState;
        toggle(selectedAddress, lat, long);
    }

    function submitHndler() {
        history.push(`/create-new-request/${modalData?.requestId}`);
    }

    return (
        <>
            <div className="tw-p-4">
                {isOpen ? (
                    <div className="tw-p-3">
                        <div className="tw-relative tw-mb-0">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search Address..."
                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded tw-py-2 tw-px-3 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-primary"
                            />
                            <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                        </div>
                    </div>
                ) : (
                    <div className="tw-mb-4">
                        <span className="tw-font-bold">Address</span> : {modalData?.location}
                    </div>
                )}

                <div
                    ref={mapDivRef}
                    id="mapDiv"
                    className="tw-w-full"
                    style={{ height: isOpen ? "350px" : "400px" }}
                />

                <div className="tw-flex tw-justify-end tw-gap-3 tw-pt-3 tw-px-3">
                    {isOpen ? (
                        <Button
                            type="button"
                            disabled={!selectedAddress}
                            onClick={confirmLocationHndlr}
                            isDisabled={selectedAddress}
                            variant="primary"
                            
                        >
                            Confirm
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={toggle}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}