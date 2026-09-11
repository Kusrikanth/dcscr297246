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
import AddEditSections from "./AddEditSections";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {  getBrchSectionsAct, getBranchCurriculumAct, deleteBrchSectionAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
//Utility
import {  debounce } from "../../../../utility/commonutility";

//Interface & Types
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import Button from "../../../../Components/Common/Button";

const Sections: React.FC<any> = ({ instituteId, branchId }) => {
    const [addSectionModalState, setAddSectionModalState] = useState<any>({
        showModal: false, classId: "", modalData: undefined
    });
    const [delBranchSectionState, setDelBranchSectionState] = useState<any>({
        showModal: false,
        classId: ""
    });
    const [brnchCurriculumState, setBranchCurriculumState] = useState<any>([]);
    const [filterState, setFilterState] = useState<any>({
        searchString: undefined,
        academicYearId: undefined,
        branchCurriculumId: undefined,
    });

    const dispatch = useAppDispatch();
    const { brchCurriculumResp, brchSectionsResp, deleteBrchSectionResp, academicYearListResp, brchAcademicErrorResp, instAcademicErrorResp } = useAppSelector((
        { branchAcademics, instAcademics }) => ({
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            brchSectionsResp: branchAcademics.brchSectionsResp,
            deleteBrchSectionResp: branchAcademics.deleteBrchSectionResp,
            academicYearListResp: instAcademics.academicYearListResp,
            brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp,
            instAcademicErrorResp: instAcademics.instAcademicErrorResp,
        }), shallowEqual);

    const branchClassRespRef = useRef<any>({
        prevBrchSectionsResp: brchSectionsResp,
        prevDeleteBrchSectionResp: deleteBrchSectionResp,
        prevAcademicYearListResp: academicYearListResp,
        prevBrchCurriculumResp: brchCurriculumResp,
        prevBrchAcademicErrorResp: brchAcademicErrorResp,
        prevInstAcademicErrorResp: instAcademicErrorResp
    });

    useEffect(() => {
        if (instituteId) {
            const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageSize: 100, pageNo: 0 };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        }
    }, [instituteId]);

    useEffect(() => {
        if (branchId) {
            const params = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, params)));
        }
        // getSectionApiCall();
    }, [branchId]);

    useEffect(() => {
        const { prevBrchSectionsResp, prevDeleteBrchSectionResp,
            prevAcademicYearListResp, prevBrchCurriculumResp, prevBrchAcademicErrorResp, prevInstAcademicErrorResp } = branchClassRespRef.current;

        if (brchCurriculumResp && prevBrchCurriculumResp !== brchCurriculumResp) {
            const { data }: any = brchCurriculumResp;
            if (Array.isArray(data) && data.length > 0) {
                const { branchCurriculumId } = data[0];
                setFilterState((prevState: any) => ({ ...prevState, branchCurriculumId }));
                if (branchCurriculumId && filterState.academicYearId) {
                    getSectionApiCall({ branchCurriculumId, academicYearId: filterState.academicYearId })
                }
            }
        }
        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            if (Array.isArray(academicYearListResp?.data)) {
                const { academicYearId } = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
                setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
                if (academicYearId && filterState.branchCurriculumId) {
                    getSectionApiCall({ academicYearId, branchCurriculumId: filterState.branchCurriculumId })
                }
            }
        }
        if (deleteBrchSectionResp && prevDeleteBrchSectionResp !== deleteBrchSectionResp) {
            toast.success("Class section deleted successfully.");
            setDelBranchSectionState((prevState: any) => ({ ...prevState, showModal: false, classId: "" }));
            getSectionApiCall();
        } else if (brchAcademicErrorResp && brchAcademicErrorResp !== prevBrchAcademicErrorResp) {
            const { details }: any = brchAcademicErrorResp;
            toast.error(details);
        } else if (instAcademicErrorResp && instAcademicErrorResp !== prevInstAcademicErrorResp) {
            const { details }: any = instAcademicErrorResp;
            toast.error(details);
        }
        branchClassRespRef.current.prevAcademicYearListResp = academicYearListResp;
        branchClassRespRef.current.prevBrchCurriculumResp = brchCurriculumResp;
        branchClassRespRef.current.prevBrchAcademicErrorResp = brchAcademicErrorResp;
        branchClassRespRef.current.prevDeleteBrchSectionResp = deleteBrchSectionResp;
        // branchClassRespRef.current.prevBrchSectionsResp = brchSectionsResp;
        branchClassRespRef.current.prevInstAcademicErrorResp = instAcademicErrorResp;
    }, [academicYearListResp, brchCurriculumResp, deleteBrchSectionResp, brchAcademicErrorResp, instAcademicErrorResp]);

    const toggleSectionModal = useCallback((apiCall?: boolean) => {
        setAddSectionModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal, classId: "" }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getSectionApiCall();
        }
    }, [branchId, filterState, brchSectionsResp]);

    function delSectionHndlr(event: any) {
        const classId = event.currentTarget.getAttribute("data-id");
        if (classId)
            setDelBranchSectionState((prevState: any) => ({ ...prevState, showModal: true, classId }));
    }

    // function addSectionHndlr(event: any) {
    //     const classId = event.currentTarget.getAttribute("data-id"),
    //         modalData: any = brchSectionsResp?.find((item: any) => item.classId === classId);
    //     if (modalData)
    //         setAddSectionModalState((prevState: any) => ({ ...prevState, showModal: true, classId, modalData, modalAction: "add" }))

    // }

    function delModalCancelHndlr() {
        setDelBranchSectionState((prevState: any) => ({ ...prevState, showModal: false, classId: "" }));
    }

    function delModalSubmitHndlr() {
        const { classId } = delBranchSectionState;
        dispatch(deleteBrchSectionAct(generateActionPayload("delete_brch_section", { branchClassId: classId })));
    }

    function addSectionHndlr() {
        setAddSectionModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal, modalData: undefined }))
    }
    function editSectionHndlr(event: any) {
        const classId = event.currentTarget.getAttribute("data-id"),
            modalData: any = brchSectionsResp?.data.find((item: any) => item.branchClassId === +classId);
        if (modalData) {
            setAddSectionModalState((prevState: any) => ({ ...prevState, showModal: true, classId, modalData }))
        }
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "edit",
            actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
            actionName: "Edit",
            onClickHndlr: editSectionHndlr,
        }, 
        // {
        //     id: "delete",
        //     actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        //     actionName: "Delete",
        //     onClickHndlr: delSectionHndlr
        // }
    ]), [brchSectionsResp]);

    function paginationHndlr(paginationInfo: any) {
        getSectionApiCall(paginationInfo);
    }

    function getSectionApiCall(otherProps?: any) {
        const payload = { ...filterState, ...otherProps, branchId };
        dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload)));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (!value && name === "branchCurriculumId") {
            return;
        }
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getSectionApiCall({ [name]: value });
    }


    const debouncedHandler = useCallback(debounce((searchKey: any, searchValue: any) => {
        getSectionApiCall({ [searchKey]: searchValue });
    }, 200), [brchSectionsResp]);
    function onSearchHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        debouncedHandler(name, value);
    }

    const sectionColumns = useMemo(() => generateColumns(menuOptions), [brchSectionsResp]),
        { data: sectionsList, pageNumber, totalPages, totalElements } = brchSectionsResp || {};
    return (
        <React.Fragment>
            <div className="tw-py-3 tw-px-3">
                <form onClick={(e) => e.preventDefault()}>
                    <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-3 tw-items-end tw-pt-3 tw-pb-1">

                        <div className="lg:tw-col-span-4">
                            <TextIconInput
                                formgroupClassName="search-box"
                                name="searchString"
                                value={filterState.searchString}
                                placeHolder="Search"
                                labelText="Search"
                                floatingLabel
                                onChange={onSearchHandler}
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        <div className="xl:tw-col-span-2 lg:tw-col-span-3">
                            <SelectInput
                                name="academicYearId"
                                value={filterState.academicYearId}
                                onChange={onChangeFilterHndlr}
                                menuItems={academicYearListResp?.data}
                                formgroupClassName="tw-mb-0"
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                labelText="Academic Year"
                                floatingLabel
                            />
                        </div>

                        <div className="xl:tw-col-span-3 lg:tw-col-span-3">
                            <SelectInput
                                name="branchCurriculumId"
                                value={filterState.branchCurriculumId}
                                onChange={onChangeFilterHndlr}
                                menuItems={brchCurriculumResp?.data}
                                formgroupClassName="tw-mb-0"
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                labelText="Curriculum"
                                floatingLabel
                            />
                        </div>

                        <div className="tw-flex lg:tw-col-span-3 tw-justify-start lg:tw-justify-end">
                            <Button
                                type="submit"
                                variant="primary"
                                onClick={addSectionHndlr}
                            >
                                Add Section
                            </Button>
                        </div>

                    </div>
                </form>
            </div>
            <TableContainer
                columns={sectionColumns || []}
                data={(Array.isArray(sectionsList) && sectionsList) || []}
                divClass="table-responsive mb-1"
                theadClass="table-light text-muted align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
            />
            <ModalContainerUpdated
                id="add-sections-modal"
                isOpen={addSectionModalState.showModal}
                toggle={toggleSectionModal}
                modalTitle={addSectionModalState?.classId ? "Edit Section" : "Add Section"}
                modalSize="md"
            >
            <AddEditSections
                isOpen={addSectionModalState.showModal}
                toggle={toggleSectionModal}
                branchId={branchId}
                instituteId={instituteId}
                classId={addSectionModalState.classId}
                curriculumListData={brnchCurriculumState}
                editSectionDetails={addSectionModalState.modalData}
            />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delBranchSectionState.showModal}
                confirmMessage="Are you sure you want to delete this branch class?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default Sections;
