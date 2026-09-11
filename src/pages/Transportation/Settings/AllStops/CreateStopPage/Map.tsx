// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { latLongToPlace } from "../../../../../utility/mapUtility";
import { ConfirmationModal } from "../../../../../Components/Common";
import { nanoid } from "nanoid";
import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import Button from "../../../../../Components/Common/Button";

export default function LocationSelectorModal({ branchId, selectedLocation, selectedStops, setSelectedStops, routeId, showApiLoader }: any) {
    const mapDivRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const inputRef = useRef(null);

    const [selectedAddress, setSelectedAddress] = useState("Hyderabad");
    const [markerState, setMarkerState] = useState({
        lat: selectedLocation?.latitude || "17.4065",
        long: selectedLocation?.longitude || "78.4772"
    })
    const mapRef = useRef<any>(null);
    const stopMarkersListRef = useRef<any>([]);
    const polylineRef = useRef<any>(null);

    const [confirmModal, setConfirmModal] = useState<any>({
        showModal: false,
    })

    const { branchListResp }: any = useAppSelector(({ branch }) => ({
        branchListResp: branch.branchListResp
    }), shallowEqual);




    const toggleConfirmModal = () => {
        setConfirmModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };

    useEffect(() => {
        if (mapRef.current) {
            const { latitude, longitude, address } = branchListResp?.data?.find(item => item.branchId?.toString() === branchId?.toString()) || {};
            if (latitude && longitude) {
                const image = {
                    url: "/school_svg.svg",
                    anchor: new window.google.maps.Point(20, 46),
                };
                const markerPosition = new window.google.maps.LatLng(
                    parseFloat(latitude),
                    parseFloat(longitude),
                );
                new window.google.maps.Marker({
                    icon: image,
                    position: markerPosition,
                    id: `branch-location`,
                    map: mapRef.current,
                });
                mapRef.current.setCenter({
                    lat: Number(latitude),
                    lng: Number(longitude)
                })
                inputRef.current.value = address;
                setSelectedAddress(address);
                markerRef.current.setPosition(markerPosition);
            }
        }
    }, [branchId, branchListResp, mapRef.current]);

    useEffect(() => {
        loadMapHandler();
    }, []);

    useEffect(() => {
        if (mapRef.current && Array.isArray(selectedStops) && selectedStops) {
            generateStopPath(selectedStops);
        }
    }, [selectedStops, mapRef.current]);

    async function loadMapHandler() {
        try {
            const loader = new Loader({
                apiKey: import.meta.env.VITE_MAP_KEY, // Replace with your actual API key
                version: 'weekly', // Optional - you can specify the version of the API
                libraries: ['places', 'weekly']
            });

            await loader.importLibrary('maps');
            const centerLat = selectedLocation?.latitude || "17.4065",
                centerLong = selectedLocation?.longitude || "78.4772";
            const mapCenter = {
                lat: parseFloat(centerLat),
                lng: parseFloat(centerLong)
            };
            mapRef.current = new window.google.maps.Map(mapDivRef.current, {
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
                map: mapRef.current,
            });
            const options = {
                componentRestrictions: { country: "in" },
                fields: ["formatted_address", "geometry", "name"],
                strictBounds: false,
            };
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, options);
            // let address = selectedLocation?.address || "";
            // if (!address) {
            //     address = await latLongToPlace(centerLat, centerLong);
            // }
            // inputRef.current.value = address;
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry.viewport || place.geometry.location) {
                    // do something
                    const { formatted_address } = place,
                        latitude = place.geometry.location.lat(),
                        longitude = place.geometry.location.lng();
                    mapRef.current.setCenter({
                        lat: Number(latitude),
                        lng: Number(longitude)
                    })
                    const newLatLng = new google.maps.LatLng(latitude, longitude);
                    markerRef.current.setPosition(newLatLng);
                    setSelectedAddress(formatted_address);
                    setMarkerState((prev) => ({ ...prev, lat: latitude, long: longitude }));
                }
            })

            window.google.maps.event.addListener(mapRef.current, 'click', async function (event) {
                const latitude = event.latLng.lat();
                const longitude = event.latLng.lng();
                const newLatLng = new google.maps.LatLng(latitude, longitude);
                markerRef.current.setPosition(newLatLng);
                const address = await latLongToPlace(latitude, longitude);
                setSelectedAddress(address);
                inputRef.current.value = address;
                setMarkerState((prev) => ({ ...prev, lat: latitude, long: longitude }));
            })

        } catch (e) {
            console.log(e)
        }
    }

    const searchLocationHandler = async () => {
        const address = inputRef.current.value;
        if (address) {
            const location = await geocodeAddress(address);
            if (location) {
                const { lat, lng } = location.geometry.location;
                setMarkerState((prev) => ({ ...prev, lat: lat(), long: lng() }));
                mapDivRef.current.panTo(location.geometry.location);
            }
        }
    };

    async function generateStopPath(stopsList) {
        const validPathArray = [];
        const existingMarkersList = stopMarkersListRef.current;
        existingMarkersList.forEach(marker => {
            marker.setMap(null); // Remove the marker from the map
        });
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
        }
        stopMarkersListRef.current = [];
        polylineRef.current = null;
        let stopIndex = 0;
        for (let i = 0; i < stopsList.length; i++) {
            const { latitude, longitude, isDeleted } = stopsList[i];
            if (latitude && longitude && !isDeleted) {
                stopIndex += 1;
                validPathArray.push({
                    lat: Number(latitude),
                    lng: Number(longitude)
                });
                const markerPosition = new window.google.maps.LatLng(
                    parseFloat(latitude),
                    parseFloat(longitude),
                );

                const image = {
                    url: "/marker_icon.svg",
                    anchor: new window.google.maps.Point(15, 30),
                    labelOrigin: new google.maps.Point(14, 9)
                };

                const stopMarker = new window.google.maps.Marker({
                    position: markerPosition,
                    icon: image,
                    id: `start-marker-${stopIndex}`,
                    map: mapRef.current,
                    label: {
                        color: '#ffffff', fontWeight: 'bold', fontSize: '12px', text: `${stopIndex}`,
                    }
                });
                stopMarkersListRef.current.push(stopMarker);
            }
        }
        polylineRef.current = new window.google.maps.Polyline({
            path: validPathArray,
            strokeColor: "#109DF6",
            strokeWeight: 4
        });
        polylineRef.current.setMap(mapRef.current);
    }

    const addStopsHndler = () => {
        const uniqueId = nanoid()
        // stopOrderSeq
        let stopSeqNo = 0;
        for (let i = 0; i < selectedStops.length; i++) {
            const { stopOrderSeq, isDeleted } = selectedStops[i];
            if (!isDeleted) {
                stopSeqNo = stopOrderSeq;
            }
        }
        const newData = {
            stopName: selectedAddress,
            latitude: markerState.lat,
            longitude: markerState.long,
            stopId: uniqueId,
            isDeleted: false,
            stopOrderSeq: stopSeqNo + 1
        };

        setSelectedStops([...selectedStops, newData]);

        setConfirmModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    }

    return (
        <>
            <div className="tw-p-3">
                <div className="tw-mb-3 tw-flex">
                    <input
                        type="text"
                        ref={inputRef}
                        placeholder="Search location..."
                        className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-l-md tw-px-3 tw-py-2 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-green-500"
                    />

                    <Button
                        type="button"
                        onClick={toggleConfirmModal}
                        disabled={!routeId}
                        variant="primary"
                    >
                        Add
                    </Button>
                </div>

                <div
                    ref={mapDivRef}
                    id="mapDiv"
                    className="tw-mt-3 tw-w-full tw-h-[550px]"
                />
            </div>
            <ConfirmationModal
                id="add-new-stops-confirmation-modal"
                isOpen={confirmModal.showModal}
                confirmMessage="This stop will be added to the list of stops."
                cancelHndlr={toggleConfirmModal}
                confirmHndlr={addStopsHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />
        </>
    );
}
