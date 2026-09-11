import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
import { IPaginationState } from "../../../Components/Common/Pagination";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import {
  getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  IAcademicYearsProps,
} from "./academicyearstypes";
import { generateAcademicYearsColumns } from "./helper";

const AcademicYearsTab: React.FC<IAcademicYearsProps> = ({
  instituteId,
  instituteName,
}) => {
  const [filterState, setFilterState] = useState<any>({
    searchString: undefined,
    sortBy: "academicYearName",
    orderBy: "desc"
  });

  const dispatch = useAppDispatch();
  const { academicYearListResp, instAcademicErrorResp } = useAppSelector(
    ({ instAcademics }: any) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      instAcademicErrorResp: instAcademics.instAcademicErrorResp,
    }),
    shallowEqual
  );

  const academicYearTabsRespRef = useRef<any>({
    prevInstAcademicErrorResp: instAcademicErrorResp,
  });

  useEffect(() => {
    const { prevInstAcademicErrorResp } =
      academicYearTabsRespRef.current;
    if (
      instAcademicErrorResp &&
      instAcademicErrorResp !== prevInstAcademicErrorResp
    ) {
      const { details }: any = instAcademicErrorResp;
      toast.error(details || "Something went wrong");
    }
    academicYearTabsRespRef.current.prevInstAcademicErrorResp =
      instAcademicErrorResp;
  }, [instAcademicErrorResp]);

  useEffect(() => {
    if (instituteId) {
      getAcademicYearApicall();
    }
  }, [instituteId]);

  function getAcademicYearApicall(otherProps?: any) {
    const payload = { instituteId, ...filterState, ...otherProps };
    dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
  }
  
  function paginationHndlr(paginationInfo: IPaginationState) {
    getAcademicYearApicall(paginationInfo);
  }
  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    getAcademicYearApicall({ [name]: value });
  }

  const academicYearColumns = useMemo(() => generateAcademicYearsColumns(), [academicYearListResp]),
    { data: academicYearList, pageNumber, totalPages, totalElements } = academicYearListResp || {};
  return (
    <>
      <div>
        {/* <div className="py-3 px-3">
          <form onClick={(e) => e.preventDefault()}>
            <div className="row g-3">
              <div className="col-4">
                <TextIconInput
                  formgroupClassName="search-box"
                  name="searchString"
                  value={filterState.searchString}
                  placeHolder="Search..."
                  onChange={onChangeFilterHndlr}
                >
                  <i className="ri-search-line search-icon"></i>
                </TextIconInput>
              </div>
            </div>
          </form>
        </div> */}
        <TableContainer
          columns={academicYearColumns || []}
          data={Array.isArray(academicYearList) ? academicYearList : []}
          divClass="tw-overflow-x-auto tw-mb-1"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          tableClass="tw-whitespace-nowrap"
          showPagination={true}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageNumber}
        />
      </div>
    </>
  );
};

export default AcademicYearsTab;
