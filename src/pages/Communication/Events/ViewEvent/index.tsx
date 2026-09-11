import React, { useEffect, useRef, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import {  ConfirmationModal, ModalContainerUpdated, TextArea } from '../../../../Components/Common'
import { useLocation } from 'react-router-dom'
import { shallowEqual, useDispatch } from 'react-redux'
import { generateActionPayload } from '../../../../utility/reduxutility'
import { useAppSelector } from '../../../../hooks/storehook'
import { getDateWithTimeFormat} from '../../../../utility/dateutility'
import { getEventByIdAct, updateFilesAct } from '../../../../store/communication/communicationactions'
import LocationSelectorModal from '../LocationSelectorModal'
import Pdf from "../../../../assets/imagesdps/academics/pdf.svg";
import Docx from "../../../../assets/imagesdps/academics/word.svg";
import Other from "../../../../assets/imagesdps/academics/common.svg";
import AddFileHndler from './AddFileHndler'
import { useModal } from '../../../../hooks/modalhook'
import UpdatedHorizontalTab from '../../../../Components/Common/UpdatedHorizontalTab'
import { MenuOptions } from './helper'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import Button from '../../../../Components/Common/Button'

const initialValues = {
    complaintStatus: "",
    comment: "",
    file: null,
    fileName: "",
}


const ViewEvent = () => {
    const [activeId, setActiveId] = useState<string | null>("comments");
    const location: any = useLocation();
    const dispatch = useDispatch();

    const [mapModalState, setMapModalState] = useState({
        showModal: false,
        longitude: undefined,
        latitude: undefined,
        data: undefined,
    })
    const { closeModal: closeDelFileModalState, modalState: delFileModalState, openModal: openDelFileModalState } = useModal();
    const { closeModal: closeAddFileModalState, modalState: addFileModalState, openModal: openAddFileModalState } = useModal();

    const {
        showApiLoader,
        getEventByIdResp,
        updateFilesResp,
    } =
        useAppSelector(({ appData, instAcademics, globalData, concernsFeedback,login, communication }) => ({
            showApiLoader: globalData.showApiLoader,
            getEventByIdResp: communication.getEventByIdResp,
            updateFilesResp: communication.updateFilesResp,
        }), shallowEqual);

        const viewEvent = useFormik({
            initialValues,
            onSubmit: (values) => {
    
            },
        });
        const viewEventRef = useRef({
            prevUpdateFilesResp: updateFilesResp,
        });
    
        useEffect(() => {
            const { prevUpdateFilesResp } = viewEventRef.current;
            if (updateFilesResp && updateFilesResp !== prevUpdateFilesResp && delFileModalState.showModal) {
                toast.success("File Deleted Successfully");
                getEventListById(location.state?.id);
                closeDelFileModalState();
            }
            else if (updateFilesResp && updateFilesResp !== prevUpdateFilesResp && addFileModalState.showModal) {
                toast.success("File Added Successfully");
                getEventListById(location.state?.id);
                closeAddFileModalState();
            }
            viewEventRef.current.prevUpdateFilesResp = updateFilesResp;
        }, [updateFilesResp]);

        function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
            const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
            viewEvent.resetForm();
            setActiveId(menuId);
        }

        const delFileSubmitHndlr = () => {
            const formData = new FormData();
            const payload = {systemFileIds:[delFileModalState.modalData]};
            formData.append("requestValue",JSON.stringify(payload) );
            dispatch(updateFilesAct(generateActionPayload("update_files", { id: location.state?.id },formData)));
        }
    const toggleAddFileModalHndler = () => {
        closeAddFileModalState()
    }
    const toggleMapModal = (latitude?: number, longitude?: number, data?: string) => {
        setMapModalState((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            longitude: longitude || "",
            latitude: latitude || "",
            data: data || "",
        }));
    }
 
    const  getEventListById= (id: number | string) => {
        dispatch(getEventByIdAct(generateActionPayload('get_event_by_id', { id: location.state?.id })))
    }

    useEffect(() => {
        if (location?.state?.id) {
            getEventListById(location.state.id)
        }
    }, [location])

    return (
        <>
           <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Communication" pageTitle="Communication" />
                    <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 gap-3">
                        <div className="lg:tw-col-span-3">
                            <div className="tw-bg-white tw-rounded tw-shadow tw-sticky tw-top-4">

                                {/* Header */}
                                <div className="tw-p-4">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        Event Details
                                    </h4>
                                </div>

                                {/* Tags */}
                                <div className="tw-border-t tw-px-4 tw-py-3">
                                    <div className="tw-grid tw-grid-cols-12 tw-text-sm">
                                        <div className="tw-col-span-4">Tags</div>
                                        <div className="tw-col-span-8 tw-flex">
                                            <span className="tw-mr-3">:</span>
                                            <div className="tw-flex tw-flex-wrap tw-items-center tw-break-words">
                                                <span>{getEventByIdResp?.tags}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div className="tw-border-t tw-px-4 tw-py-3">
                                    <div className="tw-grid tw-grid-cols-12 tw-text-sm">
                                        <div className="tw-col-span-4">Start Date</div>
                                        <div className="tw-col-span-8 tw-flex">
                                            <span className="tw-mr-3">:</span>
                                            <span>{getDateWithTimeFormat(getEventByIdResp?.startDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* End Date */}
                                <div className="tw-border-t tw-px-4 tw-py-3">
                                    <div className="tw-grid tw-grid-cols-12 tw-text-sm">
                                        <div className="tw-col-span-4">End Date</div>
                                        <div className="tw-col-span-8 tw-flex">
                                            <span className="tw-mr-3">:</span>
                                            <span>{getDateWithTimeFormat(getEventByIdResp?.endDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Type */}
                                <div className="tw-border-t tw-px-4 tw-py-3">
                                    <div className="tw-grid tw-grid-cols-12 tw-text-sm">
                                        <div className="tw-col-span-4">Event Type</div>
                                        <div className="tw-col-span-8 tw-flex">
                                            <span className="tw-mr-3">:</span>
                                            <span>{getEventByIdResp?.eventType}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Status */}
                                <div className="tw-border-t tw-px-4 tw-py-3">
                                    <div className="tw-grid tw-grid-cols-12 tw-text-sm">
                                        <div className="tw-col-span-4">Event Status</div>
                                        <div className="tw-col-span-8 tw-flex">
                                            <span className="tw-mr-3">:</span>
                                            <span>{getEventByIdResp?.eventStatus}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Person */}
                                <div className="tw-border-t tw-px-4 tw-py-3">
                                    <div className="tw-grid tw-grid-cols-12 tw-text-sm">
                                        <div className="tw-col-span-4">Contact Person</div>
                                        <div className="tw-col-span-8 tw-flex">
                                            <span className="tw-mr-3">:</span>
                                            <span>{getEventByIdResp?.contactPerson}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Phone */}
                                <div className="tw-border-t tw-px-4 tw-py-3">
                                    <div className="tw-grid tw-grid-cols-12 tw-text-sm">
                                        <div className="tw-col-span-4">Contact Phone</div>
                                        <div className="tw-col-span-8 tw-flex">
                                            <span className="tw-mr-3">:</span>
                                            <span>{getEventByIdResp?.contactPhone}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="tw-border-t tw-px-4 tw-py-3">
                                    <div className="tw-grid tw-grid-cols-12 tw-text-sm">
                                        <div className="tw-col-span-4">Location</div>
                                        <div className="tw-col-span-8 tw-flex">
                                            <span className="tw-mr-3">:</span>
                                            {getEventByIdResp?.latitude && getEventByIdResp?.longitude ? (
                                                <span
                                                    className="tw-text-info tw-cursor-pointer tw-underline"
                                                    onClick={() =>
                                                        toggleMapModal(
                                                            getEventByIdResp?.latitude,
                                                            getEventByIdResp?.longitude,
                                                            getEventByIdResp
                                                        )
                                                    }
                                                >
                                                    View
                                                </span>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="lg:tw-col-span-9 tw-col-span-12">
                            <div className="tw-grid tw-grid-cols-12 gap-3">
                                <div className="tw-col-span-12">
                                    <div className="tw-bg-white tw-rounded tw-shadow">
                                        <div className="tw-p-4">
                                            <div className="tw-grid tw-grid-cols-12">
                                                <div className="tw-col-span-12">
                                                    <div className="tw-grid tw-grid-cols-12">
                                                            <h4 className="tw-text-lg tw-font-semibold tw-mb-2 tw-col-span-12">
                                                                {getEventByIdResp?.title}
                                                            </h4>
                                          
                                                    </div>
                                                </div>

                                                <div className="tw-col-span-12 tw-text-gray-500 tw-text-xs">
                                                    {getEventByIdResp?.eventCreatedDate
                                                        ? `Created At ${getDateWithTimeFormat(
                                                            getEventByIdResp?.eventCreatedDate + "Z"
                                                        )}`
                                                        : ""}
                                                </div>

                                                <div
                                                    className="tw-col-span-12 tw-text-sm tw-mt-3"
                                                    dangerouslySetInnerHTML={{
                                                        __html: getEventByIdResp?.description,
                                                    }}
                                                />

                                                <div className="tw-col-span-12 tw-my-3 tw-flex tw-flex-wrap">
                                                    {getEventByIdResp?.filesDto?.map((item: any, index: any) => {
                                                        const file = item?.originalFileName?.split("/");
                                                        const fileName = file[file.length - 1];
                                                        const fileExtension = fileName.split(".").pop().toLowerCase();

                                                        return (
                                                            <div
                                                                className="tw-border tw-ml-3 tw-mt-3 tw-px-2 tw-rounded"
                                                                key={index}
                                                            >
                                                                <div className="tw-flex tw-justify-center tw-items-center tw-py-2">
                                                                    <div
                                                                        className="tw-flex tw-items-center"
                                                                        style={{ maxWidth: "100%" }}
                                                                    >
                                                                        {fileExtension === "docx" ? (
                                                                            <>
                                                                                <div className="tw-mr-3">
                                                                                    <img
                                                                                        src={Docx}
                                                                                        className="tw-w-7 tw-h-7"
                                                                                    />
                                                                                </div>

                                                                                <div className="tw-text-gray-500 tw-mr-3">
                                                                                    <span
                                                                                        className="tw-flex tw-items-center"
                                                                                        title={fileName}
                                                                                        style={{
                                                                                            whiteSpace: "nowrap",
                                                                                            overflow: "hidden",
                                                                                            textOverflow: "ellipsis",
                                                                                            flexGrow: 1,
                                                                                            textDecoration: "unset",
                                                                                        }}
                                                                                    >
                                                                                        <ins
                                                                                            style={{ textDecoration: "unset" }}
                                                                                            className="tw-truncate"
                                                                                        >
                                                                                            {fileName.length > 20
                                                                                                ? `${fileName.substring(0, 20)}...`
                                                                                                : fileName}
                                                                                        </ins>
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        ) : fileExtension === "pdf" ? (
                                                                            <>
                                                                                <div className="tw-mr-3">
                                                                                    <img
                                                                                        src={Pdf}
                                                                                        className="tw-w-7 tw-h-7"
                                                                                    />
                                                                                </div>
                                                                                <div className="tw-text-gray-500 tw-mr-3">
                                                                                    <span
                                                                                        className="tw-flex tw-items-center"
                                                                                        title={fileName}
                                                                                        style={{
                                                                                            maxWidth: "7rem",
                                                                                            whiteSpace: "nowrap",
                                                                                            overflow: "hidden",
                                                                                            textOverflow: "ellipsis",
                                                                                            flexGrow: 1,
                                                                                            textDecoration: "unset",
                                                                                        }}
                                                                                    >
                                                                                        <ins
                                                                                            style={{ textDecoration: "unset" }}
                                                                                            className="tw-truncate"
                                                                                        >
                                                                                            {fileName.length > 20
                                                                                                ? `${fileName.substring(0, 20)}...`
                                                                                                : fileName}
                                                                                        </ins>
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div className="tw-mr-3">
                                                                                    <img
                                                                                        src={Other}
                                                                                        className="tw-w-7 tw-h-7"
                                                                                    />
                                                                                </div>
                                                                                <div className="tw-text-gray-500 tw-mr-3">
                                                                                    <span
                                                                                        className="tw-flex tw-items-center"
                                                                                        title={fileName}
                                                                                        style={{
                                                                                            maxWidth: "7rem",
                                                                                            whiteSpace: "nowrap",
                                                                                            overflow: "hidden",
                                                                                            textOverflow: "ellipsis",
                                                                                            flexGrow: 1,
                                                                                        }}
                                                                                    >
                                                                                        <ins
                                                                                            style={{ textDecoration: "unset" }}
                                                                                            className="tw-truncate"
                                                                                        >
                                                                                            {fileName.length > 20
                                                                                                ? `${fileName.substring(0, 20)}...`
                                                                                                : fileName}
                                                                                        </ins>
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    <span
                                                                        className="tw-cursor-pointer"
                                                                        onClick={() => {
                                                                            window.open(item?.fileUrl, "_blank");
                                                                        }}
                                                                    >
                                                                        <i
                                                                            className="ri-download-line tw-ml-2"
                                                                            title="Download"
                                                                        />
                                                                    </span>
                                                                    <span
                                                                        className="tw-cursor-pointer"
                                                                        onClick={() => openDelFileModalState(item?.id)}
                                                                    >
                                                                        <i className="ri-delete-bin-5-fill tw-text-red-500 tw-text-base tw-ml-2" />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    <div className="tw-ml-3 tw-mt-3 tw-flex tw-items-center">
                                                        <Button
                                                            onClick={openAddFileModalState}
                                                            type="button"
                                                            variant='soft'
                                                            title="Add New File"
                                                        >
                                                            <i className="ri-add-line tw-text-lg" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {getEventByIdResp?.allowedComments && (
                                    <div className="tw-col-span-12">
                                        <div className="tw-bg-white tw-rounded tw-shadow">
                                            <div className="tw-p-4">
                                                <UpdatedHorizontalTab
                                                    MenuOptions={MenuOptions}
                                                    clickMenuHandler={clickMenuHandler}
                                                    activeTabId={activeId}
                                                    showBadge={false}
                                                    horizontalClass=""
                                                />

                                                <div className="tw-grid tw-grid-cols-12 tw-mt-3">
                                                    <div className="tw-col-span-12">
                                                        <TextArea
                                                            name="comment"
                                                            value={viewEvent.values.comment}
                                                            onChange={viewEvent.handleChange}
                                                            labelText="Comments"
                                                            height="10rem"
                                                        />
                                                    </div>

                                                    <div className="tw-ml-auto tw-col-span-12">
                                                        <Button
                                                            type="submit"
                                                            variant='primary'
                                                        >
                                                            Save
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="google-map-pop-up"
                isOpen={mapModalState.showModal}
                toggle={() =>   toggleMapModal()}
                modalSize="lg"
                modalTitle="Google Map"
            >
                <LocationSelectorModal
                    toggle={() => toggleMapModal()}
                    modalTitle=""
                    latitude={mapModalState?.latitude}
                    longitude={mapModalState?.longitude}
                    showApiLoader={showApiLoader}
                    modalData={mapModalState.data}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="add-new-files-modal"
                isOpen={addFileModalState.showModal}
                toggle={toggleAddFileModalHndler}
                modalTitle="Add Attechments"
                modalSize="lg"
            >
                <AddFileHndler
                    showApiLoader={showApiLoader}
                    id={location.state?.id}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-student-modal"
                isOpen={delFileModalState.showModal}
                confirmMessage="Are you sure you want to delete this file ?"
                cancelHndlr={closeDelFileModalState}
                confirmHndlr={delFileSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType='reject'
            />
        </>
    )
}

export default ViewEvent