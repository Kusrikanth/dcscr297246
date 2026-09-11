
import { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, } from "./helper";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import HostelClassEligibilityModel from "./HostelClassEligibilityModel";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getHostelFacilityEligibilityAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: ""
};

const HostelClassEligibility = () => {

  const dispatch = useAppDispatch()
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const [HostelClassEligibilityModelState, setHostelClassEligibilityFilterStateModelState] =
    useState({
      showModal: false,
      modalData: "",
    });
  const [hostelClassEligibilityFilterState, setHostelClassEligibilityFilterState] = useState(initialValues);

  const hostelClassEligibilityList = (otherProps?: any) => {
    const { curriculumId, searchString, academicYearId } = hostelClassEligibilityFilterState;
    let payload = {
      curriculumId: curriculumId,
      instituteId: instituteId,
      academicYearId,
      branchId,
      searchString,
      ...pagination.current,
      ...otherProps,
    };
    if (payload.curriculumId) {
      dispatch(getHostelFacilityEligibilityAct(generateActionPayload('get_hostel_eligibility', undefined, payload)))
    }
  }


  const {
    brchCurriculumResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelFacilityEligibilityResp,
    editHostelFacilityEligibilityResp,
    hostelSettingsErrResp,
    academicYearListResp,
  } = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, appData, hostelSettings }) => ({
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelFacilityEligibilityResp: hostelSettings.getHostelFacilityEligibilityResp,
      editHostelFacilityEligibilityResp: hostelSettings.editHostelFacilityEligibilityResp,
      hostelSettingsErrResp: hostelSettings.hostelSettingsErrResp,
      academicYearListResp: instAcademics.academicYearListResp,
    }),
    shallowEqual
  );

  const hostelClassEligibilityRef = useRef({
    prevEditHostelFacilityEligibilityResp: editHostelFacilityEligibilityResp,
    prevHostelSettingsErrResp: hostelSettingsErrResp,
  });

  useEffect(() => {
    const { prevHostelSettingsErrResp, prevEditHostelFacilityEligibilityResp } = hostelClassEligibilityRef.current;

    if (editHostelFacilityEligibilityResp && prevEditHostelFacilityEligibilityResp !== editHostelFacilityEligibilityResp) {
      toast.success("Hostel Class Eligibility Updated Successfully")
      toggleHostelClassEligibilityModel();
      hostelClassEligibilityList();
    }
    else if (hostelSettingsErrResp && hostelSettingsErrResp !== prevHostelSettingsErrResp) {
      const { details } = hostelSettingsErrResp || {};
      toast.error(details || "Something went wrong.")
    }

    hostelClassEligibilityRef.current.prevEditHostelFacilityEligibilityResp = editHostelFacilityEligibilityResp;
    hostelClassEligibilityRef.current.prevHostelSettingsErrResp = hostelSettingsErrResp;
  }, [editHostelFacilityEligibilityResp, hostelSettingsErrResp]);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const classId = event.currentTarget.getAttribute("data-id");
          const findData = getHostelFacilityEligibilityResp?.data?.find((item: any) => +item.classId === +classId);
          setHostelClassEligibilityFilterStateModelState((prev: any) => ({ ...prev, showModal: !prev.showModal, modalData: findData || null }));
        },
      },
    ],
    [getHostelFacilityEligibilityResp]
  );

  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setHostelClassEligibilityFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getCurriculumApiCall({ academicYearId: yearId })
  }, [academicYearListResp, branchId, instituteId]);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};

    if (Array.isArray(data) && data.length > 0) {
      hostelClassEligibilityList({ curriculumId: data[0].branchCurriculumId })
      setHostelClassEligibilityFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
    }
  }, [brchCurriculumResp])

  const toggleHostelClassEligibilityModel = () => {
    setHostelClassEligibilityFilterStateModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      modalData: null,
    }));
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: hostelClassEligibilityFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target || {};
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value })
      setHostelClassEligibilityFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "" }));
    } else {
      setHostelClassEligibilityFilterState((prev: any) => ({ ...prev, [name]: value }))
    }
    if (value) {
      hostelClassEligibilityList({ [name]: value })
    }
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    hostelClassEligibilityList(paginationInfo)
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { totalElements, totalPages, pageble } = getHostelFacilityEligibilityResp || {}

  const columns = useMemo(() => generateColumns(menuOptions), [getHostelFacilityEligibilityResp]);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Hostel Fee" pageTitle="Settings" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Hostel Facility Availability
                  </h4>
                </div>
              </div>
            </div>
            <div className="tw-p-0">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-3 tw-px-3 tw-py-3">
                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={hostelClassEligibilityFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-0"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={hostelClassEligibilityFilterState.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculam"
                    floatingLabel
                  />
                </div>
              </div>
              <TableContainer
                columns={columns || []}
                data={getHostelFacilityEligibilityResp?.data || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageble?.pageNumber || 0}

              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={HostelClassEligibilityModelState.showModal}
        toggle={toggleHostelClassEligibilityModel}
        modalTitle="Admission Availability"
        modalSize="lg"
      >
        <HostelClassEligibilityModel
          isOpen={HostelClassEligibilityModelState.showModal}
          toggle={toggleHostelClassEligibilityModel}
          modalData={HostelClassEligibilityModelState.modalData}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default HostelClassEligibility;
