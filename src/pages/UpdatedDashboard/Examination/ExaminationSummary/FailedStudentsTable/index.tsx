import { useCallback, useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { Button, SelectInput, TextInput } from "../../../../../Components/Common";
import { debounce, searhWithTextInList } from "../../../../../utility/commonutility";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../../assets/imagesdps/common_icon/export_icon.svg";

const initialValues = {
  searchString: "",
  subject: "",
};

const FailedStudentsTable = (props: any) => {
   const [subjectTeacherFilterState, setSubjectTeacherFilterState] = useState<any>(initialValues);
  const [orgTeacherList, setOrgTeacherList] = useState<any>([]);
  const [teacherList, setTeacherList] = useState<any>([]);

  function search(event: any) {

    let abc = searhWithTextInList(orgTeacherList, ['studentName', 'studentCode', 'subjectName'], event.target.value);
    setTeacherList(abc);
  }
  const debounceFun = useCallback(debounce(search, 1000), [orgTeacherList])
  const searchHandler = (event: any) => {
    const { name, value } = event.target;
    setSubjectTeacherFilterState(prev => ({ ...prev, [name]: value, subject: "" }))
    debounceFun(event)

  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    setSubjectTeacherFilterState(prev => ({ ...prev, [name]: value }))
    let abc = searhWithTextInList(orgTeacherList, ['subjectName'], event.target.value);
    setTeacherList(abc);
  }
  
  useEffect(() => {
    setOrgTeacherList(props.data?.failedStudents);
    setTeacherList(props.data?.failedStudents);
  }, [props.data]);

  const tableColumns = useMemo(() => generateColumns(), [ props.data]);


  return (
    <div className="book-summary tw-px-0 tw-h-full">
      <div className="tw-grid tw-grid-cols-12 tw-p-3 tw-gap-x-3 tw-sticky tw-top-0">
        <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-3">
          <div className="search-box">
              <TextInput
                name="searchString"
                value={subjectTeacherFilterState.searchString}
                onChange={searchHandler}
                formgroupClassName="tw-mb-0"
                placeHolder="Search..."
              />
              <i className="ri-search-line search-icon"></i>
            
            <i className="ri-search-line search-icon"></i>
          </div>
        </div>
        <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-3">
          <SelectInput
            name="subject"
            value={subjectTeacherFilterState.subject}
            onChange={filterHandler}
            menuItems={props?.subjectList || []}
            valueKey="name"
            textKey="name"
            formgroupClassName="tw-mb-0"
            labelText="Subject"
            floatingLabel
          />
        </div>
        <div className="tw-col-auto tw-ml-auto">
          <div className="tw-flex tw-items-center">
            <Button
              id="export-btn"
              variant="exportBtn"
            // onClick={openExportSectionModalHnldr}
            >
              <img src={ExportIcon} className="tw-w-5 tw-h-5" />
              <UncontrolledTooltip placement="bottom" target="export-btn">
                Export
              </UncontrolledTooltip>
            </Button>
          </div>
        </div>
      </div>
      <TableContainer
        columns={tableColumns || []}
        data={teacherList || []}
        tableClass="mb-0"
        divClass="table-responsive mb-0 tw-h-[80%]"
        theadClass="table-light text-muted align-middle position-sticky top-0"
      ></TableContainer>
    </div>
  );
};

export default FailedStudentsTable;
