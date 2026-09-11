import { useState } from "react";
import { Button, MultiSelectCheckbox, SelectInput } from "../../../Components/Common";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import { Current_Date_YYYYMMDD } from "../../../utility/dateutility";
import { categoryList } from "./helper";


const initialValues: any = {
  branchId: null,
  academicYearId: null,
  complaintCategory: null,
  departmentId: "",
  complaintUserType: null,
  dateType: null,
  startDate: "",
  endDate: "",
};

const AdavanceFilterModal = (props: any) => {

  const [enquiryFilterState, setEnquiryFilterState] = useState<any>(props.appliedFilter || initialValues);

  function onSelectOptionHandler(selectedOptions: any, config?: any) {
    const { name } = config;
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      setEnquiryFilterState((prevState: any) => ({ ...prevState, departmentNames: selectedOptions }));
    } else {
      setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: null }));
    }
  }

  function renderOptionsStatus(item: any) {
    return item?.name;
  }

  function renderValueStatus(selectedItems: any) {

    if (Array.isArray(selectedItems)) {
      return (<div className="text-truncate">
        {
          selectedItems.map((item, index) => {
            return item?.name + (index !== (selectedItems.length - 1) ? ', ' : '')
          })
        }
      </div>)
    }
  }

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      setEnquiryFilterState((prev: any) => ({ ...prev, startDate, endDate }));
    }
  }

  function applyFilterHndlr() {
    props.toggleAdvanceFilter()

    let updatedFilterState = { ...enquiryFilterState };
    if (updatedFilterState?.startDate && !updatedFilterState?.endDate) {
      props.applyFilterCallback({ ...updatedFilterState, endDate: Current_Date_YYYYMMDD });
    }

    props.applyFilterCallback(updatedFilterState);
  }

  const onChangeHandler = (event: any) => {
    const { name, value } = event.target;
    setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }));
    
    if(!props.appliedFilter?.branchId){
      props.getDepartmentListApiCall({ complaintCategory: value });
    }
    else {
      props.getDepartmentListApiCall({ branchId: props.appliedFilter?.branchId, complaintCategory: value });
    }
  };

  return (
    <>
      <div className="offcanvas-body">
        <div className="mb-3">
          <CustomDatePicker
            name="dateRange"
            startDate={enquiryFilterState.startDate}
            endDate={enquiryFilterState.endDate}
            onChange={handleDateChange}
            placeholder="Select a Date Range"
            monthsShown={2}
            formgroupClassName="tw-mb-0"
            labelText="Date Range"
            portalId={"advance-filters-super-admin-helpdesk"}
          ></CustomDatePicker>
        </div>
        <div>
          <SelectInput
            name="complaintCategory"
            value={enquiryFilterState.complaintCategory}
            onChange={onChangeHandler}
            menuItems={categoryList || []}
            valueKey="id"
            textKey="name"
            labelText="Category"
          />
        </div>
        <div className="tw-mb-3">
          <MultiSelectCheckbox
            name="departmentNames"
            idKey="name"
            labelText='Department'
            value={enquiryFilterState.departmentNames}
            renderValue={renderValueStatus}
            renderOptions={renderOptionsStatus}
            onChange={onSelectOptionHandler}
            searchKey="name"
            options={props.departments || []}
          />
        </div>
      </div>
      <div className="tw-border-t tw-p-2 tw-text-center">
        <div className="tw-flex tw-items-center tw-justify-end">
          <Button
            type="submit"
            onClick={applyFilterHndlr}
            // disabled={showApiLoader}
            variant="primary"
          >
            Submit
          </Button>
        </div>
      </div>

    </>


  );
};

export default AdavanceFilterModal;
