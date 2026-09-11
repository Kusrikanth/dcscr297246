import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, TextIconInput, SelectInput, ModalContainerUpdated } from "../../../Components/Common";
import { generateColumns, subjectTypeOptions } from "./helper";
import AddEditSubject from "./AddEditSubject";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstSubjectNameAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { useModal } from "../../../hooks/modalhook";
import { getInstSubjectsByIdAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  subjectType: "",
};
const Subjects: React.FC<any> = ({ instituteId }) => {
    
    const { closeModal: closeInstSubjectsAddModal, modalState: instSubjectsAddModalState, openModal: openInstSubjectsAddModalState } = useModal();
    const [filterState, setFilterState] = useState<any>({ ...initialValues });
    const dispatch = useAppDispatch();

    function getSubjectApiCall(otherProps?: any) {
        const payload = {
            instituteId, ...filterState, ...otherProps
        };
        dispatch(
            getInstSubjectNameAct(generateActionPayload("get_inst_subject_name", undefined, payload))
        );
    }

    const { instSubjectNameResp, saveInstSubjectRep, editInstSubjectsRep, instInfoError } = useAppSelector((
        { branchAcademics, instituteInfo }) => ({
            instSubjectNameResp: branchAcademics.instSubjectNameResp,
            saveInstSubjectRep: instituteInfo.saveInstSubjectRep,
            editInstSubjectsRep: instituteInfo.editInstSubjectsRep,
            instInfoError: instituteInfo.instInfoError,
        }), shallowEqual);

    const instSubjectsRespRef = useRef<any>({
        prevSaveInstSubjectRep: saveInstSubjectRep,
        prevEditInstSubjectsRep: editInstSubjectsRep,
        prevInstInfoError: instInfoError
    });

    useEffect(() => {
        if (instituteId) {
            getSubjectApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevSaveInstSubjectRep, prevEditInstSubjectsRep, prevInstInfoError } = instSubjectsRespRef.current;
        if (instInfoError && instInfoError !== prevInstInfoError) {
            const { details }: any = instInfoError;
            toast.error(details);
        } else if (saveInstSubjectRep && saveInstSubjectRep !== prevSaveInstSubjectRep) {
            toast.success("Subject added successfully.");
            closeInstSubjectsAddModal()
            getSubjectApiCall()
        } else if (editInstSubjectsRep && editInstSubjectsRep !== prevEditInstSubjectsRep) {
            toast.success("Subject updated successfully.");
            closeInstSubjectsAddModal()
            getSubjectApiCall()
        }
        instSubjectsRespRef.current.prevSaveInstSubjectRep = saveInstSubjectRep;
        instSubjectsRespRef.current.prevEditInstSubjectsRep = editInstSubjectsRep;
        instSubjectsRespRef.current.prevInstInfoError = instInfoError;
    }, [saveInstSubjectRep, editInstSubjectsRep, instInfoError]);

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "edit",
            actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
            actionName: "Edit",
            onClickHndlr: (event: any) => {
                const subjectId = event.currentTarget.getAttribute("data-id");
                dispatch(getInstSubjectsByIdAct(generateActionPayload("get_inst_subjects_by_id", { subjectId })));
                openInstSubjectsAddModalState(subjectId);
            },
        }
    ]), [instSubjectNameResp]);

    function paginationHndlr(paginationInfo: any) {
        getSubjectApiCall(paginationInfo);
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getSubjectApiCall({ [name]: value });
    }

    const classColumns = useMemo(() => generateColumns(menuOptions), [instSubjectNameResp]),
        { data: classList, pageNumber, totalPages, totalElements } = instSubjectNameResp || {};

    return (
        <React.Fragment>

            <div className="tw-bg-white tw-rounded-lg tw-shadow">

                <div className="tw-border-b tw-px-4 tw-py-3">
                    <div className="tw-flex tw-items-center">

                        <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-1">
                            Subjects
                        </h4>

                        {/* <Button
                        variant="primary"
                            onClick={() => openInstSubjectsAddModalState()}
                        >
                            Add Subject
                        </Button> */}

                    </div>
                </div>

                <div className="tw-p-4">
                    <div className="tw-flex tw-flex-wrap tw-gap-3">

                        <div className="tw-w-1/2 lg:tw-w-4/12">
                            <TextIconInput
                                formgroupClassName="search-box"
                                name="searchString"
                                value={filterState.searchString}
                                placeHolder="Search"
                                labelText="Search"
                                floatingLabel
                                onChange={onChangeFilterHndlr}
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        <div className="tw-w-1/2 lg:tw-w-2/12">
                            <SelectInput
                                name="subjectType"
                                value={filterState.subjectType}
                                onChange={onChangeFilterHndlr}
                                menuItems={subjectTypeOptions}
                                formgroupClassName="tw-mb-0"
                                valueKey="id"
                                textKey="name"
                                labelText="Subject"
                                floatingLabel
                            />
                        </div>

                    </div>
                </div>
                <TableContainer
                    columns={classColumns || []}
                    data={
                        Array.isArray(instSubjectNameResp?.content)
                            ? instSubjectNameResp?.content
                            : []
                    }
                    divClass="tw-overflow-x-auto tw-mb-1"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    showPagination={true}
                    totalPages={totalPages}
                    totalRecords={totalElements}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageNumber}
                />
            </div>
            <ModalContainerUpdated
                id="add-examination-weightage"
                isOpen={instSubjectsAddModalState.showModal}
                toggle={() => closeInstSubjectsAddModal()}
                modalTitle={instSubjectsAddModalState.modalData ? "Edit Subject Details" : "Create Details"}
                modalSize="lg"
            >
                <AddEditSubject
                    id={instSubjectsAddModalState.modalData}
                    isOpen={false}
                    toggle={() => closeInstSubjectsAddModal()}
                    modalTitle="Create Detail"
                />
            </ModalContainerUpdated>
        </React.Fragment >
    )
}

export default Subjects;