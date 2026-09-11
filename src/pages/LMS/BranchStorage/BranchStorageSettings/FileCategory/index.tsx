import { useFormik } from 'formik';
import { useEffect, useMemo, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../../../../hooks/modalhook';
import { ModalContainerUpdated, TextInput } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getInstBranchesAct } from '../../../../../store/mastersettings/branch/branchactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getFileTypeCategoryListAct } from '../../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions';
import { toast } from 'react-toastify';
import AddEditOpenModal from './AddEditOpenModal';
import { generateColumns } from './helper';

const initialValues = {
  searchString: '',
  branchId: '',
};

const FileCategory = () => {

  const dispatch = useAppDispatch();
  const history = useHistory();
  const { openModal: addFileCategoryOpenModal, closeModal: closeFileCategoryModal, modalState: branchFileCategoryModalState } = useModal();

  const branchFileCategoryApiCall = () => {
    dispatch(
      getFileTypeCategoryListAct(
        generateActionPayload(
          "get_file_category_list",
          undefined,
          {
            instituteId,
            search: branchStorageFormik.values.searchString,
          }
        )
      )
    );
  };

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    getFileCategoryListResp,
    saveFileCategoryResp,
    branchStorageSettingsErrorAct,
  } =
    useAppSelector(({ appData, globalData, instituteInfo, branch, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      getFileCategoryListResp: branchStorageSettings.getFileCategoryListResp,
      saveFileCategoryResp: branchStorageSettings.saveFileCategoryResp,
      branchStorageSettingsErrorAct: branchStorageSettings.branchStorageSettingsErrorAct,
    }), shallowEqual);

  const branchWiseNetPaidByDateRef = useRef({
    prevBranchStorageSettingsErrorAct: branchStorageSettingsErrorAct,
    prevSaveBranchStorageResp: saveFileCategoryResp,
  });

  useEffect(() => {
    const { prevBranchStorageSettingsErrorAct, prevSaveBranchStorageResp } =
      branchWiseNetPaidByDateRef.current;
    if (branchStorageSettingsErrorAct && branchStorageSettingsErrorAct !== prevBranchStorageSettingsErrorAct) {
      const { details, ERROR } = branchStorageSettingsErrorAct || {}
      toast.error(ERROR || details || "Something went wrong");
    } else if (saveFileCategoryResp && prevSaveBranchStorageResp !== saveFileCategoryResp) {
      toast.success("File Category saved successfully.");
      closeFileCategoryModal();
      branchFileCategoryApiCall();
    }
    branchWiseNetPaidByDateRef.current.prevBranchStorageSettingsErrorAct = branchStorageSettingsErrorAct;
    branchWiseNetPaidByDateRef.current.prevSaveBranchStorageResp = saveFileCategoryResp;
  }, [branchStorageSettingsErrorAct, saveFileCategoryResp]);

  const branchStorageFormik = useFormik({
    initialValues,
    onSubmit: (values) => { },
  });

  const menuOptions = useMemo(
    () => [
      {
        id: 'edit',
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: 'Edit',
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");

          addFileCategoryOpenModal(id);
        },
      }
    ],
    [getFileCategoryListResp],
  );

  useEffect(() => {
    if (instituteId) {
      branchFileCategoryApiCall();
    }
  }, [instituteId, branchStorageFormik.values.branchId, branchStorageFormik.values.searchString]);

  useEffect(() => {
    if (instituteId) {
      dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, {
        pageSize: 100, pageNo: 0, instituteId,
      })));
    }

  }, [instituteId]);

  const tableColumns = useMemo(() => generateColumns(menuOptions), [getFileCategoryListResp]);

  return (
    <>
      <div className="tw-card">
        <div className="tw-card-header">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 lg:tw-grid-cols-12 tw-gap-3">
            <div className="lg:tw-col-span-8 tw-flex tw-items-center">
              <h4 className="tw-card-title tw-flex tw-items-center">File Category</h4>
            </div>
            <div className="lg:tw-col-span-4 lg:tw-justify-self-end">
              <div className="tw-flex tw-gap-2">
                <Button variant="primary" className="!tw-whitespace-nowrap"
                  type="button" onClick={() => addFileCategoryOpenModal()}>
                  <i className="ri-add-line" /> Add Category
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-card-body">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3  lg:tw-grid-cols-12 tw-gap-3 tw-mb-4">
            <div className="lg:tw-col-span-5">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  placeHolder="Search..."
                  value={branchStorageFormik.values.searchString}
                  onChange={branchStorageFormik.handleChange}
                  formgroupClassName="mb-0"
                  labelText="Search"
                  floatingLabel
                ></TextInput>
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
          <div>
            <TableContainer
              columns={tableColumns}
              data={Array.isArray(getFileCategoryListResp) ? getFileCategoryListResp : []}
              divClass="tw-border tw-rounded-lg tw-shadow tw-overflow-hidden tw-pb-4"
              theadClass="tw-bg-[#F9FAFB]"
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="addEditOpenModal"
        isOpen={branchFileCategoryModalState.showModal}
        toggle={closeFileCategoryModal}
        modalTitle={
          branchFileCategoryModalState.modalData ? 'Edit File Category' : 'Add File Category'
        }
        modalSize="md"
      >
        <AddEditOpenModal
          toggle={() => closeFileCategoryModal()}
          id={branchFileCategoryModalState.modalData}
          isOpen={false}
          getFileCategoryListResp={getFileCategoryListResp}
          modalTitle="Create Detail" />
      </ModalContainerUpdated>
    </>
  );
};

export default FileCategory;
