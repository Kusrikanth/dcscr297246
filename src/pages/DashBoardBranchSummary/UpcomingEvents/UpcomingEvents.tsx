import React, { useEffect, useMemo, useRef, useState } from 'react';
import UpdatedHorizontalTab from '../../../Components/Common/UpdatedHorizontalTab';
import UpcomingAnniversaries from './UpcomingAnniversaries';
import { default as Birthday } from "../../../assets/imagesdps/updatedDashboard/birthday.svg?react";
import { default as Anniversarie } from "../../../assets/imagesdps/updatedDashboard/workanniverery.svg?react";
import Birthdays from './Birthdays';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { generateActionPayload } from '../../../utility/reduxutility';
import { exportAStudentBirthdayReportAct, getBirthdayAnniversaryAct, getStudentBirthdayAct, resetBirthdayAnniversaryAct } from '../../../store/academic/academicRequest/academicrequestactions';
import { Button, ModalContainerUpdated } from '../../../Components/Common';
import { useModal } from '../../../hooks/modalhook';
import ExportModal from '../../Directory/StudentManagement/ExportModal';
import { toast } from 'react-toastify';
import { downloadExcelFile } from '../../../utility/commonutility';
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";

interface IMenuOptions {
    id: string;
    labelName: string;
    customPadding: string;
    Icon: any;
}

const initialValues = {
    user: "Student",
  };

const UpcomingEvents = () => {

    const [activeId, setActiveId] = useState<any>("birthdays");
    const [currentPageSizeState, setCurrentPageSizeState] = useState<any>(10);
    const [totalStudentCountState, setTotalStudentCountState] = useState(0);
    const [isLoadingState, setIsLoadingState] = useState(false);
    const [filterState, setFilterState] = useState(initialValues);
    const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();
  
    const dispatch = useAppDispatch();
    const birthdayAnniversaryApiCall = (otherProps?: any) => {
        const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
        const { pageSize, ...otherFilters } = otherProps || {};
        let payload = {
            branchId,
            isBirthday: activeId == "birthdays" ? true : false,
            ...otherFilters,
            pageNo: 0, pageSize: pageSize || currentPageSizeState,
        };
        if (activeId == "birthdays") {
            if (filterState.user == "Student") {
                payload.academicYearId = academicYearId
                if (branchId && payload.academicYearId) {
                    dispatch(getStudentBirthdayAct(generateActionPayload('get_student_birthday', undefined, payload)))
                }
            }
            else {
                dispatch(getBirthdayAnniversaryAct(generateActionPayload('get_birthday_anniversary', undefined, payload)))
            }
        }
        else{
            dispatch(getBirthdayAnniversaryAct(generateActionPayload('get_birthday_anniversary', undefined, payload)))
        }
    }


    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        getBirthdayAnniversaryResp,
        getStudentBirthdayResp,
        currentInstIdResp: instituteId,
        exportStudentBirthdayReportResp,
    } = useAppSelector(
        ({ instAcademics, appData, academicRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getBirthdayAnniversaryResp: academicRequest.getBirthdayAnniversaryResp,
            getStudentBirthdayResp: academicRequest.getStudentBirthdayResp,
            exportStudentBirthdayReportResp: academicRequest.exportStudentBirthdayReportResp
        }),
        shallowEqual
    );

    const studentBirthdayRef = useRef({
        prevExportStudentBirthdayReportResp: exportStudentBirthdayReportResp,
    })

    useEffect(() => {
        const { prevExportStudentBirthdayReportResp } = studentBirthdayRef.current;
        if (exportStudentBirthdayReportResp && prevExportStudentBirthdayReportResp !== exportStudentBirthdayReportResp) {
            toast.success("Birthday Data Download Successfully.");
            closeExportExcelModal();
            downloadExcelFile(exportStudentBirthdayReportResp, 'birthday_data')
        }
        studentBirthdayRef.current.prevExportStudentBirthdayReportResp = exportStudentBirthdayReportResp;
    }, [exportStudentBirthdayReportResp])

    useEffect(() => {
        if (branchId || filterState.user && academicYearListResp ) {

            setCurrentPageSizeState(10);
            birthdayAnniversaryApiCall({ pageSize: 10 });
            resetState();
        } else {
            dispatch(resetBirthdayAnniversaryAct(undefined));
            resetState();
        }
    }, [activeId, branchId,instituteId, filterState.user,academicYearListResp]);    

     function resetState() {
            setTotalStudentCountState(0);
            setCurrentPageSizeState(10);
            dispatch(resetBirthdayAnniversaryAct(undefined));
    }

    useEffect(() => {
        if(activeId == "birthdays"){
            if (getStudentBirthdayResp) {
                 if (filterState.user == "Student") {
                     setTotalStudentCountState(getStudentBirthdayResp?.studentBirthday?.totalElements || 0);
                 }
                 else {
                     setTotalStudentCountState(getBirthdayAnniversaryResp?.employeeBirthday?.totalElements || 0);
                 }
             
            }
        }else{
            if (getBirthdayAnniversaryResp) {
                 setTotalStudentCountState(getBirthdayAnniversaryResp?.employeeAnniversary?.totalElements || 0);
            }
        }
    }, [getBirthdayAnniversaryResp, getStudentBirthdayResp, filterState.user]);
    
    function handleScroll(event: React.UIEvent<HTMLElement>) {
        const target = event.currentTarget as HTMLElement;
        const { scrollTop, scrollHeight, clientHeight } = target;

        if (((scrollHeight - scrollTop) - clientHeight) <= 1) {
            const nextPageSize = currentPageSizeState + 10;
            if (currentPageSizeState >= totalStudentCountState) {
                return;
            }
            if (nextPageSize > totalStudentCountState) {
                setCurrentPageSizeState(totalStudentCountState);
                birthdayAnniversaryApiCall({ pageSize: totalStudentCountState });
            } else {
                setCurrentPageSizeState(nextPageSize);
                birthdayAnniversaryApiCall({ pageSize: nextPageSize });
            }
            setIsLoadingState(true)
        }
    }

    const exportExcelHndler = () => {
        const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
        dispatch(exportAStudentBirthdayReportAct(generateActionPayload("export_student_birthday_report", undefined, { branchId, instituteId, academicYearId }, {
            responseType: 'blob'
        })));
    }

    const MenuOptions: Array<IMenuOptions> = [
        {
            id: "birthdays",
            labelName: "Birthdays",
            customPadding: "0px 5px 5px 5px",
            Icon: <Birthday width={"24px"} height={"24px"} className="me-2" fill={activeId === "birthdays" ? "#0AB39C" : '#9599AD'} stroke={activeId === "birthdays" ? "#0AB39C" : '#9599AD'} />
        },
        {
            id: "upcomingAnniversaries",
            labelName: "Upcoming Anniversaries",
            customPadding: "0px 5px 5px 5px",
            Icon: <Anniversarie width={"24px"} height={"24px"} className="me-2" />
        },
    ];


    function getActiveMenuComponent(menuId: string) {
        switch (menuId) {
            case "birthdays":
                return Birthdays;
            case "upcomingAnniversaries":
                return UpcomingAnniversaries;
        }
    }

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        setActiveId(menuId);
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeId);
        setCurrentPageSizeState(0)
        return (
            <TabComponent setFilterState={setFilterState} filterState={filterState} />
        );
    }, [activeId,branchId,instituteId,filterState]);

    return (
        <>
            <div className="upcoming_events tw-mb-4">

                <div className="tw-bg-white tw-rounded-lg tw-shadow tw-h-full tw-pb-1">

                    <div className="tw-px-4 tw-pt-4 tw-pb-0">
                        <div className="tw-flex tw-items-center">

                            <UpdatedHorizontalTab
                                MenuOptions={MenuOptions}
                                clickMenuHandler={clickMenuHandler}
                                activeTabId={activeId}
                                horizontalClass="tw-pl-0"
                            />
                            {activeId === "birthdays" && filterState.user === "Student" && (
    <div className="tw-ml-auto">
        <div className="tw-flex tw-items-center">
            <Button
                id="export-btn"
                onClick={() => openExportExcelModal()}
                variant="exportBtn"
            >
                <img src={ExportIcon} className="tw-h-full" alt="Export" />
            </Button>

            <UncontrolledTooltip placement="bottom" target="export-btn">
                Export
            </UncontrolledTooltip>
        </div>
    </div>
)}
                        </div>
                    </div>

                    <div className="card-body" style={{ zIndex: "1", height: "355px", overflowY: 'auto', overflowX: 'hidden' }} onScroll={handleScroll}
                    >
                        <div >
                            {activeComponent}
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="book-collection-export"
                isOpen={exportExcelState.showModal}
                toggle={closeExportExcelModal}
                modalTitle="Export Birthday Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcelState.showModal}
                    toggle={closeExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="branch_dashboard"
                    subFeature="birthdays_upcoming"
                    remarksText="Enter Birthday data?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default UpcomingEvents;
