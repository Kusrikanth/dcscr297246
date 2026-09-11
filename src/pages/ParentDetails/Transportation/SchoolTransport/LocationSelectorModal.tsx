// @ts-nocheck 
import React, { useEffect, useRef, useState } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { latLongToPlace } from "../../../../utility/mapUtility";
import { TextInput } from "../../Components/Common";
import { formatDate } from "react-calendar/dist/cjs/shared/dateFormatter";
import Button from "../../../../Components/Common/Button";

export default function LocationSelectorModal({ isOpen, selectedLocation, toggle }: any) {
    const mapDivRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const inputRef = useRef(null);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [markerState, setMarkerState] = useState({
        lat: selectedLocation?.latitude || "17.4403",
        long: selectedLocation?.longitude || "78.5559"
    })
    // const [markerState, setMarkerState] = useState({
    //     lat: "17.4403",
    //     long: "78.5559"
    // })

    useEffect(() => {
        if (isOpen) {
            loadMapHndlr();
        }
    }, [selectedLocation, isOpen]);


    async function loadMapHndlr() {
        try {
            const loader = new Loader({
                apiKey: import.meta.env.VITE_MAP_KEY, // Replace with your actual API key
                version: 'weekly', // Optional - you can specify the version of the API
                libraries: ['places']
            });

            await loader.importLibrary('maps');
            const centerLat = selectedLocation?.latitude || "17.4403",
                centerLong = selectedLocation?.longitude || "78.5559";
            const mapCenter = {
                lat: parseFloat(centerLat),
                lng: parseFloat(centerLong)
            };
            mapDivRef.current = new window.google.maps.Map(mapDivRef.current, {
                center: mapCenter,
                zoom: 14
            });

            const position = new window.google.maps.LatLng(
                parseFloat(centerLat),
                parseFloat(centerLong)
            );
            markerRef.current = new window.google.maps.Marker({
                position: position,
                id: 'start-marker',
                map: mapDivRef.current,
            });
            const options = {
                componentRestrictions: { country: "in" },
                fields: ["formatted_address", "geometry", "name"],
                strictBounds: false,
            };
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, options);
            let address = selectedLocation?.address || "";
            if (!address) {
                address = await latLongToPlace(centerLat, centerLong);
            }
            inputRef.current.value = address;
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry.viewport || place.geometry.location) {
                    // do something
                    const { formatted_address } = place,
                        latitude = place.geometry.location.lat(),
                        longitude = place.geometry.location.lng();
                    mapDivRef.current.setCenter({
                        lat: Number(latitude),
                        lng: Number(longitude)
                    })
                    const newLatLng = new google.maps.LatLng(latitude, longitude);
                    markerRef.current.setPosition(newLatLng);
                    setSelectedAddress(formatted_address);
                    setMarkerState((prev) => ({ ...prev, lat: latitude, long: longitude }));
                }
            })

            window.google.maps.event.addListener(mapDivRef.current, 'click', async function (event) {
                const latitude = event.latLng.lat();
                const longitude = event.latLng.lng();
                const newLatLng = new google.maps.LatLng(latitude, longitude);
                markerRef.current.setPosition(newLatLng);
                const address = await latLongToPlace(latitude, longitude);
                if (address) {
                    setSelectedAddress(address);
                    inputRef.current.value = address;
                    setMarkerState((prev) => ({ ...prev, lat: latitude, long: longitude }));
                }
            })

        } catch (e) {
            console.log(e)
        }
    }

    async function confirmLocationHndlr() {
        const { lat, long } = markerState;
        // const address = await latLongToPlace(lat, long);
        toggle(selectedAddress, lat, long);
    }

    return (
        <>
            <div className="tw-p-0">
                <div className="tw-p-3">
                    <div className="tw-relative tw-mb-0">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search Address..."
                            className="tw-w-full tw-border tw-border-gray-300 tw-rounded tw-px-3 tw-py-2 tw-pr-10 focus:tw-outline-none focus:tw-border-blue-400 tw-mb-0"
                        />
                        <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                    {/* <div className="d-flex">
                        <label className="form-label me-3 mb-0 text-nowrap">
                            Selected Address:
                        </label>
                        <span>
                            {selectedAddress || '-'}
                        </span>
                    </div> */}
                </div>

                <div ref={mapDivRef} id="mapDiv" style={{ width: '100%', height: '350px' }} />
            </div>

            <div className="tw-py-3 tw-px-3 tw-border-t tw-border-gray-200">
                <div className="tw-flex tw-justify-end">
                    <Button
                        type="button"
                        disabled={!selectedAddress}
                        onClick={confirmLocationHndlr}
                        variant="primary"
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </>

    )
}