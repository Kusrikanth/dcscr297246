import React, {
  useMemo,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { TextIconInput, SelectInput } from "../../../Components/Common";
import { generateColumns, menuItems, getDefaultSortColumns } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getGlobalRecordsAct,
} from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";


//Modal Component

//Interface and Types

const converter: any = {
  nationality: "nationalityName",
  religion: "religionName",
  caste: "casteName",
  "mother-tongue": "motherTongueName",
  gender: "genderName",
  occupation: "occupationName",
  "blood-group": "bloodGroupName",
  bankName: "bankName",
}

const initialSortColumns = getDefaultSortColumns("nationality");

const GlobalRecords: React.FC<any> = ({ instituteId, instituteName }) => {
  const [modalState, setModalState] = useState<any>({
    showModal: false,
    modalData: [],
  });
  const [filterState, setFilterState] = useState<any>({
    categoryName: "nationality",
    searchString: ""
  });
  const sortingRef = useRef<any>(undefined);
  const [updateSortKeyState, setUpdateSortKeysState] = useState(initialSortColumns);
  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });
  const dispatch = useAppDispatch();
  const { instMasterFieldsResp, instInfoError, globalRecordData } =
    useAppSelector(({ instituteInfo }) => ({
      instMasterFieldsResp: instituteInfo.instMasterFieldsResp,
      instInfoError: instituteInfo.instInfoError,
      globalRecordData: instituteInfo.globalRecordData,
    }), shallowEqual);

  useEffect(() => {
    if (instituteId)
      getGlobalRecordsApiCall();
  }, [instituteId]);

  const moduleLevelRespRef = useRef<any>({
    prevInstMasterFieldsResp: instMasterFieldsResp,
    prevInstInfoError: instInfoError,
  });

  useEffect(() => {
    const { prevInstInfoError } =
      moduleLevelRespRef.current;
    if (instInfoError && instInfoError !== prevInstInfoError) {
      const { details }: any = instInfoError;
      toast.error(details || "Something went wrong.");
    }
    moduleLevelRespRef.current.prevInstInfoError = instInfoError;
  }, [instInfoError]);

  const viewFieldValuesHndlr = useCallback(
    (event: any) => {
      const fieldId = event.target.getAttribute("data-id"),
        { fieldValueResponse } =
          (Array.isArray(instMasterFieldsResp) &&
            instMasterFieldsResp.find((item) => item.categoryId === fieldId)) ||
          {};
      setModalState((prevState: any) => ({
        ...prevState,
        showModal: true,
        modalData: fieldValueResponse,
      }));
    },
    [instMasterFieldsResp]
  );

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getGlobalRecordsApiCall();
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value }: { name: string, value: string } = event.target;
    // const obj = name === "categoryName" ? { sortBy: converter[value] } : {};
    //Resest page number to 0 if filters are applied
    paginationDetailRef.current.pageNo = 0;
    setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    getGlobalRecordsApiCall({ [name]: value });
  }

  function onChangeCategoryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value }: { name: string, value: string } = event.target;
    const sortColumns = getDefaultSortColumns(value);
    setUpdateSortKeysState(sortColumns);
    sortingRef.current = sortColumns;

    //Resest page number to 0 if filters are applied
    paginationDetailRef.current.pageNo = 0;
    setFilterState((prevState: any) => ({ ...prevState, [name]: value, searchString: "" }));
    getGlobalRecordsApiCall({ [name]: value, searchString: "" });
  }

  function getGlobalRecordsApiCall(otherProps?: any) {
    const sortingParams = getSortingKeys(sortingRef.current);
    const payload = { ...filterState, ...otherProps, ...paginationDetailRef.current, ...sortingParams };
    dispatch(getGlobalRecordsAct(generateActionPayload("get_inst_global_records", undefined, payload)));
  }

  const sortingHandler = useCallback((sortingKeys: any) => {
    if (sortingRef.current && sortingRef.current !== sortingKeys) {
      sortingRef.current = sortingKeys;
      getGlobalRecordsApiCall();
    } else {
      sortingRef.current = sortingKeys;
    }
  }, [filterState])

  const globalRecordsColumns = useMemo(() => generateColumns(viewFieldValuesHndlr, filterState.categoryName), [globalRecordData, filterState.categoryName]),
    { data: globalRecordsTableData, pageNumber, totalPages, totalElements } = globalRecordData || {};
  return (
    <React.Fragment>
      <div className="tw-rounded-lg tw-shadow-md tw-bg-white tw-overflow-hidden">
        <div className="tw-px-6 tw-py-4 tw-border-b ">
          <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0 tw-flex-grow">
            Global Records
          </h4>
        </div>
        <div className="tw-p-0">
          <div className="tw-py-3 tw-px-3">
            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
              <div className="tw-col-span-4">
                <TextIconInput
                  formgroupClassName="search-box"
                  name="searchString"
                  value={filterState.searchString}
                  placeHolder="Search"
                  onChange={onChangeFilterHndlr}
                  labelText="Search"
                  floatingLabel
                >
                  <i className="ri-search-line search-icon"></i>
                </TextIconInput>
              </div>
              <div className="tw-col-span-3">
                <SelectInput
                  name="categoryName"
                  value={filterState.categoryName}
                  // inputClassName="tw-bg-gray-100"
                  onChange={onChangeCategoryHndlr}
                  menuItems={menuItems}
                  valueKey="categoryId"
                  textKey="categoryName"
                  formgroupClassName="tw-mb-0"
                  hideSelectOption={true}
                  labelText="Category"
                  floatingLabel
                />
              </div>
            </div>
          </div>
          <TableContainer
            columns={globalRecordsColumns}
            data={globalRecordsTableData}
            divClass="tw-overflow-x-auto tw-mb-1"
            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
            showPagination={true}
            totalPages={totalPages}
            totalRecords={totalElements}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageNumber}
            defaultSort={initialSortColumns}
            updateDefaultSortKeys={updateSortKeyState}
            manualSorting={true}
            sortingHandler={sortingHandler}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default GlobalRecords;
