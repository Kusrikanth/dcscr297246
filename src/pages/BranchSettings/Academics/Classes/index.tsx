import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput } from "../../../../Components/Common";

import { SelectInput } from "../../../../Components/Common";

import { generateColumns } from "./helper";

//Modal Component
import AddClassModal from "./AddClassModal";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteBranchClassAct, getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";

//Interface & Types
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    searchString: "",
    curriculumId: "",
    academicYearId : ""
}

const BranchClass: React.FC<any> = ({ instituteId, branchId }) => {
    const [addClassModalState, setAddClassModalState] = useState({
        showModal: false, classId: "", modalData: undefined
    });
    const [delClassModalState, setDelClassModalState] = useState({
        showModal: false,
        classId: ""
    });
    const [filterState, setFilterState] = useState(initialValues);

    const paginationRef = useRef({ pageNo: 0, pageSize: 10 });

    const dispatch = useAppDispatch();
    const { academicCurrciulumResp, brchCurriculumResp, branchClassResp, deleteBrchClassResp, brchAcademicErrorResp,academicYearListResp ,showApiLoader} = useAppSelector((
        { masterData, branchAcademics , instAcademics,globalData }) => ({
            academicCurrciulumResp: masterData.academicCurrciulumResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            deleteBrchClassResp: branchAcademics.deleteBrchClassResp,
            brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp,
            academicYearListResp: instAcademics.academicYearListResp,
            showApiLoader : globalData.showApiLoader,
        }), shallowEqual);

    const branchClassRespRef = useRef({
        prevAcademicCurrciulumResp: academicCurrciulumResp,
        prevBrchCurriculumResp: brchCurriculumResp,
        prevDeleteBrchClassResp: deleteBrchClassResp,
        prevBrchAcademicErrorResp: brchAcademicErrorResp
    });

    useEffect(() => {
        if(academicYearListResp){
            const yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId || ""
            getCurriculumApiCall({ academicYearId: yearId })
            setFilterState((prevState) => ({ ...prevState, academicYearId: yearId }))
        }
    }, [academicYearListResp]);

    useEffect(() => {
        const { prevBrchCurriculumResp, prevDeleteBrchClassResp, prevBrchAcademicErrorResp } = branchClassRespRef.current;
        if (brchCurriculumResp && prevBrchCurriculumResp !== brchCurriculumResp) {
            if (brchCurriculumResp && brchCurriculumResp?.numberOfElements > 0) {
                const { branchCurriculumId } = brchCurriculumResp?.data[0] || {};
                if (branchCurriculumId) {
                    getClassApiCall({ curriculumId: branchCurriculumId});
                    setFilterState((prevState: any) => ({ ...prevState, curriculumId: branchCurriculumId }));
                }
            }
        }
        else if (deleteBrchClassResp && prevDeleteBrchClassResp !== deleteBrchClassResp) {
            setDelClassModalState((prevState: any) => ({ ...prevState, showModal: false, classId: "" }));
            getClassApiCall();
            toast.success("Classes deleted successfully.")
        } else if (brchAcademicErrorResp && brchAcademicErrorResp !== prevBrchAcademicErrorResp) {
            const { details }: any = brchAcademicErrorResp;
            toast.error(details);
        }
        branchClassRespRef.current.prevBrchCurriculumResp = brchCurriculumResp;
        branchClassRespRef.current.prevDeleteBrchClassResp = deleteBrchClassResp;
        branchClassRespRef.current.prevBrchAcademicErrorResp = brchAcademicErrorResp;
    }, [ brchCurriculumResp, deleteBrchClassResp, brchAcademicErrorResp]);

    const toggleClassStructureModal = useCallback((apiCall?: boolean) => {
        setAddClassModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal, curriculumId: "" }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getClassApiCall();
        }
    }, [branchId, branchClassResp]);

    function addClassStructeHndlr() {
        setAddClassModalState((prevState: any) => ({ ...prevState, showModal: true, curriculumId: "", modalData: undefined }));
    }

    function delClassStructureHndlr(event: any) {
        const classId = event.currentTarget.getAttribute("data-id");
        if (classId)
            setDelClassModalState((prevState: any) => ({ ...prevState, showModal: true, classId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
        const findData = branchClassResp?.content?.find((item: any) => +item.id === +id);
        const { curriculumId } = findData || {};
        setAddClassModalState((prevState: any) => ({ ...prevState, showModal: true, curriculumId, modalData:findData }));
        },
      },
    //   {
    //     id: "delete",
    //     actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
    //     actionName: "Delete",
    //     onClickHndlr: delClassStructureHndlr
    // }
    ]), [branchClassResp]);

    function delModalCancelHndlr() {
        setDelClassModalState((prevState: any) => ({ ...prevState, showModal: false, curriculumId: "" }));
    }
    function delModalSubmitHndlr() {
        const { classId } = delClassModalState;
        dispatch(deleteBranchClassAct(generateActionPayload("del_brch_curriculum_class", { classId , academicYearId: filterState.academicYearId })));
    }
    function paginationHndlr(paginationInfo: any) {
        paginationRef.current = paginationInfo;
        getClassApiCall(paginationInfo);
    }

    function getCurriculumApiCall(otherProps?: any) {
        const payload = { branchId, ...filterState, ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
    }

    function getClassApiCall(otherProps?: any) {
        const payload = { branchId,...filterState,...paginationRef.current, ...otherProps, };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        paginationRef.current.pageNo = 0
        const { name, value } = event.target;
        if(name === "academicYearId") {
            if(value){
                getCurriculumApiCall({ [name]: value });
                setFilterState((prevState) => ({ ...prevState, [name]: value }));
            }
        }
        else if (name === "curriculumId") {
            if (value) {
                getClassApiCall({ [name]: value });
                setFilterState((prevState) => ({ ...prevState, [name]: value }));
            }
        } else {
            setFilterState((prevState) => ({ ...prevState, [name]: value }));
            getClassApiCall({ [name]: value });
        }
    }
    const classColumns = useMemo(() => generateColumns(menuOptions), [branchClassResp]),
        { content: classList, pageNumber, totalPages, totalElements } = branchClassResp || {};
    return (
        <React.Fragment>
            <div className="tw-py-3 tw-px-3">
                <div>
                    <div className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-3 tw-items-end tw-pt-3 tw-pb-1">

                        <div className="xl:tw-col-span-4">
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

                        <div className="xl:tw-col-span-3">
                            <SelectInput
                                name="curriculumId"
                                value={filterState.curriculumId}
                                onChange={onChangeFilterHndlr}
                                menuItems={brchCurriculumResp?.data}
                                formgroupClassName="tw-mb-0"
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                labelText="Curriculum"
                                floatingLabel
                            />
                        </div>

                        <div className="tw-flex xl:tw-col-span-2 xl:tw-justify-end">
                            <Button
                                variant="primary"
                                onClick={addClassStructeHndlr}
                            >
                                Add Class
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
            <TableContainer
                columns={classColumns || []}
                data={(Array.isArray(classList) && classList) || []}
                divClass="table-responsive mb-1"
                theadClass="table-light text-muted align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
            />
                <ModalContainerUpdated
                id="add-classes-modal"
                isOpen={addClassModalState.showModal}
                toggle={toggleClassStructureModal}
                modalTitle={addClassModalState.classId ? "Edit Class" : "Add Class"}
                modalSize="xl"
            >
            <AddClassModal
                isOpen={addClassModalState.showModal}
                toggle={toggleClassStructureModal}
                classId={addClassModalState.classId}
                branchId={branchId}
                instituteId={instituteId}
                curriculumId={filterState.curriculumId}
                modalData={addClassModalState.modalData}
                academicYearId={filterState.academicYearId}
            />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delClassModalState.showModal}
                confirmMessage="Are you sure you want to delete this curriculum class mapping?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon
                iconType="reject"
                isDisble={showApiLoader}
            />
        </React.Fragment >
    )
}

export default BranchClass;