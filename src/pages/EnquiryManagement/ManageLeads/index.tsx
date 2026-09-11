import { UncontrolledTooltip } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useCallback, useMemo, useRef, useState } from "react";
import { enquiryData, generateColumns } from "./helper";
import { useHistory } from "react-router-dom";
import TableContainer from "../../Progress/DummyTable";
import { SelectInput, TextInput } from "../../../Components/Common";
import Button from "../../../Components/Common/Button";
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as CalendarSvg } from "../../../assets/imagesdps/academics/Calendar_1.svg?react";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftRightIcon, CalendarAdd02Icon, Delete02StrokeStandard, PencilEdit02Icon, UserEdit01Icon } from "@hugeicons-pro/core-stroke-standard";



const ManageLeads = () => {
  const history = useHistory();

  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,

})

  const menuOptions = useMemo(
    () => [
      {
        id: "communicate",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-me-2 tw-text-gray-500" size={18} />,
        actionName: "Communicate",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
        },
      },
      {
        id: "changeleadstage",
        actionIcon: <HugeiconsIcon icon={ArrowLeftRightIcon} className="tw-me-2 tw-text-gray-500" size={18} />,
        actionName: "Change Lead Stage",
      },
      {
        id: "reassignlead",
        actionIcon: <HugeiconsIcon icon={UserEdit01Icon} className="tw-me-2 tw-text-gray-500" size={18} />,
        actionName: "Re-assign Lead",
      },
      {
        id:"addevent",
        actionIcon: <HugeiconsIcon icon={CalendarAdd02Icon} className="tw-me-2 tw-text-gray-500" size={18} />,
        actionName: "Add Event",
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-me-2 tw-text-red-500" size={18} />,
        actionName: "Delete",
      }
    ],
    []
  );

  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    let updateStudentState = [""];
    updateStudentState.forEach((item: any) => {
        item.isSelected = checked;
    });
}, []);

const singleStudentCheckHndlr = useCallback((event: any) => {
  const { checked } = event.currentTarget,
      registrationNumber = event.currentTarget.getAttribute("data-id")
}, []);
function paginationHndlr(paginationInfo: IPaginationState) {
  pagination.current = paginationInfo;
  setAllStudentSelectedState(false)
}
const newReceiptHndlr = () => {
  history.push("/manage-leads/lead-details");
};

  const roleColumns = useMemo(
    () => generateColumns(menuOptions,allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState),
    [menuOptions]
  );

  const { totalPages, totalElements, pageNumber } = {
    totalPages: 10,
    totalElements: 100,
    pageNumber: 1
  }


  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Manage Leads" pageTitle="Enquiry Management" />

          <div className="tw-bg-white tw-shadow tw-rounded-lg tw-mb-6">
            <div className="tw-p-4 tw-border-b">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">Manage leads</h4>
                </div>
              </div>
            </div>

            <div className="tw-p-6">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="tw-relative search-box">
                    <TextInput
                      name="searchString"
                      value={""}
                      onChange={undefined}
                      inputClassName="tw-bg-gray-100"
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search..."
                    />

                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw-translate-y-[-50%] tw-text-gray-400"></i>
                  </div>
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={""}
                      onChange={undefined}
                    menuItems={ []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-0"
                    // isDisabled={true}
                    defaultSelect="Lead Stage"
                  />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={""}
                    onChange={undefined}
                    menuItems={[]}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Lead Owner"
                  />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="classId"
                    value={""}
                      onChange={undefined}
                    menuItems={[]}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Campaign Source"
                  />
                </div>

                <div className="tw-col-span-12 xl:tw-col-span-auto tw-ml-auto tw-flex tw-items-center tw-gap-2">
                  <Button
                    variant="primary"
                    onClick={newReceiptHndlr}
                  >
                    <div className="tw-flex tw-items-center">
                      <span>Add Enquiry</span>
                    </div>
                  </Button>
                  <Button
                    variant="primary"
                    onClick={newReceiptHndlr}
                  >
                    <div className="tw-flex tw-items-center">
                      <span>Assign Lead</span>
                    </div>
                  </Button>
                  <Button
                    variant="exportBtn"
                    id="export-btn"
                  >
                    <img src={ExportIcon} className="tw-max-w-full tw-h-full" />
                    <UncontrolledTooltip placement="bottom" target="export-btn">
                      Export
                    </UncontrolledTooltip>
                  </Button>
                </div>
              </div>
            </div>
            <TableContainer
              columns={roleColumns || []}
              data={enquiryData || []}
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
              // showCheckbox={true}
              showPagination={true}
              totalPages={totalPages}
              totalRecords={totalElements}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageNumber}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageLeads;
