import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import {generateColumns, sendTypeOptions } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import classnames from "classnames";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { deleteTemplateAct, getTemplateListAct } from "../../../../store/communication/communicationactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useFormik } from "formik";
import { useModal } from "../../../../hooks/modalhook";
import AddMailTemplateModal from "./AddMailTemplateModal";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useFilterState } from "../../../../hooks/filterhook";
import { ITemplateData } from "./MailTemplateTypes";
import { EyeIcon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";


const initialValues = {
    searchString: "",
    sendType: "",
}
const MailTemplate: React.FC = () => {
    const [filterState, setFilterState] = useState(initialValues);
    const { showClearFilterState, advanceFilterChange } = useFilterState();

    const dispatch = useAppDispatch()
    const pagination = useRef({
        pageNo: 0,
        pageSize: 10,
    });
    const { closeModal: closeAddEditModal, modalState: addEditState, openModal: openAddEditModal } = useModal();
    const { closeModal: closeDeleteTemplateModal, modalState: deleteTemplateState, openModal: openDeleteTemplateModal } = useModal();

    const mailTemplateListApi = (otherProps?: any) => {
        const { searchString } = filterState || {};
        let payload = {
            instituteId: instituteId,
            searchString: searchString,
            messageType: "EMAIL",
            ...otherProps,
            ...pagination.current,

        }
        dispatch(getTemplateListAct(generateActionPayload("get_template_list", undefined, payload)));
    }

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        templateListResp,
        saveTemplateResp,
        deleteTemplateResp,
        communicationErrorResp,
        updateTemplateResp

    } = useAppSelector(
        ({ appData, communication }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            templateListResp: communication.templateListResp,
            saveTemplateResp: communication.saveTemplateResp,
            deleteTemplateResp: communication.deleteTemplateResp,
            communicationErrorResp: communication.communicationErrorResp,
            updateTemplateResp: communication.updateTemplateResp
        }),
        shallowEqual
    );
    const templateRef = useRef({
        prevSaveTemplateResp: saveTemplateResp,
        prevDeleteTemplateResp: deleteTemplateResp,
        prevCommunicationErrorResp: communicationErrorResp,
        prevUpdateTemplateResp: updateTemplateResp
    });
    useEffect(() => {
        const { prevSaveTemplateResp, prevDeleteTemplateResp, prevCommunicationErrorResp, prevUpdateTemplateResp } = templateRef.current || {};

        if (saveTemplateResp && saveTemplateResp !== prevSaveTemplateResp) {
            toast.success('New Template Added Successfully.');
            mailTemplateListApi();
            closeAddEditModal()
        }
        else if (deleteTemplateResp && deleteTemplateResp !== prevDeleteTemplateResp) {
            toast.success('Template Deleted Successfully.');
            mailTemplateListApi();
            closeDeleteTemplateModal()
        }
        else if (communicationErrorResp && communicationErrorResp !== prevCommunicationErrorResp) {
            toast.error(communicationErrorResp?.details);
            mailTemplateListApi();
            closeAddEditModal()
        }
        else if (updateTemplateResp && updateTemplateResp !== prevUpdateTemplateResp) {
            toast.success('Template Updated Successfully.');
            mailTemplateListApi();
            closeAddEditModal()
        }
        templateRef.current.prevSaveTemplateResp = saveTemplateResp;
        templateRef.current.prevDeleteTemplateResp = deleteTemplateResp;
        templateRef.current.prevCommunicationErrorResp = communicationErrorResp;
        templateRef.current.prevUpdateTemplateResp = updateTemplateResp;
    }, [saveTemplateResp, deleteTemplateResp, communicationErrorResp, updateTemplateResp]);

    useEffect(() => {
        mailTemplateListApi()
    }, []);

    function editTemplateHandler(event: React.MouseEvent<HTMLButtonElement>) {
        const templateId = event.currentTarget.getAttribute("data-id");
        const modalData = templateListResp?.content?.find(
            (item: ITemplateData) => +item.id == +templateId!
        );
        
        openAddEditModal(modalData);
    }

    const menuOptions = useMemo(
        () => [
            {
                id: "view",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
                actionName: "View Details",
                onClickHndlr:editTemplateHandler
            }
        ],
        [templateListResp]
    );

    const deleteTemplateHandler = () => {
        dispatch(
            deleteTemplateAct(
                generateActionPayload("delete_template", {
                    id: deleteTemplateState.modalData,
                })
            )
        );
    };
    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setFilterState((prev: any) => ({ ...prev, [name]: value }));
        pagination.current.pageNo = 0;
        mailTemplateListApi({ [name]: value });
        advanceFilterChange({
            keys: { ...filterState, [name]: value },
            ignoredKeys: [],
        });
    };
    const clearFilterHndlr = () => {
        setFilterState({ ...initialValues });
        mailTemplateListApi({ ...initialValues, instituteId });
        advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
    };
    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        mailTemplateListApi(paginationInfo);
    }

    const columns = useMemo(() => generateColumns(menuOptions), [templateListResp]);
    const { content: templateData,totalElements, totalPages, pageble } = templateListResp || {};


    return (
        <>
            <div className="tw-inline-block tw-w-full">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-py-3 tw-items-end">

                    {/* Search Input */}
                    <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                        <div className="tw-relative">
                            <div className="search-box">
                                <TextInput
                                    name="searchString"
                                    formgroupClassName="tw-mb-0"
                                    placeHolder="Search..."
                                    value={filterState.searchString}
                                    onChange={filterHandler}
                                    labelText="Search"
                                    floatingLabel
                                />
                                <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Send Type Select */}
                    <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                        <SelectInput
                            name="sendType"
                            labelClass="required"
                            value={filterState.sendType}
                            onChange={filterHandler}
                            menuItems={sendTypeOptions}
                            valueKey="id"
                            textKey="name"
                            labelText="Send Type"
                            formgroupClassName="tw-mb-0"
                            floatingLabel
                        />
                    </div>
                    <div className="tw-col-span-1 tw-flex tw-justify-end">
                    {showClearFilterState && (
                            <Button
                                type="button"
                                variant="wrong"
                                onClick={clearFilterHndlr}
                            >
                                Clear filter
                            </Button>
                    )}
                    </div>

                    {/* Add New Button */}
                    <div className="tw-col-span-5 tw-flex tw-justify-end">
                        <Button
                            variant="primary"
                            onClick={() => openAddEditModal()}
                        >
                            <i className="ri-add-line tw-mr-2" />
                            Add New
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <TableContainer
                    columns={columns || []}
                    data={Array.isArray(templateData) && templateData.length > 0 ? templateData : []}
                    tableClass="tw-mb-0"
                    divClass="tw-overflow-x-auto tw-mb-3"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    showPagination={true}
                    totalPages={totalPages || 0}
                    totalRecords={totalElements || 0}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageble?.pageNumber || 0}
                />
            </div>
            <ModalContainerUpdated
                id="book-collection"
                isOpen={addEditState.showModal}
                toggle={closeAddEditModal}
                modalTitle={"Add New Mail Template"}
                modalSize="lg"
            >
                <AddMailTemplateModal
                    isOpen={false}
                    toggle={closeAddEditModal}
                    modalData={addEditState.modalData}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-template"
                isOpen={deleteTemplateState.showModal}
                confirmMessage="Are you sure you want to delete an Mail Template ?"
                cancelHndlr={closeDeleteTemplateModal}
                confirmHndlr={deleteTemplateHandler}
            />
        </>
    );
};

export default MailTemplate;
