import React, { useEffect, useMemo, useState } from 'react'
import UpdatedHorizontalTab from '../../../Components/Common/UpdatedHorizontalTab';
import { useFormik } from 'formik';
import AcademicYearWiseClassTotal from './AcademicYearWiseClassTotal';
import AcademicAdmissionAnalysis from './AdmissionAnalysis';
import AcademicYearWiseStageTotal from './AcademicYearWiseStageTotal';
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from 'reactstrap';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getAdmissionAnalysisAct, getClassListAct } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getInstAcademicYearAct } from '../../../store/mastersettings/instacademics/instacademicactions';
import Button from '../../../Components/Common/Button';

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const initialValues = {
  curriculumId: "",
};

const AdmissionAnalysis = ({ academicYearId }: any) => {
  const [activeId, setActiveId] = useState<any>("admissionAnalysis");
  const [filterState, setFilterState] = useState(initialValues);
  const dispatch = useAppDispatch()
  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "admissionAnalysis",
      labelName: "Current vs Previous",
      customPadding: "5px 5px 5px 5px",
    },
    {
      id: "academicYearWiseClassTotal",
      labelName: "Class",
      customPadding: "5px 5px 5px 5px",
    },
    {
      id: "academicYearWiseStageTotal",
      labelName: "Stage",
      customPadding: "5px 5px 5px 5px",
    },
  ];

  const AdmissionSummaryWiseApiCall = (otherProps?: any) => {

    const { curriculumId } = upcomingEvents.values;
    let payload = {
      academicYearId,
      curriculumId,
      branchId,
      instituteId,
      ...otherProps,
    };
    if (instituteId) {
      dispatch(getAdmissionAnalysisAct(generateActionPayload('get_admission_analysis', undefined, payload)))
    }
  }

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
  } = useAppSelector(
    ({ appData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
    }),
    shallowEqual
  );

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "academicYearWiseClassTotal":
        return AcademicYearWiseClassTotal;
      case "admissionAnalysis":
        return AcademicAdmissionAnalysis;
      case "academicYearWiseStageTotal":
        return AcademicYearWiseStageTotal;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return (
      <TabComponent />
    );
  }, [activeId]);

  const upcomingEvents = useFormik({
    enableReinitialize: true,
    initialValues: filterState,
    onSubmit: (values) => { },
  })

  useEffect(() => {
    if (instituteId && branchId && academicYearId) {
      let payload = {
        branchId,
        instituteId,
        academicYearId,
      };
      dispatch(getClassListAct(generateActionPayload('class_list', undefined, payload)))
      AdmissionSummaryWiseApiCall();
    }
  }, [branchId, instituteId, academicYearId])

  return (
    <>
      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm">
        <div className="tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <div className="tw-col-span-8">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0 md:tw-mb-0">
                Admission Analysis
              </h4>
            </div>
            <div className="tw-col-span-4 tw-ml-3 md:tw-ml-auto">
              <Button
                id="export-btn"
                variant='exportBtn'
              >
                <img src={ExportIcon} className="tw-max-w-full tw-h-full" />
                <UncontrolledTooltip placement="bottom" target="export-btn">
                  Export
                </UncontrolledTooltip>
              </Button>
            </div>
          </div>
        </div>

        <div className="tw-p-5 horizontal_tab_fee">
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-12 tw-pt-3 md:tw-pt-0 tw-flex tw-justify-start tw-px-4 md:tw-px-0">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="tw-ps-0 tw-pl-0"
              />
            </div>
          </div>
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-12 tw-px-4 md:tw-px-0 tw-pt-5">
              {activeComponent}
              </div></div>
        </div>
      </div>
    </>
  );
}

export default AdmissionAnalysis