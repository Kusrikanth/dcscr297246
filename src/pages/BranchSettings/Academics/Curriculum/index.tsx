import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextIconInput } from "../../../../Components/Common";
import { generateColumns } from "./helper";

//Modal Component
import AddEditCurriculum from "./AddEditCurriculum";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteBranchCurriculumAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";

//Interface & Types
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import Button from "../../../../Components/Common/Button";

const Curriculum: React.FC<any> = ({ branchId, instituteId }) => {
    const [curriculumModalState, setCurriculumModalState] = useState<any>(
        { showModal: false, curriculumId: undefined, modalData: undefined });
    const [filterState, setFilterState] = useState({
        curriculumName: "",
        academicYearId : "",
    });
    const [delCurriculumState, setDelCurriculumState] = useState<any>({
        showModal: false,
        curriculumId: ""
    })
    const dispatch = useAppDispatch();
    const { brchCurriculumResp, deleteBrchCurriculumResp, instAcademicErrorResp,academicYearListResp,
        brchAcademicErrorResp } = useAppSelector(({ instAcademics, branchAcademics }) => ({
            instCurriculumResp: instAcademics.instCurriculumResp,
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            deleteBrchCurriculumResp: branchAcademics.deleteBrchCurriculumResp,
            instAcademicErrorResp: instAcademics.instAcademicErrorResp,
            brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp
        }), shallowEqual);

    const curriculumRespRef = useRef<any>({
        prevInstAcademicErrorResp: instAcademicErrorResp,
        prevDeleteBrchCurriculumResp: deleteBrchCurriculumResp,
        prevBrchAcademicErrorResp: brchAcademicErrorResp
    });

    useEffect(() => {
        const { prevDeleteBrchCurriculumResp, prevInstAcademicErrorResp, prevBrchAcademicErrorResp } = curriculumRespRef.current;
        if (deleteBrchCurriculumResp && deleteBrchCurriculumResp !== prevDeleteBrchCurriculumResp) {
            setDelCurriculumState((prevState: any) => ({ ...prevState, showModal: false, curriculumId: "" }));
            getCurriculumApiCall();
            toast.success("Curriculum deleted successfully.")
        } else if (instAcademicErrorResp && instAcademicErrorResp !== prevInstAcademicErrorResp) {
            const { details }: any = instAcademicErrorResp;
            toast.error(details);
        } else if (brchAcademicErrorResp && brchAcademicErrorResp !== prevBrchAcademicErrorResp) {
            const { details }: any = brchAcademicErrorResp;
            toast.error(details);
        }
        curriculumRespRef.current.prevDeleteBrchCurriculumResp = deleteBrchCurriculumResp;
        curriculumRespRef.current.prevInstAcademicErrorResp = instAcademicErrorResp;
        curriculumRespRef.current.prevBrchAcademicErrorResp = brchAcademicErrorResp;
    }, [deleteBrchCurriculumResp, brchAcademicErrorResp, instAcademicErrorResp]);

    useEffect(() => {
        if(academicYearListResp){
            const yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId || ""
            getCurriculumApiCall({ academicYearId: yearId })
            setFilterState((prevState) => ({ ...prevState, academicYearId: yearId }))
        }
        }, [academicYearListResp]);

    function addCurriculumHndlr() {
        setCurriculumModalState((prevState: any) => ({ ...prevState, showModal: true, curriculumId: "", modalData: undefined }));
    }

    const toggleCurriculumModal = useCallback((apiCall?: boolean) => {
        setCurriculumModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal, curriculumId: "", modalData: "" }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getCurriculumApiCall();
        }
    }, [instituteId, brchCurriculumResp]);

    function delBranchCurriculumHndlr(event: any) {
        const curriculumId: string = event.currentTarget.getAttribute("data-id");
        if (curriculumId)
            setDelCurriculumState((prevState: any) => ({ ...prevState, showModal: true, curriculumId }));

    }
    function getCurriculumApiCall(otherProps?: any) {
        const payload = { branchId, ...filterState, ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "delete",
            actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
            actionName: "Delete",
            onClickHndlr: delBranchCurriculumHndlr
        }]), [brchCurriculumResp]);


    function delModalCancelHndlr() {
        setDelCurriculumState((prevState: any) => ({ ...prevState, showModal: false, curriculumId: "" }));
    }

    function paginationHndlr(paginationInfo: any) {
        getCurriculumApiCall(paginationInfo);
    }


    function delModalSubmitHndlr() {
        const { curriculumId } = delCurriculumState,
            params = { curriculumId, branchId , academicYearId: filterState.academicYearId };
        dispatch(deleteBranchCurriculumAct(generateActionPayload("delete_brch_curriculum", params)));
    }
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if(name === "academicYearId"){
            if(value){
                getCurriculumApiCall({ [name]: value });
                setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
            }
        }else{
            getCurriculumApiCall({ [name]: value });
            setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        }
    }

    const curriculumColumns = useMemo(() => generateColumns(menuOptions), []),
        { data: curriculumList, pageNumber, totalPages, totalElements } = brchCurriculumResp || {};
    return (
        <React.Fragment>
            <div className="tw-py-3 tw-px-3">
                <form onClick={(e) => e.preventDefault()}>

                    <div className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-3 tw-items-end tw-pt-3 tw-pb-1">

                        <div className="xl:tw-col-span-4">
                            <TextIconInput
                                formgroupClassName="search-box tw-mb-0"
                                name="curriculumName"
                                value={filterState.curriculumName}
                                placeHolder="Search"
                                labelText="Search"
                                floatingLabel
                                onChange={onChangeFilterHndlr}
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        <div className="xl:tw-col-span-3">
                            <SelectInput
                                name="academicYearId"
                                value={filterState.academicYearId}
                                onChange={onChangeFilterHndlr}
                                menuItems={academicYearListResp?.data}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="tw-mb-0"
                                labelText="Academic Year"
                                floatingLabel
                            />
                        </div>

                        <div className="tw-flex xl:tw-col-span-5 xl:tw-justify-end">
                            <Button
                                variant="primary"
                                onClick={addCurriculumHndlr}
                            >
                                Add Curriculum
                            </Button>
                        </div>

                    </div>

                </form>
            </div>
            <TableContainer
                columns={curriculumColumns || []}
                data={Array.isArray(curriculumList) ? curriculumList : []}
                divClass="table-responsive mb-1"
                theadClass="table-light text-muted align-middle table-nowrap"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
            />
             <ModalContainerUpdated
                id="add-curriculum-modal"
                isOpen={curriculumModalState.showModal}
                toggle={toggleCurriculumModal}
                modalTitle={curriculumModalState.curriculumId ? "Edit Curriculum" : "Add Curriculum"}
                modalSize="lg"
            >
            <AddEditCurriculum
                isOpen={curriculumModalState.showModal}
                toggle={toggleCurriculumModal}
                curriculumId={curriculumModalState.curriculumId}
                instituteId={instituteId}
                branchId={branchId}
                editRoleDetails={curriculumModalState.modalData}
            />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-branch-curriculum-modal"
                isOpen={delCurriculumState.showModal}
                confirmMessage="Are you sure you want to delete this curriculum ?"
                cancelHndlr={delModalCancelHndlr}
                showImgIcon={true}
                iconType="reject"
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default Curriculum;