import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { ConfirmationModal, TextIconInput, SelectInput, ModalContainerUpdated } from "../../../../Components/Common";
import { generateColumns } from "./helper";

//Modal Component
import AddStreamGroup from "./AddStreamGroup";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteBrchStreamGroupAct, getBrchStreamGroupsAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {

    getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
//Interface & Types
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import Button from "../../../../Components/Common/Button";

const StreamGroup: React.FC<any> = ({ branchId, instituteId }) => {
    const [addStreamGroupModalState, setStreamGroupModalState] = useState<any>(
        { showModal: false, streamGroupId: undefined, modalData: undefined });
    const [classListState, setClassListState] = useState([]);

    const [delTermInfoState, setDelTermInfoState] = useState<any>({
        showModal: false,
        streamGroupId: ""
    })
    const [filterState, setFilterState] = useState<any>({
        searchString: "",
        academicYearId: "",
        curriculumId: "",
        classId: "",
    });
    const dispatch = useAppDispatch();
    const { brchCurriculumResp, branchClassResp, brchStreamGroupsResp, deleteBrchStreamGroupResp,
        academicYearListResp,
        brchAcademicErrorResp } = useAppSelector(({ instAcademics, branchAcademics }) => ({
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            brchStreamGroupsResp: branchAcademics.brchStreamGroupsResp,
            deleteBrchStreamGroupResp: branchAcademics.deleteBrchStreamGroupResp,
            academicYearListResp: instAcademics.academicYearListResp,
            brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp
        }), shallowEqual);

    const termInfoRespRef = useRef<any>({
        prevAcademicYearListResp: academicYearListResp,
        prevBrchCurriculumResp: brchCurriculumResp,
        prevDeleteBrchStreamGroupResp: deleteBrchStreamGroupResp,
        prevBranchClassResp: branchClassResp,
        prevBrchAcademicErrorResp: brchAcademicErrorResp
    });
    useEffect(() => {
        if (instituteId) {
            const payload = { instituteId, pageNumber: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc", };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        }
    }, [instituteId]);

    useEffect(() => {
        if (branchId) {
            const params = { branchId, pageSize: 100, pageNo: 0, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, params)));
        }
    }, [branchId]);


    useEffect(() => {
        const { prevAcademicYearListResp, prevBrchCurriculumResp, prevDeleteBrchStreamGroupResp, prevBranchClassResp, prevBrchAcademicErrorResp } = termInfoRespRef.current;
        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            if (Array.isArray(academicYearListResp?.data)) {
                const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {},
                    { curriculumId } = filterState;
                setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
                if (curriculumId) {
                    getStreamGroupsApiCall({ academicYearId, curriculumId });
                }
            }
        }
        if (brchCurriculumResp && prevBrchCurriculumResp !== brchCurriculumResp) {
            const { branchCurriculumId } = brchCurriculumResp?.data[0] || {},
                { academicYearId } = filterState;
            setFilterState((prevState: any) => ({ ...prevState, curriculumId: branchCurriculumId }));
            if (academicYearId && branchCurriculumId) {
                getClassApiCall(branchCurriculumId);
                getStreamGroupsApiCall({ academicYearId, curriculumId: branchCurriculumId });
            }
        }
        else if (deleteBrchStreamGroupResp && deleteBrchStreamGroupResp !== prevDeleteBrchStreamGroupResp) {
            setDelTermInfoState((prevState: any) => ({ ...prevState, showModal: false, streamGroupId: "" }));
            getStreamGroupsApiCall();
            toast.success("Stream Group deleted successfully.");
        }
        else if (branchClassResp && branchClassResp !== prevBranchClassResp) {
            const { content }: any = branchClassResp;
            setClassListState(content || []);
        } else if (brchAcademicErrorResp && brchAcademicErrorResp !== prevBrchAcademicErrorResp) {
            const { message }: any = brchAcademicErrorResp;
            toast.error(message);
        }
        termInfoRespRef.current.prevAcademicYearListResp = academicYearListResp;
        termInfoRespRef.current.prevBrchCurriculumResp = brchCurriculumResp;
        termInfoRespRef.current.prevDeleteBrchStreamGroupResp = deleteBrchStreamGroupResp;
        termInfoRespRef.current.prevBrchAcademicErrorResp = brchAcademicErrorResp;
    }, [academicYearListResp, brchCurriculumResp, deleteBrchStreamGroupResp, branchClassResp, brchAcademicErrorResp]);

    function addStreamGroupHndlr() {
        setStreamGroupModalState((prevState: any) => ({ ...prevState, showModal: true, streamGroupId: "", modalData: undefined }));
    }

    const toggleTermInfoHndlr = useCallback((apiCall?: boolean) => {
        setStreamGroupModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal, streamGroupId: "", modalData: "" }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getStreamGroupsApiCall();
        }
    }, [instituteId, brchStreamGroupsResp]);

    function editStreamGroupHndlr(event: any) {
        const streamGroupId = event.currentTarget.getAttribute("data-id"),
            modalData: any = brchStreamGroupsResp?.content?.find((item: any) => item.id === +streamGroupId);
        if (modalData) {
            setStreamGroupModalState((prevState: any) => ({ ...prevState, showModal: true, streamGroupId, modalData }))
        }
    }

    function delStreamGroupHndlr(event: any) {
        const streamGroupId: string = event.currentTarget.getAttribute("data-id");
        if (streamGroupId)
            setDelTermInfoState((prevState: any) => ({ ...prevState, showModal: true, streamGroupId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "edit",
            actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
            actionName: "Edit",
            onClickHndlr: editStreamGroupHndlr,
        },
        {
            id: "delete",
            actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
            actionName: "Delete",
            onClickHndlr: delStreamGroupHndlr
        }]), [brchStreamGroupsResp]);


    function delModalCancelHndlr() {
        setDelTermInfoState((prevState: any) => ({ ...prevState, showModal: false, streamGroupId: "" }));
    }

    function paginationHndlr(paginationInfo: any) {
        getStreamGroupsApiCall(paginationInfo);
    }
    function delModalSubmitHndlr() {
        const { streamGroupId } = delTermInfoState;
        if (streamGroupId)
            dispatch(deleteBrchStreamGroupAct(generateActionPayload("delete_stream_group", { streamGroupId })));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        getStreamGroupsApiCall({ [name]: value });
        if (name === "curriculumId") {
            setClassListState([]);
            setFilterState((prevState: any) => ({ ...prevState, classId: "", [name]: value }));
            if (value) {
                getClassApiCall(value);
            }
        }
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));

    }
    function getStreamGroupsApiCall(otherProps?: any) {
        const payload = { branchId, ...filterState, ...otherProps };
        dispatch(getBrchStreamGroupsAct(generateActionPayload("get_stream_groups", undefined, payload)));
    }

    function getClassApiCall(curriculumId: string | undefined) {
        const payload = { curriculumId, branchId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc" };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }


    const academicYearColumns = useMemo(() => generateColumns(menuOptions), [brchStreamGroupsResp]),
        { content: academicYearList, pageNumber, totalPages, totalElements } = brchStreamGroupsResp || {};
    return (
        <React.Fragment>

            <div className="tw-py-3 tw-px-3">
                <form onClick={(e) => e.preventDefault()}>
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-pt-3 tw-pb-1">

                        <div className="tw-col-span-6 xl:tw-col-span-4">
                            <TextIconInput
                                formgroupClassName="tw-w-full"
                                name="searchString"
                                value={filterState.searchString}
                                placeHolder="Search"
                                labelText="Search"
                                floatingLabel
                                onChange={onChangeFilterHndlr}
                            >
                                <i className="ri-search-line tw-text-gray-400" />
                            </TextIconInput>
                        </div>

                        <div className="tw-col-span-6 xl:tw-col-span-3">
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

                        <div className="tw-col-span-6 xl:tw-col-span-3">
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

                        <div className="tw-col-span-6 xl:tw-col-span-2">
                            <SelectInput
                                name="classId"
                                value={filterState.classId}
                                onChange={onChangeFilterHndlr}
                                menuItems={classListState}
                                formgroupClassName="tw-mb-0"
                                valueKey="id"
                                textKey="shortName"
                                labelText="Class"
                                floatingLabel
                            />
                        </div>

                        <div className="tw-col-span-12 tw-flex tw-justify-end">
                            <Button
                                type="button"
                                onClick={addStreamGroupHndlr}
                                variant="primary"
                            >
                                Add Stream Group
                            </Button>
                        </div>

                    </div>
                </form>
            </div>
            <TableContainer
                columns={academicYearColumns || []}
                data={academicYearList || []}
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
            />
             <ModalContainerUpdated
                id="add-streams-modal"
                isOpen={addStreamGroupModalState.showModal}
                toggle={toggleTermInfoHndlr}
                modalTitle={addStreamGroupModalState.streamGroupId ? "Edit Stream Group" : "Add Stream Group"}
                modalSize="lg"
            >
            <AddStreamGroup
                isOpen={addStreamGroupModalState.showModal}
                toggle={toggleTermInfoHndlr}
                streamGroupId={addStreamGroupModalState.streamGroupId}
                instituteId={instituteId}
                branchId={branchId}
                editRoleDetails={addStreamGroupModalState.modalData}
            />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-branch-academic-year-modal"
                isOpen={delTermInfoState.showModal}
                confirmMessage="Are you sure you want to delete this Stream Group?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default StreamGroup;