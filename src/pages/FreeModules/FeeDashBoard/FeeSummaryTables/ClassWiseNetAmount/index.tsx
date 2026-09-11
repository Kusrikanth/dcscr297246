import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../../assets/imagesdps/common_icon/export_icon.svg";
import { ModalContainerUpdated, MultiSelectCheckbox, SelectInput, TableExpandable } from "../../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { exportBranchWiseNetAmountAct, exportClassSectionWiseNetAmountAct, getClassSectionWiseNetAmountAct, getFeeTermByTypeAct } from "../../../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { accumulatedData, generateColumns, modeOptions, renderOptionsStudent, renderValueStudent, stuStatusOptions } from "./helper";
import { useModal } from "../../../../../hooks/modalhook";
import ShowStudents from "../BranchWiseDueSummary/ShowStudents";
import { feeTypeOptions } from "../BranchWiseDueSummary/helper";
import ExportModal from "../../../../Directory/StudentManagement/ExportModal";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../../utility/commonutility";
import { useFormik } from "formik";
import { getSectionList } from "../../../../../store/academic/classroomManagment/classroommanagmentactions";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";

type ClassWiseNetAmountFormValues = {
  academicYearId: string;
  curriculumId: string;
  classId: string;
  sectionIds: any[];
  studentStatus: string;
};

const initialValues: ClassWiseNetAmountFormValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionIds: [],
  studentStatus: "",
};

const ClassWiseNetAmount = (props: any) => {

  const dispatch = useAppDispatch()
  const [tableDataState, setTableDataState] = useState([]);
  const { closeModal: closeShowStuModal, openModal: openShowStuModal, modalState: showStuModalState } = useModal()
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const classWiseNetAmountFormik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {

    }
  });

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    sectionListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getClassSectionWiseNetAmountResp,
    feeReportErrorResp,
    exportClassSectionWiseNetAmountResp,
  } = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, classroomManagmentInfo, appData, feeReport, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getClassSectionWiseNetAmountResp: feeReport.getClassSectionWiseNetAmountResp,
      feeReportErrorResp: feeReport.feeReportErrorResp,
      exportClassSectionWiseNetAmountResp: feeReport.exportClassSectionWiseNetAmountResp,
    }),
    shallowEqual
  );

  const branchWiseNetPaidByDateRef = useRef({
    prevFeeReportErrorResp: feeReportErrorResp,
    prevExportClassSectionWiseNetAmountResp: exportClassSectionWiseNetAmountResp,
  });

  useEffect(() => {
    const { prevFeeReportErrorResp, prevExportClassSectionWiseNetAmountResp } =
      branchWiseNetPaidByDateRef.current;
    if (feeReportErrorResp && feeReportErrorResp !== prevFeeReportErrorResp) {
      const { details } = feeReportErrorResp || {}
      toast.error(details || "Something went wrong");
    }
    else if (exportClassSectionWiseNetAmountResp && exportClassSectionWiseNetAmountResp !== prevExportClassSectionWiseNetAmountResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportClassSectionWiseNetAmountResp, "Class_Wise_Net_Paid_By_Date");
    }
    branchWiseNetPaidByDateRef.current.prevFeeReportErrorResp = feeReportErrorResp;
    branchWiseNetPaidByDateRef.current.prevExportClassSectionWiseNetAmountResp = exportClassSectionWiseNetAmountResp;
  }, [feeReportErrorResp, exportClassSectionWiseNetAmountResp]);

  useEffect(() => {
    if (Array.isArray(academicYearListResp?.data)) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      getBranchWiseNetAmtApiCall({ academicYearId })
      classWiseNetAmountFormik.setFieldValue("academicYearId", academicYearId);
      getCurriculumApiCall({academicYearId});
    }
  }, [academicYearListResp, instituteId, props.branchIdState])

  useEffect(() => {
    if (Array.isArray(getClassSectionWiseNetAmountResp) && getClassSectionWiseNetAmountResp.length > 0) {
      const modifiedData: any = getClassSectionWiseNetAmountResp.reduce(
        (acc: any[], curr: any) => {

          const feePayload: any = {};

          if (curr.feeType === feeTypeOptions.FEE_STRUCTURE) {
            feePayload.feeNet = curr.netAmount || 0;
            feePayload.feePaid = curr.paidAmount || 0;
            feePayload.feeDue = curr.dueAmount || 0;
            feePayload.feeUnpaidStudent =
              curr.unpaidStudents || 0;
          }

          else if (
            curr.feeType === feeTypeOptions.TRANSPORT_FEE
          ) {
            feePayload.transportNet =
              curr.netAmount || 0;
            feePayload.transportPaid =
              curr.paidAmount || 0;
            feePayload.transportDue =
              curr.dueAmount || 0;
            feePayload.transportUnpaidStudent =
              curr.unpaidStudents || 0;
          }

          else {
            feePayload.cumulativeNet =
              curr.netAmount || 0;
            feePayload.cumulativePaid =
              curr.paidAmount || 0;
            feePayload.cumulativeDue =
              curr.dueAmount || 0;
            feePayload.cumulativeUnpaidStudent =
              curr.unpaidStudents || 0;
          }

          let curriculum = acc.find(
            (x: any) =>
              x.curriculumId === curr.curriculumId
          );

          if (!curriculum) {

            curriculum = {
              branchId: curr.branchId,
              curriculumId: curr.curriculumId,
              curriculumName: curr.curriculumName,
              feeNet: 0,
              feePaid: 0,
              feeDue: 0,
              feeUnpaidStudent: 0,
              transportNet: 0,
              transportPaid: 0,
              transportDue: 0,
              transportUnpaidStudent: 0,
              cumulativeNet: 0,
              cumulativePaid: 0,
              cumulativeDue: 0,
              cumulativeUnpaidStudent: 0,
              subRows: [],
            };
            acc.push(curriculum);
          }

          Object.keys(feePayload).forEach((key) => {
            curriculum[key] =
              (curriculum[key] || 0) + feePayload[key];
          });

          let classObj = curriculum.subRows.find(
            (x: any) =>
              x.classId === curr.classId
          );

          if (!classObj) {

            classObj = {
              branchId: curr.branchId,
              curriculumId: curr.curriculumId,
              classId: curr.classId,
              className: curr.className || "-",
              feeNet: 0,
              feePaid: 0,
              feeDue: 0,
              feeUnpaidStudent: 0,
              transportNet: 0,
              transportPaid: 0,
              transportDue: 0,
              transportUnpaidStudent: 0,
              cumulativeNet: 0,
              cumulativePaid: 0,
              cumulativeDue: 0,
              cumulativeUnpaidStudent: 0,
              subRows: [],
            };
            curriculum.subRows.push(classObj);
          }

          Object.keys(feePayload).forEach((key) => {
            classObj[key] =
              (classObj[key] || 0) + feePayload[key];
          });

          let section = classObj.subRows.find(
            (x: any) =>
              x.sectionId === curr.sectionId
          );

          if (!section) {

            section = {
              branchId: curr.branchId,
              curriculumId: curr.curriculumId,
              classId: curr.classId,
              sectionId: curr.sectionId,
              sectionName: curr.sectionName || "-",
              feeNet: 0,
              feePaid: 0,
              feeDue: 0,
              feeUnpaidStudent: 0,
              transportNet: 0,
              transportPaid: 0,
              transportDue: 0,
              transportUnpaidStudent: 0,
              cumulativeNet: 0,
              cumulativePaid: 0,
              cumulativeDue: 0,
              cumulativeUnpaidStudent: 0,
            };
            classObj.subRows.push(section);
          }

          Object.keys(feePayload).forEach((key) => {
            section[key] =
              (section[key] || 0) + feePayload[key];
          });
          section.cumulativeNet =
            (section.feeNet || 0) +
            (section.transportNet || 0);
          section.cumulativePaid =
            (section.feePaid || 0) +
            (section.transportPaid || 0);
          section.cumulativeDue =
            (section.feeDue || 0) +
            (section.transportDue || 0);
          section.cumulativeUnpaidStudent =
            (section.feeUnpaidStudent || 0) +
            (section.transportUnpaidStudent || 0);
          return acc;
        }, []
      );
      setTableDataState(modifiedData)
    }
    else if (Array.isArray(getClassSectionWiseNetAmountResp) && getClassSectionWiseNetAmountResp.length === 0) {
      setTableDataState([])
    }
  }, [getClassSectionWiseNetAmountResp])

  const getBranchWiseNetAmtApiCall = (otherProps?: any) => {
    const values = {
      ...classWiseNetAmountFormik.values,
      ...otherProps,
    };

    const payload = {
      instituteId,
      branchId,
      academicYearId: values.academicYearId,
      studentStatus: values.studentStatus,
      curriculumIds: values.curriculumId
        ? String(values.curriculumId)
        : undefined,
      classIds: values.classId
        ? String(values.classId)
        : undefined,
      sectionIds: Array.isArray(values.sectionIds)
        ? values.sectionIds.map((section: any) =>
          typeof section === "object"
            ? String(section.sectionId)
            : String(section)
        ).join(",")
        : undefined,
    };
    dispatch(
      getClassSectionWiseNetAmountAct(
        generateActionPayload(
          "class_section_wise_net_amount",
          undefined,
          payload
        )
      )
    );
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { branchId: branchId, academicYearId: classWiseNetAmountFormik.values.academicYearId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: classWiseNetAmountFormik.values.academicYearId, curriculumId: classWiseNetAmountFormik.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getSectionListResp = (otherProps?: any) => {
    let payload = { branchClassId: classWiseNetAmountFormik.values.classId || null, masterAcademicYearId: classWiseNetAmountFormik.values.academicYearId, curriculumId: classWiseNetAmountFormik.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = event.target;
    classWiseNetAmountFormik.setFieldValue(name, value);

    if (name === "academicYearId") {
      classWiseNetAmountFormik.setValues({
        academicYearId: value, curriculumId: "", classId: "", sectionIds: [],
        studentStatus: classWiseNetAmountFormik.values.studentStatus
      });
      getCurriculumApiCall({ academicYearId: value });
      getBranchWiseNetAmtApiCall({ academicYearId: value, curriculumId: "", classId: "", sectionIds: [] });
      return;
    }

    if (name === "curriculumId") {
      classWiseNetAmountFormik.setFieldValue("classId", "");
      classWiseNetAmountFormik.setFieldValue("sectionIds", []);
      getClassApiCall({ curriculumId: value });
      getBranchWiseNetAmtApiCall({ curriculumId: value, classId: "", sectionIds: [] });
      return;
    }

    if (name === "classId") {
      classWiseNetAmountFormik.setFieldValue("sectionIds", []);
      getSectionListResp({ branchClassId: value });
      getBranchWiseNetAmtApiCall({ classId: value, sectionIds: [] });
      return;
    }

    getBranchWiseNetAmtApiCall({
      [name]: value,
    });
  };

  const exportSubmitHndlr = () => {
    const values = { ...classWiseNetAmountFormik.values };
    const payload = {
      instituteId,
      branchId,
      academicYearId: values.academicYearId,
      studentStatus: values.studentStatus,
      curriculumIds: values.curriculumId
        ? String(values.curriculumId)
        : undefined,
      classIds: values.classId
        ? String(values.classId)
        : undefined,
      sectionIds: Array.isArray(values.sectionIds)
        ? values.sectionIds.map((section: any) =>
          typeof section === "object"
            ? String(section.sectionId)
            : String(section)
        ).join(",")
        : undefined,
    };
    dispatch(exportClassSectionWiseNetAmountAct(generateActionPayload("export_class_section_wise_net_amount", undefined, payload, {
      responseType: 'blob'
    })));
  }

  function selectStudentHndlr(selectedOptions: any, config?: any) {
    const { name } = config;
    classWiseNetAmountFormik.setFieldValue(
      name,
      Array.isArray(selectedOptions) ? selectedOptions : []
    );
    getBranchWiseNetAmtApiCall({
      [name]: Array.isArray(selectedOptions) ? selectedOptions : [],
    });
  }

  const tableColumns = useMemo(() => generateColumns(openShowStuModal), [tableDataState]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};

  return (
    <div>
      <div className="tw-shadow-none">
        <div className="tw-border-b tw-border-gray-200 tw-pt-0">
          <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-m-4">
            <div className="tw-w-1/2">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">Class wise Net amount</h4>
            </div>
            <div className="tw-mt-2 lg:tw-mt-0">
              <button
                id="export-btn"
                className="tw-rounded-full tw-bg-sky-100 tw-p-2 hover:tw-bg-sky-200"
                onClick={openExportModal}
              >
                <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                <UncontrolledTooltip placement="bottom" target="export-btn">
                  Export
                </UncontrolledTooltip>
              </button>
            </div>
          </div>
        </div>
        <div className="tw-p-0 tw-mt-3">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-pt-3 tw-px-4">
            <div className="tw-col-span-12 md:tw-col-span-2">
              <SelectInput
                name="academicYearId"
                value={classWiseNetAmountFormik.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="mb-0"
                labelText="Academic Year"
                floatingLabel
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-2">
              <SelectInput
                name="curriculumId"
                value={classWiseNetAmountFormik.values.curriculumId}
                onChange={filterHandler}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                floatingLabel
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-2">
              <SelectInput
                name="classId"
                value={classWiseNetAmountFormik.values.classId}
                onChange={filterHandler}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                labelText="Class"
                floatingLabel
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-2">
              <MultiSelectCheckbox
                name="sectionIds"
                labelText="Section"
                containerClassName="mb-0"
                idKey="sectionId"
                value={classWiseNetAmountFormik.values.sectionIds}
                renderValue={renderValueStudent}
                renderOptions={renderOptionsStudent}
                onChange={selectStudentHndlr}
                searchKey="sectionName"
                options={sectionListResp?.data || []}
                floatingLabel
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-2">
              <SelectInput
                name="studentStatus"
                value={classWiseNetAmountFormik.values.studentStatus}
                onChange={filterHandler}
                menuItems={stuStatusOptions}
                valueKey="id"
                textKey="name"
                labelText="Student Status"
                floatingLabel
              />
            </div>
          </div>
        </div>
      </div>
      <div className="tw-mb-0">
        <TableExpandable
          columns={tableColumns || []}
          data={tableDataState}
          divClass="table-responsive mb-3 table-expandable table-sticky"
          theadClass="text-muted align-middle theadPrimary"
          tableClass="table-bordered table-nowrap"
          showFooter={true}
          tdFooterClass="fw-bold"
          trFooterClass="bg-light text-center"
          trBodyClass={(row: any) =>
            row.original?.termName === "Total" ? "fw-bold trTotal" : ""
          }
          rowDataInfo={classWiseNetAmountFormik.values}
        ></TableExpandable>
      </div>
      <ModalContainerUpdated
        id="show-unpaid-students-list-modal"
        isOpen={showStuModalState.showModal}
        toggle={closeShowStuModal}
        modalTitle="Students List"
        modalSize="lg"
      >
        <ShowStudents
          isOpen={showStuModalState.showModal}
          toggle={closeShowStuModal}
          modalData={showStuModalState.modalData}
          filterValues={{
            academicYearId: classWiseNetAmountFormik.values.academicYearId,
            studentStatus: classWiseNetAmountFormik.values.studentStatus,
            curriculumId:
              classWiseNetAmountFormik.values.curriculumId ||
              showStuModalState?.modalData?.data?.curriculumId,
            classId:
              classWiseNetAmountFormik.values.classId ||
              showStuModalState?.modalData?.data?.classId,
            sectionIds:
              classWiseNetAmountFormik.values.sectionIds?.length
                ? classWiseNetAmountFormik.values.sectionIds
                : showStuModalState?.modalData?.data?.sectionId
                  ? [showStuModalState.modalData.data.sectionId]
                  : [],
          }}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="export-class-wise-net-paid-by-date-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Class wise Net Amount"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportSubmitHndlr}
          feature="fee"
          subFeature={"class_section_wise_net_amount_report"}
          remarksText="Enter remarks to export Class wise Net Amount?"
        />
      </ModalContainerUpdated>
    </div>
  );
};

export default ClassWiseNetAmount;