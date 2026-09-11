import React, { useEffect, useRef, useState } from 'react';
import { ModalContainerUpdated, SelectInput } from '../../../Components/Common';
import { useFormik } from 'formik';
import { generateRowData } from './helper';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getBranchClassCurriculumAct, resetBrchClassCurriculumAct } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { InitialValueType } from './StudentAdmissionType';
import { getExportAdmissionDashboardAct, getMasterSectionAct, getSectionAnalysisAct, resetMasterSectionAct, resetSectionAnalysisAct } from '../../../store/academic/academicRequest/academicrequestactions';
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from '../../../hooks/modalhook';
import ExportModal from '../../Directory/StudentManagement/ExportModal';
import { toast } from 'react-toastify';
import { downloadExcelFile } from '../../../utility/commonutility';
import Button from '../../../Components/Common/Button';


const initialValues: InitialValueType  = {
    academicYearId: "",
    curriculumId: "",
};

const StudentSectionCount = () => {
    const { closeModal: closeExportSectionModalHnldr,
        openModal: openExportSectionModalHnldr, modalState: exportSectionModalState } = useModal();

    const [filterState, setFilterState] = useState(initialValues);
    const dispatch = useAppDispatch()
    const SectionAnalysisApiCall = ( otherProps?: any) => {
        const { academicYearId, curriculumId } =  filterStateForm.values;
        let payload = {
            academicYearId,
            curriculumId,
            branchId,
            instituteId,
            ...otherProps,
        };
        if(payload.academicYearId && payload.curriculumId){
            dispatch(getSectionAnalysisAct(generateActionPayload('get_section_analysis', undefined, payload)))
        }
    }

    
        const {
            academicYearListResp,
            currentBranchIdResp: branchId,
            currentInstIdResp: instituteId,
            getSectionAnalysisResp,
            brchClassCurriculumResp,
            getMasterSectionResp,
            academicRequestErrorResp,
            exportAdmissionDashboardResp,
        } = useAppSelector(
            ({ instAcademics, appData,applicationSale, academicRequest}) => ({
                academicYearListResp: instAcademics.academicYearListResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                getSectionAnalysisResp: academicRequest.getSectionAnalysisResp,
                brchClassCurriculumResp: applicationSale.brchClassCurriculumResp,
                getMasterSectionResp: academicRequest.getMasterSectionResp,
                academicRequestErrorResp:academicRequest.academicRequestErrorResp,
                exportAdmissionDashboardResp:academicRequest.exportAdmissionDashboardResp
            }),
            shallowEqual
        );

    const studentCountRef = useRef({
          prevAcademicRequestErrorResp: academicRequestErrorResp,
          prevExportAdmissionDashboardResp: exportAdmissionDashboardResp,
    
    });

    useEffect(() => {
        const { prevAcademicRequestErrorResp, prevExportAdmissionDashboardResp } =
        studentCountRef.current;
        if (academicRequestErrorResp && academicRequestErrorResp !== prevAcademicRequestErrorResp) {
          const { details } = academicRequestErrorResp || {}
          toast.error(details || "Something went wrong");
        }
        else if (exportAdmissionDashboardResp && exportAdmissionDashboardResp !== prevExportAdmissionDashboardResp) {
          const {name} = exportAdmissionDashboardResp || {}

          if(name === "student_section_count"){
          toast.success("Exported successfully");
          closeExportSectionModalHnldr()
          SectionAnalysisApiCall();
          downloadExcelFile(exportAdmissionDashboardResp?.data,"student_section_count");
          }
        }
        studentCountRef.current.prevAcademicRequestErrorResp = academicRequestErrorResp;
        studentCountRef.current.prevExportAdmissionDashboardResp = exportAdmissionDashboardResp;
       
      }, [academicRequestErrorResp, exportAdmissionDashboardResp]);

    const filterStateForm = useFormik({
        enableReinitialize: true,
        initialValues: filterState,
        onSubmit: (values) => { },
    });
 
    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            if(value){
            getCurriculumApiCall({ academicYearId: value });
            getMasterSectionApiCall({ academicYearId: value})
            filterStateForm.setValues((prev)=>({...prev,[name]:value,curriculumId:""}))
            SectionAnalysisApiCall({[name]:value,curriculumId :""})
            }
            else{
                filterStateForm.setValues((prev)=>({...prev,[name]:value,curriculumId:""}))
                dispatch(resetMasterSectionAct(undefined))
                dispatch(resetSectionAnalysisAct(undefined))
                dispatch(resetBrchClassCurriculumAct(undefined))
            }   
        }
        else if (name === 'curriculumId') {
            if(value){
                filterStateForm.setValues((prev)=>({...prev,[name]:value}))
                SectionAnalysisApiCall({[name]:value})
                getMasterSectionApiCall({[name]:value})
            }
            else{
                filterStateForm.setValues((prev)=>({...prev,[name]:value}))
                dispatch(resetMasterSectionAct(undefined))
                dispatch(resetSectionAnalysisAct(undefined))
            }

        }
    }

    useEffect(() => {
        const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
        filterStateForm.setValues((prev) => ({ ...prev, academicYearId }))
        getCurriculumApiCall({ academicYearId });
    }, [academicYearListResp,branchId,instituteId]);
    
    useEffect(() => {
        if (brchClassCurriculumResp?.data?.length > 0 && filterStateForm.values.academicYearId) {
            const curriculumId = brchClassCurriculumResp.data[0].branchCurriculumId;
            filterStateForm.setValues((prev) => ({ ...prev, curriculumId }));
            SectionAnalysisApiCall({academicYearId: filterStateForm.values.academicYearId, curriculumId });
            getMasterSectionApiCall({ academicYearId: filterStateForm.values.academicYearId, curriculumId })
        }
      }, [brchClassCurriculumResp,branchId,instituteId])



    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterStateForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchClassCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    
    const getMasterSectionApiCall = (otherProps?: any) => {
        const { academicYearId, curriculumId } =  filterStateForm.values;
        let payload = {
            academicYearId,
            branchId,
            curriculumId,
            ...otherProps,
        };
        if(payload.academicYearId && payload.curriculumId){            
            dispatch(getMasterSectionAct(generateActionPayload('get_master_section', undefined, payload)))   
        }
    }
    function submitExportHndlr() {

            const payload = {
              branchId,
              instituteId,
              academicYearId: filterStateForm.values.academicYearId,
              curriculumId: filterStateForm.values.curriculumId,
              exportType: "section",
              name: "student_section_count",
            };
            dispatch(getExportAdmissionDashboardAct(generateActionPayload('export_school_strength', undefined, payload, {
                responseType: 'blob'
            })))
        }
    

    const rowData = generateRowData(getMasterSectionResp, getSectionAnalysisResp);

    const totalBoys = rowData.reduce((sum, row) => sum + row.boys, 0);
    const totalGirls = rowData.reduce((sum, row) => sum + row.girls, 0);
    const totalSum = rowData.reduce((sum, row) => sum + row.boys + row.girls, 0);    

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchClassCurriculumResp || {}

    return (
        <>
            <div
                className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-overflow-hidden section-count-card"
                style={{ minHeight: "550px" }}
            >

                <div className="tw-py-2 tw-px-4 tw-border-b">
                    <div className="tw-flex tw-items-center tw-justify-between">

                        <h4 className="tw-text-[16px] tw-font-[500] tw-text-gray-800 text-align-center tw-mb-0">
                            Section Analysis
                        </h4>

                        <Button
                            id="export-btn"
                            onClick={openExportSectionModalHnldr}
                            variant='exportBtn'
                        >
                            <img src={ExportIcon} className="tw-h-5 tw-w-5" alt="export" />
                        </Button>

                        <UncontrolledTooltip placement="bottom" target="export-btn">
                            Export
                        </UncontrolledTooltip>

                    </div>
                </div>

                <div className="tw-px-0 tw-pb-2">

                    <div className="tw-grid tw-grid-cols-2 tw-gap-2 tw-border-b tw-pb-2 tw-p-4 tw-w-full tw-mx-auto">
                        <SelectInput
                            name="academicYearId"
                            value={filterStateForm.values.academicYearId}
                            onChange={filterHandler}
                            menuItems={academicYearList || []}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="tw-mb-0"
                            labelText="Academic Year"
                            floatingLabel
                        />

                        <SelectInput
                            name="curriculumId"
                            value={filterStateForm.values.curriculumId}
                            onChange={filterHandler}
                            menuItems={curriculumTypes || []}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            formgroupClassName="tw-mb-0"
                            labelText="Curriculum"
                            floatingLabel
                        />
                    </div>

                    <div className="tw-py-1 tw-px-0 tw-m-2">

                        <div className="tw-grid tw-grid-cols-4 tw-border-b tw-py-1">
                            <p className="tw-font-bold tw-text-gray-500 tw-truncate tw-my-1">
                                Section Name
                            </p>
                            <p className="tw-font-bold tw-text-gray-500 tw-text-center tw-truncate tw-my-1">
                                Boys
                            </p>
                            <p className="tw-font-bold tw-text-gray-500 tw-text-center tw-truncate tw-my-1">
                                Girls
                            </p>
                            <p className="tw-font-bold tw-text-gray-500 tw-text-center tw-truncate tw-my-1">
                                Total
                            </p>
                        </div>

                        <div
                            className="tw-w-full tw-overflow-y-auto tw-overflow-x-hidden"
                            style={{ height: "325px" }}
                        >
                            {rowData.map((row, index) => (
                                <div
                                    key={index}
                                    className="tw-grid tw-grid-cols-4 tw-items-center 
                       tw-border-b tw-my-1 tw-py-1"
                                    style={{ borderLeft: `4px solid ${row.borderColor}` }}
                                >
                                    <p className="tw-font-medium tw-truncate tw-mb-1 tw-pl-2">
                                        {row.label as React.ReactNode}
                                    </p>

                                    <p className="tw-text-center tw-font-medium tw-text-sky-600 tw-truncate tw-mb-1">
                                        {row.boys}
                                    </p>

                                    <p className="tw-text-center tw-font-medium tw-text-sky-600 tw-truncate tw-mb-1">
                                        {row.girls}
                                    </p>

                                    <p className="tw-text-center tw-font-medium tw-text-sky-600 tw-truncate tw-mb-1">
                                        {row.total}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="tw-grid tw-grid-cols-4 tw-items-center tw-my-1 tw-py-1">
                            <p className="tw-font-medium tw-truncate tw-mb-1">
                                Total
                            </p>

                            <p className="tw-text-center tw-font-medium tw-truncate tw-mb-1">
                                {totalBoys}
                            </p>

                            <p className="tw-text-center tw-font-medium tw-truncate tw-mb-1">
                                {totalGirls}
                            </p>

                            <p className="tw-text-center tw-font-medium tw-truncate tw-mb-1">
                                {totalSum}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <ModalContainerUpdated
                id="export-section-modal"
                isOpen={exportSectionModalState.showModal}
                toggle={closeExportSectionModalHnldr}
                modalTitle="Export Section Details"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportSectionModalState.showModal}
                    toggle={closeExportSectionModalHnldr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={submitExportHndlr}
                    feature="branch_dashboard"
                    subFeature="section_analysis"
                    remarksText="Enter remarks to export student section details?"
                />
            </ModalContainerUpdated>
        </>
    );
}

export default StudentSectionCount;
