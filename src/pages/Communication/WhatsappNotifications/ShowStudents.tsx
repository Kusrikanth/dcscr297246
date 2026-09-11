import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
//Component
import TableContainer from "../../../Components/Common/TableContainer";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { generateStudentModalColumns } from "./helper";
import { getUnpaidStudentCountAct, setUnpaidStudentCountAct } from "../../../store/fee/feereport/feereportactions";
import { ModalContainerUpdated, TextInput } from "../../../Components/Common";
import { IPaginationState } from "../../../Components/Common/Pagination";
import Button from "../../../Components/Common/Button";
import { exportNotificationItemByIdAct, getNotificationCampaignRecipientListAct, resetNotificationCampaignRecipientListAct } from "../../../store/communication/communicationactions";
import { useModal } from "../../../hooks/modalhook";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../utility/commonutility";

export default function ShowStudents({
    toggle, modalData, isOpen, filterValues
}: any) {

    const dispatch = useAppDispatch();
    const paginationRef = useRef({
        pageNo: 0, pageSize: 10
    })
    const [searchString, setSearchString] = useState("");
    const { closeModal: closeExportLoginHistoryModalHnldr,
        openModal: openExportLoginHistoryModalHnldr, modalState: exportLoginHistoryModalState } = useModal();
    console.log(modalData)

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        showApiLoader,
        getNotificationCampaignRecipientListResp,
        exportNotificationItemByIdResp,
        communicationErrorResp,
        currentBranchIdResp: branchId,
    } = useAppSelector(
        ({ globalData, instAcademics, appData, communication }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getNotificationCampaignRecipientListResp: communication.getNotificationCampaignRecipientListResp,
            exportNotificationItemByIdResp: communication.exportNotificationItemByIdResp,
            communicationErrorResp: communication.communicationErrorResp,
        }),
        shallowEqual
    );

    const exportNotificationRef = useRef({
        prevCommunicationErrorResp: communicationErrorResp,
        prevExportNotificationItemByIdResp: exportNotificationItemByIdResp,
    });

    const getStudentsList = (otherProps?: any) => {
        const { waOrderRef, recipientType, status } = modalData || {};
        const payload = {
            waRequestId: waOrderRef,
            recipientType,
            status,
            module: location.pathname === "/hostel-whatsapp-notifications"
                ? "HOSTEL"
                : "",
            search: otherProps?.searchString ?? searchString,
            ...paginationRef.current,
        };

        dispatch(getNotificationCampaignRecipientListAct(generateActionPayload("get_notifcation_campaign_recipient_list", undefined, payload)));
    }

    useEffect(() => {
        if (modalData) {
            getStudentsList()
        }
        return () => {
            dispatch(setUnpaidStudentCountAct(undefined));
            dispatch(resetNotificationCampaignRecipientListAct(undefined));
        }
    }, [])

    useEffect(() => {
        const { prevCommunicationErrorResp, prevExportNotificationItemByIdResp } = exportNotificationRef.current;

        if (communicationErrorResp && communicationErrorResp !== prevCommunicationErrorResp) {
            const { details } = communicationErrorResp || {};
            toast.error(details || "Something went wrong");
        } else if (exportNotificationItemByIdResp && exportNotificationItemByIdResp !== prevExportNotificationItemByIdResp) {
            toast.success("WhatsApp campaign recipients exported successfully");
            closeExportLoginHistoryModalHnldr();
            downloadExcelFile(exportNotificationItemByIdResp, "whatsapp_campaign_recipients");
        }

        exportNotificationRef.current.prevCommunicationErrorResp = communicationErrorResp;
        exportNotificationRef.current.prevExportNotificationItemByIdResp = exportNotificationItemByIdResp;
    }, [communicationErrorResp, exportNotificationItemByIdResp]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSearchString(value);
        getStudentsList({ [name]: value })
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        getStudentsList()
    }

    function submitExportHndlr() {
        const { waOrderRef, recipientType, status } = modalData || {};
        const payload = {
         waRequestId:waOrderRef,
         recipientType:recipientType,
         status
        };
        
        dispatch(exportNotificationItemByIdAct(generateActionPayload("export_notification_item_by_id", undefined, payload, {
          responseType: 'blob'
        })))
      }

    const { totalElements, totalPages, pageble } = getNotificationCampaignRecipientListResp || {}
    const studentColumns = useMemo(() => generateStudentModalColumns(), []);

    return (
        <>
            <div className="tw-w-full">
                <div className="tw-grid tw-grid-cols-12 tw-gap-y-3 tw-items-center">
                    <div className="tw-col-span-11 tw-flex tw-items-center tw-gap-3 tw-px-3 tw-pt-4 tw-pb-2">
                        <div className="search-box !tw-w-full">
                            <TextInput
                                name="searchString"
                                value={searchString}
                                onChange={filterHandler}
                                formgroupClassName="tw-mb-0"
                                labelText="Search"
                                placeHolder="Search"
                                floatingLabel
                            />
                            <i className="ri-search-line search-icon"></i>
                        </div>
                    </div>
                    <div className="tw-w-[50px] tw-flex-shrink-0">
                        <Button
                          id="export-btn"
                          variant="exportBtn"
                          onClick={openExportLoginHistoryModalHnldr}
                        >
                          <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                          <UncontrolledTooltip placement="bottom" target="export-btn">
                            Export
                          </UncontrolledTooltip>
                        </Button>
                    </div>
                    <div className="tw-col-span-12 tw-px-3">
                        <TableContainer
                            columns={studentColumns}
                            data={
                                Array.isArray(getNotificationCampaignRecipientListResp?.data)
                                    ? getNotificationCampaignRecipientListResp?.data
                                    : []
                            }
                            divClass="tw-overflow-x-auto tw-mb-3"
                            tableClass="tw-whitespace-nowrap"
                            theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                        />
                    </div>
                    <div className="tw-col-span-12 tw-px-3 tw-py-3 tw-flex tw-justify-end">
                        <Button
                            type="button"
                            onClick={toggle}
                            variant="secondary"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="exportLoginHistoryModalState"
                isOpen={exportLoginHistoryModalState.showModal}
                toggle={closeExportLoginHistoryModalHnldr}
                modalTitle="Export WhatsApp Campaign Recipients"
                modalSize="md"
            >
                <ExportModal
                  isOpen={exportLoginHistoryModalState.showModal}
                  toggle={closeExportLoginHistoryModalHnldr}
                  instituteId={instituteId}
                  branchId={branchId}
                  submitHndlr={submitExportHndlr}
                  feature="whatsapp"
                  subFeature="whatsapp_export"
                  remarksText="You want to export the data?"
                />
            </ModalContainerUpdated>
        </>
    )
}