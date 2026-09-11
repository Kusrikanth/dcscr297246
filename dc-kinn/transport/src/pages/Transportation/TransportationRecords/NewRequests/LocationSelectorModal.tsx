// @ts-nocheck 
import React, { useEffect, useRef, useState } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { useHistory } from "react-router-dom";
import Button from "../../../../Components/Common/Button";

export default function LocationSelectorModal({ latitude,longitude,modalData,toggle,showApiLoader }: any) {

    const history = useHistory()
    const mapDivRef = useRef<any>(null);

    useEffect(() => {
        loadMapHndlr();
    }, []);

    async function loadMapHndlr() {
        try {
            const loader = new Loader({
                apiKey: import.meta.env.VITE_MAP_KEY, // Replace with your actual API key
                version: 'weekly', // Optional - you can specify the version of the API
            });

            await loader.importLibrary('maps');
            const mapCenter = {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude)
            };
            mapDivRef.current = new window.google.maps.Map(mapDivRef.current, {
                center: mapCenter,
                zoom: 10
            });

            const position = new window.google.maps.LatLng(
                parseFloat(latitude),
                parseFloat(longitude)
            );
            const marker = new window.google.maps.Marker({
                position: position,
                id: 'start-marker',
                map: mapDivRef.current,
            });

            // window.google.maps.event.addListener(mapDivRef.current, 'click', function (event) {
            //     var latitude = event.latLng.lat();
            //     var longitude = event.latLng.lng();
            //     var newLatLng = new google.maps.LatLng(latitude, longitude);
            //     marker.setPosition(newLatLng);
            //     setMarkerState((prev) => ({ ...prev, lat: latitude, long: longitude }));
            // })

        } catch (e) {
            console.log(e)
        }
    }

    const submitHndler = ()=>{
        history.push(`/create-new-request/${modalData?.requestId}`);
    }

    return (
        <>
            <div className="tw-p-4">
                <div className="tw-mb-4">
                    <span className="tw-font-bold">Address</span> : {modalData?.address}
                </div>

                <div
                    ref={mapDivRef}
                    id="mapDiv"
                    className="tw-w-full"
                    style={{ height: '400px' }}
                ></div>

                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-flex tw-w-auto tw-ml-auto tw-mt-4 tw-gap-3">
                        {modalData?.transportRequestStatus?.toLowerCase() === "pending" && (
                            <Button
                                variant="primary"
                                type="submit"
                                onClick={submitHndler}
                                disabled={showApiLoader}
                            >
                                Approve
                            </Button>
                        )}

                        <Button
                            variant="secondary"
                            type="submit"
                            onClick={toggle}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        
        </>

    )
}