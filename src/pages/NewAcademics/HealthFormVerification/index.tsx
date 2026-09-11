
import React, { useEffect, useMemo, useRef, useState } from "react";
import {  ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import {  MenuOptions, generateColumns, hasStateChanged } from "./helper";
import ModifiedHorizontalTab from "../../../Components/Common/ModifiedHorizontalTab";
import AddHealthFormModal from "./AddHealthFormModal";
import { getHealthFormListAct, updateHealthFormStatusAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, Download04Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";


const initialValues: any = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    startDate:"",
    endDate:"",
    sectionId:"",
};

const HealthFormVerification = () => {
    const history = useHistory();

    const dispatch = useDispatch();
    const [menuId, setMenuId] = useState<string | null>("healthFormVerificationRequests");
    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })
    const [addHealthFormModal, setAddHealthFormModal] = useState<any>({
        showModal: false,
        applicationId: undefined
    })
    const [updateStatusModal, setUpdateStatusModal] = useState<any>({
        showModal: false,
        id: "",
        modalData : "",
    })
    const [open, setOpen] = useState<boolean>(false);
    const [healthFormState, setHealthFormState] = useState<any>(initialValues);
    const [healthFormList, setHealthFormList] = useState<any>([]);
    const [count,setCount] = useState<any>(null);
    const [showClearFilterState, setShowClearFilterState] = useState(false);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        saveHealthFormResp,
        classroomManagmentErrorResp,
        getHealthFormListResp,
        updateHealthFormStatusResp,
    }: any = useAppSelector(
        ({applicationSale, globalData, instAcademics, branchAcademics, appData,classroomManagmentInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader:globalData.showApiLoader,
            saveHealthFormResp:classroomManagmentInfo.saveHealthFormResp,
            classroomManagmentErrorResp:classroomManagmentInfo.classroomManagmentErrorResp,
            getHealthFormListResp:classroomManagmentInfo.getHealthFormListResp,
            updateHealthFormStatusResp:classroomManagmentInfo.updateHealthFormStatusResp,
        }),
        shallowEqual
    );

    const HealthFormVerifyRef = useRef<any>({
        prevSaveHealthFormResp: saveHealthFormResp,
        prevUpdateHealthFormStatusResp: updateHealthFormStatusResp,
        prevClassroomManagmentErrorResp: classroomManagmentErrorResp || {},
        prevGetHealthFormListResp: getHealthFormListResp || {},
    });

    useEffect(() => {
        const { prevSaveHealthFormResp,prevClassroomManagmentErrorResp,prevGetHealthFormListResp,prevUpdateHealthFormStatusResp } = HealthFormVerifyRef.current;

        if (saveHealthFormResp && saveHealthFormResp !== prevSaveHealthFormResp) {
            toast.success("Health Form request added successfully. ");
            toggleAddHealthFormModal();
            HealthFormVerifyList();
        }
        else if (updateHealthFormStatusResp && updateHealthFormStatusResp !== prevUpdateHealthFormStatusResp) {
            toast.success("Studnet Status Update Successfully. ");
            toggleUpdateStatusModal();
            HealthFormVerifyList();
        }
        else if (getHealthFormListResp && getHealthFormListResp !== prevGetHealthFormListResp) {
            if(menuId === "healthFormVerificationRequests"){
                if(getHealthFormListResp?.content?.length > 0){
                    setHealthFormList(getHealthFormListResp.content.map((i:any)=>({
                        ...i,
                        status : "",
                        remarks:"",
                    })))
                }else{setHealthFormList([])}
            }else{
                setHealthFormList(getHealthFormListResp?.content)
            }
        }
        else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
            const {details} = prevClassroomManagmentErrorResp || {};
            toast.error(details);
        }

        HealthFormVerifyRef.current.prevSaveHealthFormResp = saveHealthFormResp;
        HealthFormVerifyRef.current.prevUpdateHealthFormStatusResp = updateHealthFormStatusResp;
        HealthFormVerifyRef.current.prevGetHealthFormListResp = getHealthFormListResp;
        HealthFormVerifyRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;

    }, [saveHealthFormResp,classroomManagmentErrorResp,getHealthFormListResp,updateHealthFormStatusResp]);

    const menuOptions = useMemo(
        () => [
            {
                id: "download",
                actionIcon: <HugeiconsIcon icon={Download04Icon} className="text-primary" size={20} />,
                actionName: "Download",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    const data = healthFormList?.find((i: any) => +i.id === +id);
                    const url = data?.systemFile?.s3URL
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'Application_form.pdf');
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                },
            },
            {
                id: "save",
                actionIcon: <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-success" size={20} />,
                actionName: "Save",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    const modalData = healthFormList?.find((i: any) => +i.id === +id);
                    if(modalData?.status){
                        toggleUpdateStatusModal(id,modalData)
                    }else{
                        toast.warning("Please Select Status")
                    }
                },
            },
        ],
        [healthFormList]
    );

    const toggleUpdateStatusModal = (id?: any,modalData?:any) => {
        setUpdateStatusModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            id: id || "",
            modalData : modalData || "",
        }));
    };

    const updateStatusModalHndler = () => {
        const {id , status , remarks} = updateStatusModal.modalData || {}
        const payload = {
            id ,
            confirmationStatus : status,
            remarks,
        }
        if(payload.confirmationStatus){
            dispatch(updateHealthFormStatusAct(generateActionPayload("update_helath_form_status", undefined, { ...payload }, )));
        }else{
            toast.warning("Please select status")
        }
    }

    const toggleAddHealthFormModal = (id?: any) => {
        setAddHealthFormModal((prev:any)=>({...prev,showModal:!prev.showModal}))
    };

    const roleColumnsForRequests = useMemo(() => {
        const newColumns = generateColumns(menuOptions)
        return newColumns.filter((item:any)=>{
            if(item.accessor === "remarks" || item.Header === "Status"){
                if(menuId === "healthFormVerificationApprovedList"){
                    return item;
                }
            }else if(item.Header === "Approvals" || item.accessor === "newRemarks" || item.Header === "Actions"){
                    if(menuId === "healthFormVerificationRequests"){
                        return item;
                    }
                }
            else{
                return item
            }
        })
    }, [menuId,healthFormList]);

    const HealthFormVerifyList = (otherProps?:any)=>{
        const { academicYearId, curriculumId, classId,searchString,startDate,endDate } = healthFormState;
        let payload = {
            academicYearId,curriculumId,instituteId,branchId,classId,searchString,startDate,endDate,...otherProps,...pagination.current
        };
        if(menuId === "healthFormVerificationRequests"){
            payload.statusList = "PENDING"
        }else{
            payload.statusList = "APPROVED,ACCEPTED,REJECTED"
        }
        if(payload.academicYearId  ){
            dispatch(getHealthFormListAct(generateActionPayload('get_health_form_list', undefined, payload)))
        }
    }

    useEffect(() => {
      if(menuId){
        pagination.current.pageNo = 0
        HealthFormVerifyList()
      }
    }, [menuId])
    
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: healthFormState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    const getClassApiCall = (otherProps?:any)=>{
        const payload = { branchId: branchId, academicYearId : healthFormState?.academicYearId, curriculumId: healthFormState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
         dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }


    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
        setHealthFormState((prev: any) => ({ ...prev, academicYearId: yearId }))
        HealthFormVerifyList({academicYearId: yearId})
        getCurriculumApiCall({ academicYearId: yearId });
    }, [academicYearListResp]);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        pagination.current.pageNo=0;
        if (name === 'academicYearId') {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            HealthFormVerifyList({ [name]: value, classId: "", curriculumId: "" });
            setHealthFormState((prev: any) => ({ ...prev, [name]: value, classId: "", curriculumId: "" }));
        }
        else if (name === 'curriculumId') {
            HealthFormVerifyList({ [name]: value, classId: "" });
            setHealthFormState((prev: any) => ({ ...prev, [name]: value, classId: "" }));
            if(!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else { 
                getClassApiCall({ curriculumId: value, academicYearId: healthFormState.academicYearId });
            }
        }
        else {
            HealthFormVerifyList({ [name]: value })
            setHealthFormState((prev: any) => ({ ...prev, [name]: value }));
        }
        const stateChanged = hasStateChanged( {...healthFormState,[name]: value});
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    }

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    const onChangeInputHndlr = (event:any,id:any,name:any)=>{
            const newList = healthFormList?.map((i:any)=>{
                if(+i?.id === +id){
                    return {...i,[name]:event.target.value }
                }else{
                    return i
                }
            })
            setHealthFormList(newList)
        
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        HealthFormVerifyList(paginationInfo)
    }

    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        pagination.current={...pagination.current,pageNo:0}
        const stateChanged = hasStateChanged( {...initialValues,...appliedFilters,academicYearId : ""});
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setHealthFormState((prevState: any) => ({ ...prevState, ...appliedFilters }));
        HealthFormVerifyList(appliedFilters)

    }

    const clearFilterHndlr = ()=>{
        if(academicYearListResp){
            pagination.current={...pagination.current,pageNo:0}
            let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
            setHealthFormState({...initialValues,academicYearId})
            setCount(null)
            HealthFormVerifyList({...initialValues,academicYearId})
            setShowClearFilterState(false)
            dispatch(resetBrchClassAct(undefined));
            getCurriculumApiCall({ academicYearId: academicYearId })
        }
      }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { totalElements,totalPages,pageble } = getHealthFormListResp || {}
    const { content: classTypes } = branchClassResp || {};

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Academics" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow">
                        {/* Card Header */}
                        <div className="tw-border-b tw-p-4">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-flex-1">
                                    <h4 className="tw-text-[16px] tw-font-[600] tw-text-gray-800 text-align-center tw-mb-0">
                                        Health Form Verification List
                                    </h4>
                                </div>

                                <div className="tw-flex tw-justify-end">
                                    <Button
                                        onClick={() => toggleAddHealthFormModal()}
                                        variant="primary"
                                    >
                                        Upload Health Form
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="tw-p-4 tw-pb-0">
                            <div className="tw-grid tw-grid-cols-1 tw-gap-3 md:tw-grid-cols-12">

                                {/* Search */}
                                <div className="md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-2">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={healthFormState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-slate-100"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>

                                {/* Academic Year */}
                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={healthFormState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                {/* Curriculum */}
                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={healthFormState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>

                                {/* Class */}
                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={healthFormState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        labelText="Class"
                                        floatingLabel
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                {/* Filters Button */}
                                <div className="tw-relative">
                                    <div
                                        onClick={toggleAdvanceFilter}
                                        className="tw-flex tw-items-center tw-gap-2 tw-bg-gray-100 tw-p-2 tw-cursor-pointer tw-rounded"
                                    >
                                        <FilterSvg height="18px" width="18px" />
                                        <span>Filters</span>
                                    </div>

                                    <span
                                        className="tw-absolute tw--top-2 tw-left-16 tw-rounded-full tw-bg-emerald-500 tw-text-white tw-text-xs tw-px-2"
                                    >
                                        {count}
                                    </span>
                                </div>

                                {/* Clear Filter */}
                                <div className="tw-col-span-2 tw-flex tw-justify-end">
                                    {showClearFilterState && (
                                        <Button
                                            type="button"
                                            onClick={clearFilterHndlr}
                                            variant="wrong"
                                        >
                                            Clear filter
                                        </Button>
                                    )}
                                </div>

                                {/* Tabs */}
                                <div className="tw-col-span-12">
                                    <ModifiedHorizontalTab
                                        MenuOptions={MenuOptions}
                                        getActiveMenuId={(menuId: any) => {
                                            setMenuId(menuId);
                                        }}
                                        activeTabId={menuId}
                                        horizontalClass="tw-overflow-x-auto"
                                        labelClass="tw-whitespace-nowrap"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <TableContainer
                            columns={roleColumnsForRequests || []}
                            data={healthFormList || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            onChangeInputHndlr={onChangeInputHndlr}
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                        />
                    </div>
                </div>
            </div>


            <ModalContainerUpdated
                id="add-health-form-modal"
                isOpen={addHealthFormModal.showModal}
                toggle={toggleAddHealthFormModal}
                modalTitle="Student Health Form"
                modalSize="md"
            >
                <AddHealthFormModal toggle={toggleAddHealthFormModal}  isOpen={addHealthFormModal.showModal}/>
            </ModalContainerUpdated>
            <ConfirmationModal
            id="update-status-health-form-modal"
            isOpen={updateStatusModal.showModal}
            confirmMessage="Are you sure you want Update status ?"
            cancelHndlr={toggleUpdateStatusModal}
            confirmHndlr={updateStatusModalHndler}
            isDisble={showApiLoader}
            showImgIcon={true}
            iconType='approve'
            btnClassName='btn w-sm btn-success'
        />
          <OffCanvasContainer
                  isOpen={open}
                  headerTitle="Advance Filters"
                  closeHndlr={toggleAdvanceFilter}
                  id="health-form-verification-advance-filter"
                >
                  <AdvanceFilterModal
                    appliedFilter={healthFormState}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                  />

                </OffCanvasContainer>
        </>
    );
};

export default HealthFormVerification;
