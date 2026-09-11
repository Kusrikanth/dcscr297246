import { useFormik } from 'formik';
import { useEffect, useMemo, useRef } from 'react';
import { generateColumns } from './helper';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon, Settings01Icon } from '@hugeicons-pro/core-stroke-standard';
import AddEditOpenModal from './AddEditOpenModal';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../../../../hooks/modalhook';
import { ModalContainerUpdated, SelectInput, TextInput } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getInstBranchesAct } from '../../../../../store/mastersettings/branch/branchactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getBranchStorageAct, getBranchStorageByIdAct } from '../../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions';
import { toast } from 'react-toastify';

const initialValues = {
  searchString: '',
  branchId: '',
};

const BranchStorage = () => {

  const dispatch = useAppDispatch();
  const history = useHistory();
  const { openModal: addEditOpenModal, closeModal: closeBranchStorageModal, modalState: branchStorageModalState } = useModal();

  const branchStorageApiCall = () => {
    dispatch(
      getBranchStorageAct(
        generateActionPayload(
          "get_branch_storage",
          undefined,
          {
            instituteId,
            branchId: branchStorageFormik.values.branchId,
            searchString: branchStorageFormik.values.searchString,
          }
        )
      )
    );
  };

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    branchListResp,
    getBranchStorageList,
    saveBranchStorageResp,
    updateBranchStorageResp,
    branchStorageSettingsErrorAct,
  } =
    useAppSelector(({ appData, globalData, instituteInfo, branch, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      getBranchStorageList: branchStorageSettings.getBranchStorageList,
      saveBranchStorageResp: branchStorageSettings.saveBranchStorageResp,
      updateBranchStorageResp: branchStorageSettings.updateBranchStorageResp,
      branchStorageSettingsErrorAct: branchStorageSettings.branchStorageSettingsErrorAct,
    }), shallowEqual);

  const branchWiseNetPaidByDateRef = useRef({
    prevBranchStorageSettingsErrorAct: branchStorageSettingsErrorAct,
    prevSaveBranchStorageResp: saveBranchStorageResp,
    prevUpdateBranchStorageResp: updateBranchStorageResp,
  });

  useEffect(() => {
    const { prevBranchStorageSettingsErrorAct, prevSaveBranchStorageResp, prevUpdateBranchStorageResp } =
      branchWiseNetPaidByDateRef.current;
    if (branchStorageSettingsErrorAct && branchStorageSettingsErrorAct !== prevBranchStorageSettingsErrorAct) {
      const { details, ERROR } = branchStorageSettingsErrorAct || {}
      toast.error(ERROR || details || "Something went wrong");
    } else if (saveBranchStorageResp && prevSaveBranchStorageResp !== saveBranchStorageResp) {
      toast.success("Branch Storage saved successfully.");
      closeBranchStorageModal();
      branchStorageApiCall();
    } else if (updateBranchStorageResp && prevUpdateBranchStorageResp !== updateBranchStorageResp) {
      toast.success("Branch Storage updated successfully.");
      closeBranchStorageModal();
      branchStorageApiCall();
    }
    branchWiseNetPaidByDateRef.current.prevBranchStorageSettingsErrorAct = branchStorageSettingsErrorAct;
    branchWiseNetPaidByDateRef.current.prevSaveBranchStorageResp = saveBranchStorageResp;
    branchWiseNetPaidByDateRef.current.prevUpdateBranchStorageResp = updateBranchStorageResp;
  }, [branchStorageSettingsErrorAct, saveBranchStorageResp, updateBranchStorageResp]);

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
          dispatch(
            getBranchStorageByIdAct(
              generateActionPayload('get_branch_storage_by_id', {
                id: id
              })
            )
          )
          addEditOpenModal(id);
        },
      }
    ],
    [getBranchStorageList],
  );

  useEffect(() => {
    if (instituteId) {
      branchStorageApiCall();
    }
  }, [instituteId, branchStorageFormik.values.branchId, branchStorageFormik.values.searchString]);

  useEffect(() => {
    if (instituteId) {
      dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, {
        pageSize: 100, pageNo: 0, instituteId,
      })));
    }

  }, [instituteId]);

  const tableColumns = useMemo(() => generateColumns(menuOptions), [getBranchStorageList]);

  return (
    <>
      <div className="tw-card">
        <div className="tw-card-header">
          
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 lg:tw-grid-cols-12 tw-gap-3">
            <div className="lg:tw-col-span-8 tw-flex tw-items-center">
              <h4 className="tw-card-title tw-flex tw-items-center">Branch Storage</h4>
            </div>
            <div className="lg:tw-col-span-4 lg:tw-justify-self-end">
              <div className="tw-flex tw-gap-2">
                {/* <Button
                  variant="info"
                  type="button"><i className="ri-add-line" />
                  <span>Export</span></Button> */}
                <Button variant="primary" className="!tw-whitespace-nowrap"
                  type="button" onClick={() => addEditOpenModal()}>
                  <i className="ri-add-line" /> Add Branch
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
            <div className="lg:tw-col-span-3">
              <SelectInput
                name="branchId"
                menuItems={branchListResp?.data}
                valueKey="branchId"
                textKey="branchName"
                value={branchStorageFormik.values.branchId}
                onChange={branchStorageFormik.handleChange}
                formgroupClassName="mb-0"
                labelText="Branch"
                floatingLabel
              />
            </div>
          </div>
          <div>
            <TableContainer
              columns={tableColumns}
              data={Array.isArray(getBranchStorageList?.data) ? getBranchStorageList.data : []}
              divClass="tw-border tw-rounded-lg tw-shadow tw-overflow-hidden tw-pb-4"
              theadClass="tw-bg-[#F9FAFB]"
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="addEditOpenModal"
        isOpen={branchStorageModalState.showModal}
        toggle={closeBranchStorageModal}
        modalTitle={
          branchStorageModalState.modalData ? 'Edit Branch Storage' : 'Add Branch Storage'
        }
        modalSize="md"
      >
        <AddEditOpenModal
          toggle={() => closeBranchStorageModal()}
          id={branchStorageModalState.modalData}
          isOpen={false}
          modalTitle="Create Detail" />
      </ModalContainerUpdated>
    </>
  );
};

export default BranchStorage;
