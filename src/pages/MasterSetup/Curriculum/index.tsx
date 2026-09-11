import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput, TextInput } from "../../../Components/Common";
import { generateColumns } from "./helper";

//Modal Component
import AddEditCurriculum from "./AddEditCurriculum";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstCurriculumAct, deleteInstCurriculumAct } from "../../../store/mastersettings/instacademics/instacademicactions";

//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";

//Interface & Types
import { ICurriculumProps } from "./curriculumtypes";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import Button from "../../../Components/Common/Button";

const Curriculum: React.FC<ICurriculumProps> = ({ instituteId, instituteName }) => {
    const [addCurriculumModalState, setAddCurriculumModalSteate] = useState<any>({
        showModal: false, curriculumId: "", modalData: undefined
    });
    const [delCurriculumModalState, setDelCurriculumModalState] = useState<any>({
        showModal: false,
        curriculumId: ""
    });
    const [filterState, setFilterState] = useState<any>({
        curriculumName: undefined
    });

    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });
    const sortingDetailRef = useRef<any>(undefined);

    const dispatch = useAppDispatch();
    const { instCurriculumResp, deleteCurriculumResp, instAcademicErrorResp } = useAppSelector(({ instAcademics }) => ({
        instCurriculumResp: instAcademics.instCurriculumResp,
        deleteCurriculumResp: instAcademics.deleteCurriculumResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp
    }), shallowEqual);

    const curriculumRespRef = useRef<any>({
        prevDeleteCurriculumResp: deleteCurriculumResp,
        prevInstAcademicErrorResp: instAcademicErrorResp
    });

    useEffect(() => {
        if (instituteId) {
            getCurriculumApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevDeleteCurriculumResp, prevInstAcademicErrorResp } = curriculumRespRef.current;
        if (deleteCurriculumResp && prevDeleteCurriculumResp !== deleteCurriculumResp) {
            setDelCurriculumModalState((prevState: any) => ({ ...prevState, showModal: false, curriculumId: "" }));
            getCurriculumApiCall();
            toast.success("Curriculum deleted successfully.")
        } else if (instAcademicErrorResp && instAcademicErrorResp !== prevInstAcademicErrorResp) {
            const { details }: any = instAcademicErrorResp;
            toast.error(details || "Something Went Wrong.");
        }
        curriculumRespRef.current.prevDeleteCurriculumResp = deleteCurriculumResp;
        curriculumRespRef.current.prevInstAcademicErrorResp = instAcademicErrorResp;
    }, [deleteCurriculumResp, instAcademicErrorResp]);

    const toggleCurriculumModal = useCallback((apiCall?: boolean) => {
        setAddCurriculumModalSteate((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getCurriculumApiCall();
        }
    }, [instituteId, instCurriculumResp]);

    function addCurriculumHndlr() {
        setAddCurriculumModalSteate((prevState: any) => ({ ...prevState, showModal: true, curriculumId: "", modalData: undefined }));
    }

    function editCurriculumHndlr(event: any) {
        const curriculumId = event.currentTarget.getAttribute("data-id"),
            modalData: any = instCurriculumResp?.data.find((item: any) => item.instituteCurriculumId === Number(curriculumId));
        if (modalData) {
            setAddCurriculumModalSteate((prevState: any) => ({ ...prevState, showModal: true, curriculumId, modalData }));
        }
    }

    function deleteCurriculumHndlr(event: any) {
        const curriculumId = event.currentTarget.getAttribute("data-id");
        if (curriculumId)
            setDelCurriculumModalState((prevState: any) => ({ ...prevState, showModal: true, curriculumId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="tw-text-blue-500 ri-pencil-fill tw-text-base"></i>,
        actionName: "Edit",
        onClickHndlr: editCurriculumHndlr,
    }, {
        id: "delete",
        actionIcon: <i className="tw-text-red-500 ri-delete-bin-5-fill tw-text-base"></i>,
        actionName: "Delete",
        onClickHndlr: deleteCurriculumHndlr
    }]), [instCurriculumResp]);

    function delModalCancelHndlr() {
        setDelCurriculumModalState((prevState: any) => ({ ...prevState, showModal: false, curriculumId: "" }));
    }
    function delModalSubmitHndlr() {
        const { curriculumId } = delCurriculumModalState;
        dispatch(deleteInstCurriculumAct(generateActionPayload("delete_inst_curriculum", { curriculumId })));
    }
    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        getCurriculumApiCall();
    }

    function getCurriculumApiCall(otherProps?: any) {
        const sortingParams = getSortingKeys(sortingDetailRef.current);
        const payload = {
            instituteId,
            ...filterState, ...otherProps, ...paginationDetailRef.current,
            ...sortingParams
        };
        dispatch(getInstCurriculumAct(generateActionPayload("get_inst_curriculum", undefined, payload)));
    }
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getCurriculumApiCall({ "curriculumName": value });
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
            sortingDetailRef.current = sortingKeys;
            getCurriculumApiCall();
            //Testing
        } else {
            sortingDetailRef.current = sortingKeys;
        }
    }


    const curriculumColumns = useMemo(() => generateColumns(menuOptions), [instCurriculumResp]),
        { data: curriculumList, pageNumber, totalPages, totalElements } = instCurriculumResp || {};
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-lg tw-shadow">
                <div className="tw-px-4 tw-py-3 tw-border-b">
                    <div className="tw-flex tw-items-center">
                        <div className="tw-flex-1">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Curriculum
                            </h4>
                        </div>
                        <div className="tw-ml-auto">
                            <Button
                                variant="primary"
                                onClick={addCurriculumHndlr}
                            >
                                Add Curriculum
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
                                            name="curriculumName"
                                            value={filterState.curriculumName}
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                            onChange={onChangeFilterHndlr}
                                        >
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-[30px] tw-text-gray-400"></i>
                                        </TextIconInput>
                                </div>
                            </div>
                        </form>
                    </div>

                    <TableContainer
                        columns={curriculumColumns || []}
                        data={curriculumList || []}
                        divClass="table-responsive tw-mb-1"
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
                id="add-department-admin"
                isOpen={addCurriculumModalState.showModal}
                toggle={toggleCurriculumModal}
                modalTitle={addCurriculumModalState.curriculumId ? "Edit Curriculum" : "Add Curriculum"}
                modalSize="md"
            >
            <AddEditCurriculum
                isOpen={addCurriculumModalState.showModal}
                toggle={toggleCurriculumModal}
                instituteId={instituteId}
                curriculumId={addCurriculumModalState.curriculumId}
                editCurriculumData={addCurriculumModalState.modalData}
            />
                </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delCurriculumModalState.showModal}
                confirmMessage="Are you sure you want to delete this curriculum ?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default Curriculum;