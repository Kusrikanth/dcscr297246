import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ModalContainerUpdated } from '../../../Components/Common';
import UpdatedHorizontalTab from '../../../Components/Common/UpdatedHorizontalTab';
import { useFormik } from 'formik';
import { getActiveId } from './helper';
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getExportAdmissionDashboardAct, getSchoolStrengthAct } from '../../../store/academic/academicRequest/academicrequestactions';
import { getClassListAct } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { useModal } from '../../../hooks/modalhook';
import ExportModal from '../../Directory/StudentManagement/ExportModal';
import { toast } from 'react-toastify';
import { downloadExcelFile } from '../../../utility/commonutility';
import AcademicYearWiseAllTotal from './AcademicYearWiseAllTotal';
import AcademicYearCurrrentPreTotal from './AcademicYearCurrrentPreTotal';
import AcademicYearWiseClassTotal from './AcademicYearWiseClassTotal';
import Button from '../../../Components/Common/Button';

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const initialValues = {
  academicYearId: "",
  curriculumId: "",
};

const AcademicYearWiseTotal = () => {
  const { closeModal: closeExportSectionModalHnldr,
          openModal: openExportSectionModalHnldr, modalState: exportSectionModalState } = useModal();
  const dispatch = useAppDispatch() 
  const [activeId, setActiveId] = useState<any>("academicYearWiseAllTotal");
  const [filterState, setFilterState] = useState(initialValues);
  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "academicYearWiseAllTotal",
      labelName: "All",
      customPadding: "5px 5px 5px 5px",
    },
    {
      id: "academicYearCurrrentPreTotal",
      labelName: "Current vs Previous",
      customPadding: "5px 5px 5px 5px",
    },
    {
      id: "academicYearWiseClassTotal",
      labelName: "Class",
      customPadding: "5px 5px 5px 5px",
    },
  ];
  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "academicYearWiseAllTotal":
        return AcademicYearWiseAllTotal;
      case "academicYearCurrrentPreTotal":
        return AcademicYearCurrrentPreTotal;
      case "academicYearWiseClassTotal":
        return AcademicYearWiseClassTotal;
    }
  }

  const AcademicYearWiseApiCall = ( otherProps?: any) => {
       
    const { academicYearId, curriculumId } =  upcomingEvents.values;
    let payload = {
        academicYearId,
        curriculumId,
        branchId,
        instituteId,
        ...otherProps,
    };
    if(instituteId){
      dispatch(getSchoolStrengthAct(generateActionPayload('get_school_strength', undefined, payload)))
    }
  }


  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicRequestErrorResp,
    exportAdmissionDashboardResp
} = useAppSelector(
    ({  appData, academicRequest }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
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
          const { name } = exportAdmissionDashboardResp || {}
          if(name === "school_strength"){
            toast.success("Exported successfully");
            closeExportSectionModalHnldr()
            AcademicYearWiseApiCall();
            downloadExcelFile(exportAdmissionDashboardResp?.data,getActiveId(activeId));
          }
        }
        studentCountRef.current.prevAcademicRequestErrorResp = academicRequestErrorResp;
        studentCountRef.current.prevExportAdmissionDashboardResp = exportAdmissionDashboardResp;
       
      }, [academicRequestErrorResp, exportAdmissionDashboardResp]);

const upcomingEvents = useFormik({
  enableReinitialize: true,
  initialValues: filterState,
  onSubmit: (values) => { },
})

useEffect(() => {
  AcademicYearWiseApiCall();
  let payload = {
    branchId,
    instituteId,
  };
  if(instituteId && branchId){
    dispatch(getClassListAct(generateActionPayload('class_list', undefined, payload)))
  }
}, [branchId,instituteId]);

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return (
      <TabComponent activeId={activeId}/>
    );
  }, [activeId,branchId,instituteId]);


  function submitExportHndlr() {
  
    const payload = {
      branchId,
      instituteId,
      exportType: "",
      name: "school_strength",
    };
    if(activeId === "academicYearWiseAllTotal"){
      payload.exportType = "all";
    }
    else if(activeId === "academicYearCurrrentPreTotal"){
      payload.exportType = "currentVsPs";
    }
    else if(activeId === "academicYearWiseClassTotal"){
      payload.exportType = "class";
    }
    if (payload.exportType !== "") {
            dispatch(getExportAdmissionDashboardAct(generateActionPayload('export_school_strength', undefined, payload, {
          responseType: 'blob'
      })))
    }
  }

  

  return (
    <>
      <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">
        <div className="tw-py-2 tw-px-4 tw-border-b">
          <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between">

            <div className="tw-w-8/12">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                School Strength
              </h4>
            </div>

            <div className="tw-flex tw-items-center tw-mt-2 md:tw-mt-0 tw-ml-4 md:tw-ml-auto">
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
        </div>
        <div className="tw-p-4 horizontal_tab">
          <div className="tw-flex tw-flex-wrap tw-justify-end">
            <div className=" tw-pt-3 md:tw-pt-0 tw-px-4 md:tw-px-0">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="tw-pl-0"
              />
            </div>
          </div>

          <div className="tw-mt-4">
            {activeComponent}
          </div>
        </div>
      </div>
      <ModalContainerUpdated
                id="export-section-modal"
                isOpen={exportSectionModalState.showModal}
                toggle={closeExportSectionModalHnldr}
                modalTitle="Export School Strength Details"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportSectionModalState.showModal}
                    toggle={closeExportSectionModalHnldr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={submitExportHndlr}
                    feature="branch_dashboard"
                    subFeature= {getActiveId(activeId)}
                    remarksText="Enter remarks to export school strength details?"
                />
            </ModalContainerUpdated>
    </>
  )
}

export default AcademicYearWiseTotal