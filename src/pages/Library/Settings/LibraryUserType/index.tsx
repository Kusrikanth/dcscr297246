import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { generateColumns } from "./helper";
import { editLibraryUserTypeListAct, getLibraryUserTypeListAct } from "../../../../store/library/settings/librarysettingsaction";

const initialValues = {
  searchString: "",
};

const LibraryUserType = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [userDataList, setUserDataList] = useState<any>([]);

  const [stockVerifiedModal, setStockVerifiedModal] = useState({
    showModal: false,
  })
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const [libraryUserTypeForm, setLibraryUserType] = useState(initialValues);

  const toggleStockVerifiedModal = () => {
    setStockVerifiedModal((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const libraryUserTypeList = (otherProps?: any) => {
    const { searchString } = libraryUserTypeForm;
    let payload = {
      branchId,
      searchString,
      sortBy: "createdAt",
      orderBy: "asc",
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getLibraryUserTypeListAct(generateActionPayload("get_library_user_type", undefined, payload)));
  };
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    libraryUserTypeRequestListResp,
    editLibraryUserTypeRequestResp,
    libraryDetailsErrorAct,
  } = useAppSelector(
    ({ librarysettings, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      libraryUserTypeRequestListResp: librarysettings.libraryUserTypeRequestListResp,
      editLibraryUserTypeRequestResp: librarysettings.editLibraryUserTypeRequestResp,
      libraryDetailsErrorAct: librarysettings.libraryDetailsErrorAct,
    }),
    shallowEqual
  );

  const libraryUserTypeRef = useRef({
    prevEditLibraryUserTypeRequestResp: editLibraryUserTypeRequestResp,
    prevLibraryUserTypeRequestListResp: libraryUserTypeRequestListResp,
    prevLibraryDetailsErrorResp: libraryDetailsErrorAct,
  });

  useEffect(() => {
    const { prevEditLibraryUserTypeRequestResp, prevLibraryUserTypeRequestListResp, prevLibraryDetailsErrorResp } = libraryUserTypeRef.current;
    if (editLibraryUserTypeRequestResp && prevEditLibraryUserTypeRequestResp !== editLibraryUserTypeRequestResp) {
      toast.success("User Type Updated Successfully.");
      toggleStockVerifiedModal();
      libraryUserTypeList();
    } else if (libraryUserTypeRequestListResp && libraryUserTypeRequestListResp !== prevLibraryUserTypeRequestListResp) {
      const { content } = libraryUserTypeRequestListResp || {};
      setUserDataList(content?.map((i: any) => ({ ...i, isSelected: false })) || []);
    } else if (libraryDetailsErrorAct && prevLibraryDetailsErrorResp !== libraryDetailsErrorAct) {
      const { details } = libraryDetailsErrorAct;
      toast.error(details);
    }
    libraryUserTypeRef.current.prevEditLibraryUserTypeRequestResp = editLibraryUserTypeRequestResp;
    libraryUserTypeRef.current.prevLibraryUserTypeRequestListResp = libraryUserTypeRequestListResp;
    libraryUserTypeRef.current.prevLibraryDetailsErrorResp = libraryDetailsErrorAct;
  }, [editLibraryUserTypeRequestResp, libraryUserTypeRequestListResp, libraryDetailsErrorAct]);


  useEffect(() => {

    libraryUserTypeList();
  }, [branchId,instituteId,]);

  const onChangeInputHndlr = (id: number, value: any, name: string) => {
    setUserDataList((prevList: any[]) =>
      prevList.map((item) => {
        if (item.id === id) {
          if (name === "maximumBooks" || name === "maximumDays" || name === "fineAmountPerDay") {
            return { ...item, [name]: value };
          }
        }
        return item;
      })
    );
  };


  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryUserTypeList(paginationInfo);
  }
  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLibraryUserType((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    libraryUserTypeList({ [name]: value });
  };


  const singleUserDataCheckHndlr = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    const usedDetailsData = event.currentTarget.getAttribute("data-id");
    const userRowIndex = userDataList.findIndex((item: any) => +item.id === Number(usedDetailsData));
    if (userRowIndex > -1) {
      setUserDataList((prevList: any) => {
        const updatedList = [...prevList];
        updatedList[userRowIndex] = { ...updatedList[userRowIndex], isSelected: checked };
        return updatedList;
      });
    }
  }, [userDataList]);

  const handleRelocate = (id: number, maximumDays: any, maximumBooks: any, fineAmountPerDay: any) => {
    const relocatePayload = {
      id,
      maximumDays,
      maximumBooks,
      fineAmountPerDay
    };
    dispatch(editLibraryUserTypeListAct(generateActionPayload("update_library_user_type", { id }, relocatePayload)));
    setUserDataList((prevList: any) =>
      prevList.map((item: any) => ({ ...item, isSelected: false }))
    );
  };

  const columns = useMemo(() => generateColumns( singleUserDataCheckHndlr, handleRelocate), [userDataList]);

  const { content: libraryUserTypeResp, totalElements, totalPages, pageable } = libraryUserTypeRequestListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-flex-1">
                  Library User Type
                </h4>
              </div>
            </div>
            <div className="tw-p-0">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pt-4">
                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-4">
                  <div className="tw-relative">
                    <TextInput
                      name="searchString"
                      formgroupClassName="tw-mb-3"
                      placeHolder="Search..."
                      value={libraryUserTypeForm.searchString}
                      onChange={filterHandler}
                      floatingLabel
                      labelText="Search"
                    />
                    <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-slate-400"></i>
                  </div>
                </div>
              </div>
              <TableContainer
                columns={columns}
                data={userDataList}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-slate-50 tw-text-slate-500 tw-align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
                onChangeInputHndlr={onChangeInputHndlr}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryUserType;
