import {
  HugeiconsIcon
} from "@hugeicons/react";
import {
  SchoolBusIcon,
  StudentsIcon,
  UserGroup03Icon,
  ValidationApprovalIcon,
} from "@hugeicons-pro/core-stroke-standard";
import DetailCard from "./StatsCard";
import { ModalContainerUpdated } from "../../../../Components/Common";
import PendingRequestsModal from "./PendingRequestsModal";
import { useEffect, useMemo, useState } from "react";
import TransportOptModal from "./TransportOptModal";
import TotalStudentsAvailingModal from "./TotalStudentsAvailingModal";
import ActiveVehiclesModal from "./ActiveVehiclesModal";
import { getTransportDashboardStatsAct } from "../../../../store/transportation/transportationaction";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { transformApiResponseToCardData } from "./helper";

const Statistics = (props: any) => {
  const { academicYearId, branchIdState } = props || {}

  const dispatch = useAppDispatch();

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    academicYearListResp, getTransportDashboardStatsResp
  } = useAppSelector(
    ({ instAcademics, appData, transportrequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getTransportDashboardStatsResp: transportrequest.getTransportDashboardStatsResp

    }),
    shallowEqual
  );

  const transportDashboardStatsApiCall = (otherProps?: any) => {
    let payload = {
      branchId: branchIdState,
      instituteId,
      academicYearId,
      ...otherProps,
    };
    dispatch(getTransportDashboardStatsAct(generateActionPayload('transport_dashboard_stats', undefined, payload)))
  }

  const [modalStates, setModalStates] = useState({
    activeVehiclesModal: false,
    totalStudentsAvailingModal: false,
    transportOptModal: false,
    pendingRequestsModal: false,
  });

  useEffect(() => {
    if(instituteId && academicYearId){
      transportDashboardStatsApiCall();
    }
  }, [instituteId, branchIdState, academicYearId]);

  const cardData = useMemo(() => {
    if (getTransportDashboardStatsResp) {
      return transformApiResponseToCardData(getTransportDashboardStatsResp);
    }
    return [];
  }, [getTransportDashboardStatsResp])

  const openModal = (modalId: string) => {
    setModalStates((prev) => ({ ...prev, [modalId]: true }));
  };

  const closeModal = (modalId: string) => {
    setModalStates((prev) => ({ ...prev, [modalId]: false }));
  };

  return (
    <>
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 transports-statistics-container">
        {cardData?.map((item: any, index: number) => (
          <DetailCard
            key={index}
            cardTitle={item.cardTitle}
            cardCount={item.cardCount}
            iconBgColor={item.iconBgColor}
            iconColor={item.iconColor}
            cardIcon={item.cardIcon}
            bgColor={item.bgColor}
            subTextOne={item.subTextOne}
            subTextTwo={item.subTextTwo}
            subTextThree={item.subTextThree}
            subCountOne={item.subCountOne}
            subCountTwo={item.subCountTwo}
            subCountThree={item.subCountThree}
            overlayColor={item.overlayColor}
            overlayChildColor={item.overlayChildColor}
            openModal={() => openModal(item.id)}
            branchIdState={branchIdState}
          ></DetailCard>
        ))}
      </div>

      <ModalContainerUpdated
        id="activeVehiclesModal"
        isOpen={modalStates.activeVehiclesModal}
        toggle={() => closeModal("activeVehiclesModal")}
        modalTitle="Active Vehicles"
        modalSize="lg"
      >
        <ActiveVehiclesModal
          toggle={() => closeModal("activeVehiclesModal")}
          {...props}
        ></ActiveVehiclesModal>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="totalStudentsAvailingModal"
        isOpen={modalStates.totalStudentsAvailingModal}
        toggle={() => closeModal("totalStudentsAvailingModal")}
        modalTitle="Students Availing"
        modalSize="lg"
      >
        <TotalStudentsAvailingModal
          toggle={() => closeModal("totalStudentsAvailingModal")}
          {...props}
        ></TotalStudentsAvailingModal>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="transportOptModal"
        isOpen={modalStates.transportOptModal}
        toggle={() => closeModal("transportOptModal")}
        modalTitle="Transport Opted"
        modalSize="lg"
      >
        <TransportOptModal
          toggle={() => closeModal("transportOptModal")}
          {...props}
        ></TransportOptModal>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="pendingRequestsModal"
        isOpen={modalStates.pendingRequestsModal}
        toggle={() => closeModal("pendingRequestsModal")}
        modalTitle="Pending Requests"
        modalSize="lg"
      >
        <PendingRequestsModal
          toggle={() => closeModal("pendingRequestsModal")}
          {...props}
        ></PendingRequestsModal>
      </ModalContainerUpdated>
    </>
  );
};

export default Statistics;
