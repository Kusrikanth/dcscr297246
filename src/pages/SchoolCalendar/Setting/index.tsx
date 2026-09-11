import React, { useMemo } from 'react'
import BreadCrumb from '../../../Components/Common/BreadCrumb'
import TableContainer from '../../../Components/Common/TableContainer'
import {  default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { ConfirmationModal, ModalContainerUpdated, Button } from '../../../Components/Common';
import { useModal } from '../../../hooks/modalhook';
import { eventData, generateColumns } from './helper';
import AddEditEventTypeModal from './AddEditEventTypeModal';
function CalendarSetting() {
    const { modalState: addNewState, closeModal: closeAddNewStateHndlr,
        openModal: openAddNewStateHndlr
    } = useModal();
    const menuOptions = useMemo(() => {
        return ([
            {
                id: "edit",
                actionIcon: <EditSvg className="me-2 d-inline-block" color="#878A99" />,
                actionName: "Edit",
            },
            {
                id: "delete",
                actionIcon: <i className={"ri-delete-bin-5-fill text-danger fs-16 me-2"}></i>,
                actionName: "Delete",
            }
        ])
    }, []);
    const studentColumns = useMemo(() => generateColumns(menuOptions), [])
  return (
    <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="School Calendar" pageTitle="School Calendar" />
                    <div className="tw-flex tw-flex-wrap">
                        <div className="tw-w-full">
                            <div className="card" id="tasksList">
                                <div className="card-header">
                                    <div className="tw-flex tw-items-center">
                                        <h4 className="card-title tw-mb-0 tw-grow">Events Type</h4>
                                        <div className="tw-flex-shrink-0 tw-flex tw-items-center">
                                            <Button variant="primary" onClick={() =>openAddNewStateHndlr()}>
                                                <i className="ri-add-line tw-mr-1"></i>
                                                Add sub stages
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body !tw-p-0">
                                    
                                     <TableContainer
                                        columns={studentColumns}
                                        data={eventData || []}
                                        divClass="table-responsive tw-mb-3"
                                        tableClass="table-nowrap"
                                        theadClass="table-light tw-text-gray-500 tw-align-middle"
                                        showPagination={true}
                                        // totalPages={totalPages}
                                        // totalRecords={totalRecords}
                                        // callbackPaginationHndlr={paginationHndlr}
                                        // currentPageNumber={pageNumber}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="event-type-modal"
                isOpen={addNewState.showModal}
                toggle={() => closeAddNewStateHndlr()}
                modalSize="md"
                modalTitle="Event Type"
            >
                <AddEditEventTypeModal
                    isOpen={addNewState.showModal}
                    toggle={() => closeAddNewStateHndlr()}
                />
               
            </ModalContainerUpdated>
            {/* <ConfirmationModal
                id="delete-template"
                isOpen={deleteTemplateState.showModal}
                confirmMessage="Are you sure you want to delete an Event?"
                cancelHndlr={closeDeleteTemplateModal}
                confirmHndlr={deleteTemplateHandler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='reject'
            /> */}
        </React.Fragment>
  )
}
export default CalendarSetting