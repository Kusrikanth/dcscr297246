import { useFormik } from 'formik';
import {
  ModalContainerUpdated,
  SearchInput,
  SelectInput,
  TextInput,
} from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { useMemo } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete03Icon,
  PencilEdit02Icon,
  PlusSignIcon,
  Settings01Icon,
} from '@hugeicons-pro/core-stroke-standard';
import { useModal } from '../../../../../hooks/modalhook';
import { generateColumns, retentionRulesData } from './helper';
import AddEditRetentionRuleModal from './AddEditRetentionRuleModal';

const initialValues = {
  searchString: '',
  utilization: '',
  short: '',
};

const RetentionArchival = () => {
  const branchStorageFormik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const {
    openModal: addEditOpenRetentaionArchivalModal,
    closeModal: addEditCloseRetentaionArchivalModal,
    modalState: addEditRetentaionArchivalModalState,
  } = useModal();

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
          const id = event.currentTarget.getAttribute('data-id');
          addEditOpenRetentaionArchivalModal(id);
        },
      },
      {
        id: 'delete',
        actionIcon: (
          <HugeiconsIcon
            icon={Delete03Icon}
            className="tw-text-red-500"
            size={18}
          />
        ),
        actionName: 'Settings',
        onClickHndlr: (event: any) => {},
      },
    ],
    [],
  );

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="tw-card">
        <div className="tw-card-header">
          <div className="tw-flex tw-justify-between tw-items-center tw-w-full">
            <h4 className="tw-card-title">Retention Archival</h4>
            <Button
              variant="previous"
              onClick={() => addEditOpenRetentaionArchivalModal()}
              className="tw-flex tw-gap-2 tw-items-center"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={18}></HugeiconsIcon>
              Add Rules
            </Button>
          </div>
        </div>
        <div className="tw-card-body">
          <div>
            <TableContainer
              data={retentionRulesData || []}
              columns={tableColumns}
              divClass="tw-border tw-rounded-lg tw-shadow tw-overflow-hidden table-responsive tw-mb-3"
              theadClass="table-light text-muted align-middle"
            ></TableContainer>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="addEditOpenRetentaionArchivalModal"
        isOpen={addEditRetentaionArchivalModalState.showModal}
        toggle={addEditCloseRetentaionArchivalModal}
        modalTitle={
          addEditRetentaionArchivalModalState.modalData
            ? 'Edit New Rule'
            : 'Add New Rule'
        }
        modalSize="md"
      >
        <AddEditRetentionRuleModal
          toggle={addEditCloseRetentaionArchivalModal}
        ></AddEditRetentionRuleModal>
      </ModalContainerUpdated>
    </>
  );
};

export default RetentionArchival;
