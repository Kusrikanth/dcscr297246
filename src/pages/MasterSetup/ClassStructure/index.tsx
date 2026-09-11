import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput } from "../../../Components/Common";

import { SelectInput } from "../../../Components/Common";

import { generateColumns } from "./helper";

//Modal Component
import AddClassStructureModal from "./AddEditClassStructure";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getInstCurriculumAct, deleteCurriculumClassAct, getCurriculumClassAct,
    resetCurriculumClassAct
} from "../../../store/mastersettings/instacademics/instacademicactions";
//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";

//Interface & Types
import { } from "./classstructuretypes";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import Button from "../../../Components/Common/Button";


const ClassStructure: React.FC<any> = ({ instituteId, instituteName }) => {
    const [classStructureState, setClassStructureState] = useState<any>({});
    const [addClassStructModalState, setAddClassStructModalState] = useState<any>({
        showModal: false, classId: "", modalData: undefined
    });
    const [delClassStructModalState, setDelClassStructModalState] = useState<any>({
        showModal: false,
        classId: ""
    })
    const [filterState, setFilterState] = useState<any>({
        instituteClassName: undefined,
        instituteCurriculumId: undefined,
    });
    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });
    const sortingDetailRef = useRef<any>(undefined);

    const dispatch = useAppDispatch();
    const { instCurriculumResp, curriculumClassResp, deleteCurriculumClassResp, instAcademicErrorResp } = useAppSelector(({ instAcademics }) => ({
        instCurriculumResp: instAcademics.instCurriculumResp,
        curriculumClassResp: instAcademics.curriculumClassResp,
        deleteCurriculumClassResp: instAcademics.deleteCurriculumClassResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp
    }), shallowEqual);

    const classStructureRespRef = useRef<any>({
        prevInstCurriculumResp: instCurriculumResp,
        prevCurriculumClassResp: curriculumClassResp,
        prevDeleteCurriculumClassResp: deleteCurriculumClassResp,
        prevInstAcademicErrorResp: instAcademicErrorResp
    });

    useEffect(() => {
        if (instituteId) {
            const params = { instituteId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getInstCurriculumAct(generateActionPayload("get_inst_curriculum", undefined, params)));
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevInstCurriculumResp, prevCurriculumClassResp, prevDeleteCurriculumClassResp, prevInstAcademicErrorResp } = classStructureRespRef.current;
        if (instCurriculumResp && prevInstCurriculumResp !== instCurriculumResp) {
            const { instituteCurriculumId } = instCurriculumResp?.data[0] || {};
            if (instituteCurriculumId) {
                getClassStructureApiCall(undefined, instituteCurriculumId);
                setFilterState((prevState: any) => ({ ...prevState, instituteCurriculumId }));
            }
        }
        else if (deleteCurriculumClassResp && prevDeleteCurriculumClassResp !== deleteCurriculumClassResp) {
            setDelClassStructModalState((prevState: any) => ({ ...prevState, showModal: false, classId: "" }));
            getClassStructureApiCall();
            toast.success("Class structure deleted successfully.")
        } else if (curriculumClassResp && prevCurriculumClassResp !== curriculumClassResp) {
            if (!addClassStructModalState.showModal) {
                setClassStructureState(JSON.parse(JSON.stringify(curriculumClassResp)));
            }
        } else if (instAcademicErrorResp && instAcademicErrorResp !== prevInstAcademicErrorResp) {
            const { details }: any = instAcademicErrorResp;
            toast.error(details || "Something went wrong");
        }
        classStructureRespRef.current.prevInstCurriculumResp = instCurriculumResp;
        classStructureRespRef.current.prevDeleteCurriculumClassResp = deleteCurriculumClassResp;
        classStructureRespRef.current.prevInstAcademicErrorResp = instAcademicErrorResp;
        classStructureRespRef.current.prevCurriculumClassResp = curriculumClassResp;
    }, [instCurriculumResp, curriculumClassResp, deleteCurriculumClassResp, instAcademicErrorResp]);

    const toggleClassStructureModal = useCallback((apiCall?: boolean) => {
        setAddClassStructModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getClassStructureApiCall();
        }
    }, [instituteId, classStructureState]);

    function addClassStructeHndlr() {
        setAddClassStructModalState((prevState: any) => ({ ...prevState, showModal: true, classId: "", modalData: undefined }));
        dispatch(resetCurriculumClassAct(undefined));
    }

    function delClassStructureHndlr(event: any) {
        const classId = event.currentTarget.getAttribute("data-id");
        if (classId)
            setDelClassStructModalState((prevState: any) => ({ ...prevState, showModal: true, classId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "delete",
        actionIcon: <i className="tw-text-red-500 ri-delete-bin-5-fill tw-text-base"></i>,
        actionName: "Delete",
        onClickHndlr: delClassStructureHndlr
    }]), [classStructureState]);

    function delModalCancelHndlr() {
        setDelClassStructModalState((prevState: any) => ({ ...prevState, showModal: false, curriculumId: "" }));
    }
    function delModalSubmitHndlr() {
        const { classId } = delClassStructModalState,
            { instituteCurriculumId } = filterState;
        dispatch(deleteCurriculumClassAct(generateActionPayload("delete_class_structure", { curriculumId: instituteCurriculumId, classId })));
    }
    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getClassStructureApiCall();
    }

    function getClassStructureApiCall(otherProps?: any, paramsCurriculumId?: any) {
        const sortingParams = getSortingKeys(sortingDetailRef.current)
        const { instituteCurriculumId, ...remainingFilters }: any = filterState,
            payload = {
                instituteCurriculumId: (paramsCurriculumId || instituteCurriculumId),
                ...remainingFilters, ...otherProps,
                ...paginationDetailRef.current, ...sortingParams
            };
        dispatch(getCurriculumClassAct(generateActionPayload("get_class_structure", undefined, payload)));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        paginationDetailRef.current.pageNo = 0;
        if (name === "instituteCurriculumId") {
            if (value) {
                getClassStructureApiCall(undefined, value);
            } else {
                setClassStructureState([]);
            }
        } else {
            getClassStructureApiCall({ [name]: value });
        }
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
            sortingDetailRef.current = sortingKeys;
            getClassStructureApiCall();
            //Testing
        } else {
            sortingDetailRef.current = sortingKeys;
        }
    }

    const classStructureColumns = useMemo(() => generateColumns(menuOptions), [classStructureState]),
        { data: classStructureList, pageNumber, totalPages, totalElements } = classStructureState || {},
        { data: instCurriculumList } = instCurriculumResp || {};
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-lg tw-shadow">

                <div className="tw-px-4 tw-py-3 tw-border-b">
                    <div className="tw-flex tw-items-center">

                        <div className="tw-flex-1">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Curriculum Class
                            </h4>
                        </div>

                        <div className="tw-ml-auto">
                            <Button
                                variant="primary"
                                onClick={addClassStructeHndlr}
                            >
                                Add Class
                            </Button>
                        </div>

                    </div>
                </div>

                <div className="tw-p-0">

                    <div className="tw-px-3 tw-py-3">
                        <form onClick={e => e.preventDefault()}>
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                                <div className="tw-col-span-12 xl:tw-col-span-4">
                                        <TextIconInput
                                            formgroupClassName="tw-relative search-box"
                                            name="instituteClassName"
                                            value={filterState.instituteClassName}
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                            onChange={onChangeFilterHndlr}
                                        >
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-[30px] tw-text-gray-400"></i>
                                        </TextIconInput>
                                </div>

                                <div className="tw-col-span-12 xl:tw-col-span-3">
                                    <SelectInput
                                        name="instituteCurriculumId"
                                        value={filterState.instituteCurriculumId}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={instCurriculumList}
                                        formgroupClassName="tw-mb-0"
                                        valueKey="instituteCurriculumId"
                                        textKey="curriculumName"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <TableContainer
                        columns={classStructureColumns || []}
                        data={(Array.isArray(classStructureList) && classStructureList) || []}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages}
                        totalRecords={totalElements}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageNumber}
                        manualSorting={true}
                        sortingHandler={sortingHandler}
                    />
                </div>
            </div>
            <ModalContainerUpdated
                id="add-class-admin"
                isOpen={addClassStructModalState.showModal}
                toggle={toggleClassStructureModal}
                modalTitle={"Add Class Structure"}
                modalSize="md"
            >
            <AddClassStructureModal
                isOpen={addClassStructModalState.showModal}
                toggle={toggleClassStructureModal}
                instituteId={instituteId}
                curriculumId={filterState.instituteCurriculumId}
                editModalData={addClassStructModalState.modalData}
            />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-class-structure-modal"
                isOpen={delClassStructModalState.showModal}
                confirmMessage="Are you sure you want to delete this curriculum class mapping?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default ClassStructure;