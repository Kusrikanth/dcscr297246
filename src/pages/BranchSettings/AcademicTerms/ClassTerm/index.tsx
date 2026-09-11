import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";

//Modal Component
import AddEditClassTerm from "./AddEditClassTerm";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppSelector } from "../../../../hooks/storehook";
import { ConfirmationModal, ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import { useFormik } from "formik";
import { delClassWiseTermDateAct, getBranchClassAct, getBranchCurriculumAct, getClassWiseTermDateAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { IClassTermsRespRef, IDelTermsModalState } from "./ClassTermTypes";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sortRef } from "../../../MasterSetup/Terms/academictermstypes";
import Button from "../../../../Components/Common/Button";

interface IClassTermProps {
    instituteId: string,
    instituteName: string,
    branchId: string
}
interface ITermsModalState {
    showModal: boolean,
    branchId: string,
    modalData: any;
}

const ClassTerm: React.FC<IClassTermProps> = ({ instituteId, branchId }) => {
    const dispatch = useDispatch();
    const [academicTermsModalState, setAcademicTermsModalState] = useState<ITermsModalState>({ showModal: false, branchId: branchId, modalData: undefined });
    const [classList, setClassList] = useState([]);
    const [filterRef, setFilterRef] = useState({ pageNo: 0, pageSize: 10, sortBy: "termName", orderBy: "asc" });
    const { academicYearListResp, brchCurriculumResp, branchClassResp, classWiseTermsDateResp, deleteClassWiseTermsDateResp, updateClassWiseTermsDateResp, addClassWiseTermsDateResp, brchAcademicErrorResp } = useAppSelector(
        ({ instAcademics, branchAcademics }: any) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            classWiseTermsDateResp: branchAcademics.classWiseTermsDateResp,
            deleteClassWiseTermsDateResp: branchAcademics.deleteClassWiseTermsDateResp,
            updateClassWiseTermsDateResp: branchAcademics.updateClassWiseTermsDateResp,
            addClassWiseTermsDateResp: branchAcademics.addClassWiseTermsDateResp,
            brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp
        }),
        shallowEqual
    );
    const [delTermsModalState, setDelTermsModalState] = useState<IDelTermsModalState>({
        showModal: false,
        termId: ""
    });
    const classTermsRespRef = useRef<IClassTermsRespRef>({
        prevDeleteClassTermResp: deleteClassWiseTermsDateResp,
        prevAddClassTermResp: addClassWiseTermsDateResp,
        prevUpdateClassTermResp: updateClassWiseTermsDateResp,
        prevClassTermErrorResp: brchAcademicErrorResp,
    });
    useEffect(() => {

        const {
            prevDeleteClassTermResp,
            prevUpdateClassTermResp,
            prevClassTermErrorResp,
            prevAddClassTermResp,
        } = classTermsRespRef.current;
        if (
            deleteClassWiseTermsDateResp &&
            deleteClassWiseTermsDateResp !== prevDeleteClassTermResp
        ) {
            setDelTermsModalState((prevState) => ({
                ...prevState,
                showModal: false,
                termId: "",
            }));
            getClassWiseTermsDateApiCall();
            toast.success("Class term deleted successfully.");
        }
        else if (
            updateClassWiseTermsDateResp &&
            updateClassWiseTermsDateResp !== prevUpdateClassTermResp
        ) {
            setAcademicTermsModalState((prevState) => ({
                ...prevState,
                showModal: false,
                termId: "",
            }));
            getClassWiseTermsDateApiCall();
            toast.success("Class term Updated successfully.");
        }
        else if (
            addClassWiseTermsDateResp &&
            addClassWiseTermsDateResp !== prevAddClassTermResp
        ) {
            setAcademicTermsModalState((prevState) => ({
                ...prevState,
                showModal: false,
                termId: "",
            }));
            getClassWiseTermsDateApiCall();
            toast.success("Class term Added successfully.");
        }
        else if (
            brchAcademicErrorResp &&
            brchAcademicErrorResp !== prevClassTermErrorResp
        ) {
            const { message }: any = brchAcademicErrorResp;
            toast.error(message);
        }
        classTermsRespRef.current.prevDeleteClassTermResp =
            deleteClassWiseTermsDateResp;
        classTermsRespRef.current.prevUpdateClassTermResp =
            updateClassWiseTermsDateResp;
        classTermsRespRef.current.prevAddClassTermResp =
            addClassWiseTermsDateResp;
        classTermsRespRef.current.prevClassTermErrorResp =
            brchAcademicErrorResp;
    }, [deleteClassWiseTermsDateResp, updateClassWiseTermsDateResp, brchAcademicErrorResp, addClassWiseTermsDateResp]);


    function deleteAcademicTermHndlr(event: any) {
        const termId: string = event.currentTarget.getAttribute("data-id");
        if (termId)
            setDelTermsModalState(prevState => ({ ...prevState, showModal: true, termId }));
    }
    function editAcademicTermHndlr(event: any) {
        const termId = event.currentTarget.getAttribute("data-id");

        let modalData: any = classTermsDate?.find(
            (item: any) => +item?.id === +termId
        );
        // modalData = { ...modalData };


        if (modalData) {
            setAcademicTermsModalState((prevState) => ({
                ...prevState,
                showModal: true,
                modalData,
            }));
        }
    }
    function delModalCancelHndlr() {
        setDelTermsModalState(prevState => ({ ...prevState, showModal: false, academicYearId: "" }));
    }

    function delModalSubmitHndlr() {
        const { termId } = delTermsModalState;
        dispatch(delClassWiseTermDateAct(generateActionPayload("del_class_wise_terms_date", { termId })));
    }

    const intialValues = {
        academicYearId: "",
        curriculumId: "",
        classId: ""
    }
    const ClassTermsFilterForm = useFormik({
        enableReinitialize: true,
        initialValues: intialValues,
        onSubmit: (values) => { },
    });

    function toggleTermsModalHndlr() {
        setAcademicTermsModalState(prevState => ({ ...prevState, showModal: !prevState.showModal, modalData: undefined }))
    }
    const menuOptions = useMemo(() => ([{
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: editAcademicTermHndlr,
    }, {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        onClickHndlr: deleteAcademicTermHndlr
    }]), [classWiseTermsDateResp]);
    const academicTermsColumns = useMemo(() => generateColumns(menuOptions), [classWiseTermsDateResp]);
    const getClassWiseTermsDateApiCall = (otherProps?: any) => {
        // const payload = { academicYearId:ClassTermsFilterForm.values.academicYear,curriculumId:ClassTermsFilterForm.values.curriculumType,classId:ClassTermsFilterForm.values.classType,branchId:20 };

        let payload = { branchId, ...ClassTermsFilterForm.values, ...filterRef, ...otherProps }
        dispatch(
            getClassWiseTermDateAct(
                generateActionPayload("get_class_wise_terms_date", undefined, payload)
            )
        );
    }

    useEffect(() => {
        return () => {
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetBrchCurriculumAct(undefined));
        }
    }, [])

    // useEffect(() => {
    //     if (instituteId && !classWiseTermsDateResp) {
    //         getClassWiseTermsDateApiCall();
    //     }
    // }, [instituteId, classWiseTermsDateResp]);
    useEffect(() => {
        if (instituteId && !academicYearListResp) {
            const payload = { instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
            dispatch(
                getInstAcademicYearAct(
                    generateActionPayload("get_inst_academic_year", undefined, payload)
                )
            );
        }

        if (academicYearListResp && !ClassTermsFilterForm.values.academicYearId) {
            const currentYear = academicYearListResp.data.find(
                (year: any) => year.yearStatus.toLowerCase() === "current"
            );
            if (currentYear) {
                const yearId = currentYear.academicYearId;
                ClassTermsFilterForm.setFieldValue("academicYearId", yearId);
                getClassWiseTermsDateApiCall({ academicYearId: yearId });

                if (!brchCurriculumResp) {
                    const payload = {
                        branchId,
                        academicYearId: yearId,
                        pageNo: 0,
                        pageSize: 100,
                        sortBy: "curriculumName",
                        orderBy: "asc",
                    };
                    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
                }
            }
        }
    }, [instituteId, academicYearListResp, brchCurriculumResp]);


    useEffect(() => {
        if (!academicTermsModalState.showModal && ClassTermsFilterForm.values.curriculumId) {
            const payload = { branchId: branchId, curriculumId: ClassTermsFilterForm.values.curriculumId, academicYearId: ClassTermsFilterForm.values.academicYearId, pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        }
    }, [academicTermsModalState.showModal])
    // useEffect(() => {

    //     if (instituteId && !branchClassResp) {
    //       const payload = { branchId:20,curriculumId:ClassTermsFilterForm.values.curriculumType, pageNo: 0, pageSize: 100 };
    //       dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class",undefined,payload)));
    //     }
    // }, [ClassTermsFilterForm.values.curriculumType]);
    const changeHandler = (event: any) => {
        ClassTermsFilterForm.handleChange(event)
        const { name, value } = event.target;

        if (name === "academicYearId") {
            
                const payload = { branchId: branchId, academicYearId: value, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
                ClassTermsFilterForm.setFieldValue("academicYearId", value);
                ClassTermsFilterForm.setFieldValue("curriculumId", "");
                ClassTermsFilterForm.setFieldValue("classId", "");
                setClassList([])
            
        }
        else if (name === "curriculumId") {
            if (value !== "") {
                const payload1 = { branchId: branchId, academicYearId: ClassTermsFilterForm.values.academicYearId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload1)));
            }
            else {
                setClassList([])
            }
        }
        // const payload = { ...ClassTermsFilterForm.values, [name]: value }
        getClassWiseTermsDateApiCall({ [name]: value });
    }
    // const curriculumHandler = (event: any) => {
    //     const payload = { branchId: branchId, curriculumId: event.target.value, pageNo: 0, pageSize: 100 };
    //     dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    //     // getClassWiseTermsDateApiCall({academicYearId:ClassTermsFilterForm.values.academicYearId,curriculumId:event.target.value});
    // }
    // const classHandler=(event:any)=>{
    //     getClassWiseTermsDateApiCall({academicYearId:ClassTermsFilterForm.values.academicYearId,curriculumId:ClassTermsFilterForm.values.curriculumId,classId:event.target.value});
    // }

    const sortByPrevRef = useRef<Array<sortRef>>([{
        id: "termName",
        desc: false
    }])

    const sortingHandler = useCallback((sortBy: any) => {
        const sortByPrev = sortByPrevRef.current;
        setFilterRef((prev: any) => ({ ...prev, sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" }))
        if (sortBy && sortByPrev !== sortBy) {
            getClassWiseTermsDateApiCall({ sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" })
        }
        sortByPrevRef.current = sortBy;
    }, [ClassTermsFilterForm.values])

    function paginationHndlr(paginationInfo: IPaginationState) {
        setFilterRef((prev: any) => ({ ...prev, paginationInfo }))
        getClassWiseTermsDateApiCall(paginationInfo);
    }
    const { data: academiYear } = academicYearListResp || {}
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {}
    const { content: classTermsDate, totalPages, totalElements, pageable } = classWiseTermsDateResp || {}
    useEffect(() => {
        setClassList(classTypes)
    }, [branchClassResp])
    return (
        <React.Fragment>
            <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
                <div className="tw-flex tw-items-center tw-justify-between">

                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                        Class Wise Term Date
                    </h4>

                    <Button
                        onClick={toggleTermsModalHndlr}
                        variant="primary"
                    >
                        Add Term
                    </Button>

                </div>
            </div>

            <div className="tw-p-0">

                <div className="tw-px-6 tw-py-4">
                    <form onClick={(e) => e.preventDefault()}>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                            <div className="tw-col-span-12 xl:tw-col-span-3">
                                <SelectInput
                                    name="academicYearId"
                                    formgroupClassName="tw-mb-0"
                                    menuItems={academiYear}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    onChange={changeHandler}
                                    value={ClassTermsFilterForm.values.academicYearId}
                                    labelText="Academic Year"
                                    floatingLabel
                                />
                            </div>

                            <div className="tw-col-span-12 xl:tw-col-span-3">
                                <SelectInput
                                    name="curriculumId"
                                    formgroupClassName="tw-mb-0"
                                    menuItems={curriculumTypes}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    onChange={changeHandler}
                                    value={ClassTermsFilterForm.values.curriculumId}
                                    labelText="Curriculum Type"
                                    floatingLabel
                                />
                            </div>

                            <div className="tw-col-span-12 xl:tw-col-span-3">
                                <SelectInput
                                    name="classId"
                                    formgroupClassName="tw-mb-0"
                                    menuItems={classList}
                                    valueKey="id"
                                    textKey="shortName"
                                    onChange={changeHandler}
                                    value={ClassTermsFilterForm.values.classId}
                                    labelText="Class"
                                    floatingLabel
                                />
                            </div>

                        </div>
                    </form>
                </div>

                <div className="tw-px-0 tw-pb-5">
                    <TableContainer
                        columns={academicTermsColumns || []}
                        data={classTermsDate || []}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-text-sm tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages}
                        totalRecords={totalElements}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageable && pageable.pageNumber}
                        sortingHandler={sortingHandler}
                    />
                </div>

            </div>
            <ModalContainerUpdated
                id="add-class-term-modal"
                isOpen={academicTermsModalState.showModal}
                toggle={toggleTermsModalHndlr}
                modalTitle={"Add Class Term"}
                modalSize="lg"
            >

            <AddEditClassTerm
                isOpen={academicTermsModalState.showModal}
                toggle={toggleTermsModalHndlr}
                instituteId={instituteId}
                instituteName={""}
                branchId={branchId}
                editBranchDetails={""}
                academicYearId={ClassTermsFilterForm.values.academicYearId}
                modalData={academicTermsModalState.modalData}
            />
                </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-inst-academic-terms"
                isOpen={delTermsModalState.showModal}
                confirmMessage="Are you sure you want to delete this term ?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
            {/* <ToastContainer /> */}
        </React.Fragment >
    )
}

export default ClassTerm;