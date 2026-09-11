import { useMemo } from "react";
import { SelectInput, TableExpandable } from "../../../../Components/Common";
import { generateColumns, transformTableData } from "./helper";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const SubjectGradeAnalysis = (props: any) => {
  
   const tableColumns = useMemo(() => {
    if (!props.data) return [];
    return generateColumns(props.data);
  }, [props.data]);

  const tableData = useMemo(() => {
    if (!props.data) return [];
    return transformTableData(props.data);
  }, [props.data]);  

  const {
    instSecondClassResp 
  } = useAppSelector(({ instAcademics }) => ({
    instSecondClassResp: instAcademics.instSecondClassResp,
  }), shallowEqual);


  return (
    <div className="card !tw-rounded-2xl !tw-shadow-sm">
      <div className="card-header !tw-rounded-t-2xl">
        <div className="tw-grid tw-grid-cols-12 tw-items-center tw-gap-3">
          <div className="tw-col-span-12 lg:tw-col-span-6">
            <h4 className="card-title !tw-mb-0">
              Subject & Grade wise Analysis (All Branches)
            </h4>
          </div>
          <div className="tw-col-span-12 sm:tw-col-span-6 md:tw-col-span-4 lg:tw-col-span-3 lg:tw-col-start-10">
            <SelectInput
              name="thirdClassId"
              value={props.filterValues.thirdClassId}
              onChange={props.setFilterValues}
              menuItems={instSecondClassResp || []}
              valueKey="classSequence"
              textKey="classNames"
              labelText="Class"
              floatingLabel
              formgroupClassName="mb-0"
            />
          </div>
        </div>
      </div>

      <div className="tw-p-0">
        <TableExpandable
          columns={tableColumns || []}
          data={tableData || []}
          divClass="table-responsive !tw-overflow-x-auto mb-3 table-expandable"
        theadClass="text-muted align-middle theadPrimary"
        tableClass="table-bordered table-nowrap"
        showFooter={true}
        trFooterClass="fw-semibold bg-light"
          // trFooterClass="tw-font-semibold tw-bg-gray-100"
        ></TableExpandable>
      </div>
    </div>
  );
};

export default SubjectGradeAnalysis;
