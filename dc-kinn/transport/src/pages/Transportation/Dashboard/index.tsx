import React, { useEffect, useRef } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TransportStatistics from "./Statistics";
import TransportMap from "./TransportMap";
import TransportAllRoutes from "./TransportAllRoutes";
import VehicleCategory from "./VehicleCategory";
import TransportFeeCollection from "./TransportFeeCollection";
import Iframe from "./TransportMap/Iframes";
import TransportExpiry from "./TransportExpiry";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

const TransportationDashBoard = () => {

   const { 
      transportationErrorAct,
    } = useAppSelector(
      ({ transportrequest }) => ({
        transportationErrorAct:transportrequest.transportationErrorAct,
      }),
      shallowEqual
    );

    const dashboardRef = useRef({
      prevTransportationErrorAct: transportationErrorAct,
    });

    useEffect(() => {
      const {  prevTransportationErrorAct } = dashboardRef.current;
      if(transportationErrorAct && prevTransportationErrorAct !== transportationErrorAct) {
        const {details} = transportationErrorAct || {}
        toast.error(details || "Something went wrong. Please try again.")
      }
      dashboardRef.current.prevTransportationErrorAct = transportationErrorAct;
    }, [transportationErrorAct]);


  return (
    <>
      <div className="page-content transportaion_dashboard_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Dashboard" pageTitle="Transportation" />

          <div className="tw-w-full">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

              <div className="tw-col-span-12">
                <TransportStatistics />
              </div>

              <div className="tw-col-span-12 xl:tw-col-span-7 ">
                <TransportAllRoutes />
              </div>

              <div className="tw-col-span-12 xl:tw-col-span-5 tw-grid">
                <VehicleCategory />
              </div>

              <div className="tw-col-span-12 xl:tw-col-span-4 tw-grid">
                <TransportFeeCollection />
              </div>

              <div className="tw-col-span-12 xl:tw-col-span-8 tw-grid">
                <TransportExpiry />
              </div>

              <div className="tw-col-span-12">
                <TransportMap />
              </div>

              <div className="tw-col-span-12">
                <Iframe />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransportationDashBoard;
