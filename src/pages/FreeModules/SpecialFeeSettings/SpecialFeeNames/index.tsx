import { useEffect, useMemo, useRef, useState } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import {
  delSpecialFeeNameItemAct,
  getSpecialFeeCategoryListAct,
  getSpecialFeeNameItemByIdAct,
  getSpecialFeeNamesListAct,
} from "../../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useModal } from "../../../../hooks/modalhook";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../../Components/Common";
import AddEditSpecialFeeNamesModal from "./AddEditSpecialFeeNamesModal";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import Button from "../../../../Components/Common/Button";
import * as Yup from "yup";

const initialValues = {
  searchString: "",
  branchId: "",
};
const validationSchema = Yup.object().shape({
  branchId: Yup.string().required("Branch required."),
});

const SpecialFeeNames = () => {
  // const [filterState, setFilterState] = useState(initialValues);
  const [branchState, setBranchState] = useState<any>([]);

  const specialFeeNames = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {},
  });

  const {
    openModal: addEditSpecialFeeNamesOpenModal,
    closeModal: addEditSpecialFeeNamesCloseModal,
    modalState: addEditSpecialFeeNamesModalState,
  } = useModal();
  const {
    openModal: delSpecialFeeNameOpenModal,
    closeModal: delSpecialFeeNameCloseModal,
    modalState: delSpecialFeeNameModalState,
  } = useModal();

  const dispatch = useAppDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    currentBranchIdResp: branchId,
    showApiLoader,
    getSpecialFeeCategoryListResp,
    specialfeeNamesResp,
    addSpecialfeeNameItemsResp,
    updateSpecialfeeNameItemResp,
    delSpecialfeeNameItemResp,
    masterFeeSettingsErrorResp,
    loggedInUserRole,
    branchListResp,
    virtualRoleResp

  }: any = useAppSelector(
    ({ appData, masterFeeSettings, globalData, branch }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      getSpecialFeeCategoryListResp:
        masterFeeSettings.getSpecialFeeCategoryListResp,
      specialfeeNamesResp: masterFeeSettings.specialfeeNamesResp,
      addSpecialfeeNameItemsResp: masterFeeSettings.addSpecialfeeNameItemsResp,
      updateSpecialfeeNameItemResp:
        masterFeeSettings.updateSpecialfeeNameItemResp,
      delSpecialfeeNameItemResp: masterFeeSettings.delSpecialfeeNameItemResp,
      masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
      loggedInUserRole: appData.loggedInUserRole,
            branchListResp: branch.branchListResp,
            virtualRoleResp: appData.virtualRoleResp
    }),
    shallowEqual
  );

  const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;

  const fetchSpecialfeeNamesList = (otherProps?: any) => {
    const payload = {
      branchId: showInstituteAdminUI ? specialFeeNames.values.branchId : branchId,
      ...paginationRef.current,
      ...otherProps,
    };
    if(payload.branchId){
        dispatch(
          getSpecialFeeNamesListAct(
            generateActionPayload("get_special_fee_Names", undefined, payload)
          )
        );
    }
  };

  const specialFeeCategoryList = () => {
    let payload = {
      branchId,
    };
    dispatch(
      getSpecialFeeCategoryListAct(
        generateActionPayload(
          "get_special_fee_category_list",
          undefined,
          payload
        )
      )
    );
  };

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    specialFeeNames.setValues((prev) => ({ ...prev, [name]: value }));
    paginationRef.current.pageNo = 0;
    fetchSpecialfeeNamesList({ [name]: value });
  };

  const specialFeeNamesRef = useRef({
    prevAddSpecialfeeNameItemsResp: addSpecialfeeNameItemsResp,
    prevUpdateSpecialfeeNameItemResp: updateSpecialfeeNameItemResp,
    prevDelSpecialfeeNameItemResp: delSpecialfeeNameItemResp,
    prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp,
  });

  useEffect(() => {
    const {
      prevAddSpecialfeeNameItemsResp,
      prevUpdateSpecialfeeNameItemResp,
      prevDelSpecialfeeNameItemResp,
      prevMasterFeeSettingsErrorResp,
    } = specialFeeNamesRef.current;

    if (
      prevAddSpecialfeeNameItemsResp !== addSpecialfeeNameItemsResp &&
      addSpecialfeeNameItemsResp
    ) {
      toast.success("Fee Names added successfully");
      fetchSpecialfeeNamesList();
      addEditSpecialFeeNamesCloseModal();
    } else if (
      prevUpdateSpecialfeeNameItemResp !== updateSpecialfeeNameItemResp &&
      updateSpecialfeeNameItemResp
    ) {
      toast.success("Fee Name updated successfully");
      fetchSpecialfeeNamesList();
      addEditSpecialFeeNamesCloseModal();
    } else if (
      prevDelSpecialfeeNameItemResp !== delSpecialfeeNameItemResp &&
      delSpecialfeeNameItemResp
    ) {
      toast.success("Fee Name deleted successfully");
      fetchSpecialfeeNamesList();
      delSpecialFeeNameCloseModal();
    } else if (
      prevMasterFeeSettingsErrorResp !== masterFeeSettingsErrorResp &&
      masterFeeSettingsErrorResp
    ) {
      const { details } = masterFeeSettingsErrorResp;
      toast.error(details);
    }

    specialFeeNamesRef.current.prevAddSpecialfeeNameItemsResp =
      addSpecialfeeNameItemsResp;
    specialFeeNamesRef.current.prevUpdateSpecialfeeNameItemResp =
      updateSpecialfeeNameItemResp;
    specialFeeNamesRef.current.prevDelSpecialfeeNameItemResp =
      delSpecialfeeNameItemResp;
    specialFeeNamesRef.current.prevMasterFeeSettingsErrorResp =
      masterFeeSettingsErrorResp;
  }, [
    addSpecialfeeNameItemsResp,
    updateSpecialfeeNameItemResp,
    delSpecialfeeNameItemResp,
    masterFeeSettingsErrorResp,
  ]);


  useEffect(() => {
    if (branchListResp) {
      const branch = branchListResp?.data[0];
      setBranchState(branchListResp?.data.filter((branch: any) => branch.branchId != branchId))
      specialFeeNames.setFieldValue("branchId", branch.branchId);
      fetchSpecialfeeNamesList({ branchId: branch.branchId });
    }
  }, [branchListResp])

  const delSpecialFeeNameHandlr = () => {
    dispatch(
      delSpecialFeeNameItemAct(
        generateActionPayload("del_special_fee_name_item", {
          feeNameId: delSpecialFeeNameModalState.modalData,
        })
      )
    );
  };

  const tableActions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(
            getSpecialFeeNameItemByIdAct(
              generateActionPayload("get_special_fee_name_by_id", {
                feeNameId: id,
              })
            )
          );
          addEditSpecialFeeNamesOpenModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          delSpecialFeeNameOpenModal(id);
        },
      },
    ],
    [specialfeeNamesResp]
  );

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchSpecialfeeNamesList(paginationInfo);
  }

  function addFeeNameModalHndlr() {
    if (showInstituteAdminUI && !specialFeeNames.values.branchId) {
      specialFeeNames.setFieldTouched("branchId", true, true);
      return;
    }
    addEditSpecialFeeNamesOpenModal();
  }


  const tableColumns = useMemo(() => {

    const newColumns = generateColumns(tableActions)
    if (showInstituteAdminUI) {
            return newColumns
        } else {
           return newColumns.filter(item => item?.accessor !== "branchName")
        }
  }
    , []);

  useEffect(() => {
    fetchSpecialfeeNamesList();
    specialFeeCategoryList();
  }, []);

  const {
    data: specialfeeNamesList,
    pageNumber,
    totalPages,
    totalElements,
  } = specialfeeNamesResp || {};

  return (
    <>
      <div className="tw-w-full">

        <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-end tw-gap-4 tw-p-4">

          <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/4">
            <div className="tw-relative search-box">
              <TextInput
                name="searchString"
                formgroupClassName="tw-mb-0"
                placeHolder="Search..."
                value={specialFeeNames.values.searchString}
                onChange={filterHandler}
                floatingLabel
                labelText="Search"
              />
              <i className="ri-search-line tw-absolute tw-left-3 tw-top-2 tw-text-gray-400"></i>
            </div>
          </div>
          {showInstituteAdminUI && (
            <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/4">
              <SelectInput
                name="branchId"
                valueKey="branchId"
                textKey="branchName"
                value={specialFeeNames.values.branchId}
                menuItems={branchState}
                onChange={filterHandler}
                labelText="Branch Name"
                floatingLabel
                formgroupClassName="tw-mb-0"
                invalid={!!(specialFeeNames.touched.branchId && specialFeeNames.errors.branchId)}
                error={specialFeeNames.touched.branchId ? specialFeeNames.errors.branchId : ""}
              />
            </div>
          )}

          <div className="tw-flex tw-justify-end tw-flex-1">
            <Button
              onClick={addFeeNameModalHndlr}
              variant="primary"
            >
              <i className="ri-add-line tw-mr-2"></i>
              Add New
            </Button>
          </div>

        </div>

        <div className="">
          <TableContainer
            columns={tableColumns}
            data={Array.isArray(specialfeeNamesList) ? specialfeeNamesList : []}
             divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            showPagination={true}
            totalPages={totalPages || 0}
            totalRecords={totalElements || 0}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageNumber || 0}
          />
        </div>

      </div>

      <ModalContainerUpdated
        id="add-edit-fee-name-modal-container"
        isOpen={addEditSpecialFeeNamesModalState.showModal}
        toggle={addEditSpecialFeeNamesCloseModal}
        modalSize="lg"
        modalTitle={
          addEditSpecialFeeNamesModalState.modalData
            ? "Edit Fee Name Details"
            : "Add Fee Names"
        }
      >
        <AddEditSpecialFeeNamesModal
          isOpen={addEditSpecialFeeNamesModalState.showModal}
          toggle={addEditSpecialFeeNamesCloseModal}
          branchId={branchId || specialFeeNames.values.branchId}
          feeNameItemId={addEditSpecialFeeNamesModalState.modalData}
        ></AddEditSpecialFeeNamesModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-category-modal"
        isOpen={delSpecialFeeNameModalState.showModal}
        confirmMessage="Are you sure you want to delete this Category?"
        cancelHndlr={delSpecialFeeNameCloseModal}
        confirmHndlr={delSpecialFeeNameHandlr}
        isDisble={showApiLoader}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default SpecialFeeNames;
