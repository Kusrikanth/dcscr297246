import { useFormik } from 'formik';
import {
  ModalContainerUpdated,
  SelectInput,
  StatusLabel,
  TextInput,
} from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import { useModal } from '../../../../../hooks/modalhook';
import AuditLogsModal from './AuditLogsModal';
import { auditLogs, priorityStyleMap } from './helper';

const initialValues = {
  searchString: '',
  severity: '',
  actor: '',
  branch: '',
};

const AuditLogs = () => {
  const {
    openModal: auditLogsOpenModal,
    closeModal: auditLogsCloseModal,
    modalState: auditLogsModalState,
  } = useModal();

  const auditLogsFromik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  return (
    <>
      <div className="tw-card">
        <div className="tw-card-header tw-flex tw-justify-between tw-items-center">
          <h4 className="tw-card-title">Audit Logs</h4>
          <div className="tw-flex tw-gap-2">
            <Button variant="secondary">Export</Button>
            <Button variant="primary">Add Branch</Button>
          </div>
        </div>
        <div className="tw-card-body">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3  lg:tw-grid-cols-12 tw-gap-3 tw-mb-4">
            <div className="lg:tw-col-span-4">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  placeHolder="Search..."
                  value={auditLogsFromik.values.searchString}
                  onChange={auditLogsFromik.handleChange}
                  formgroupClassName="tw-mb-0"
                  labelText="Search"
                  floatingLabel
                ></TextInput>
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
            <div className="lg:tw-col-span-2">
              <SelectInput
                name="severity"
                labelText="Severity"
                floatingLabel
                menuItems={[]}
                valueKey="id"
                textKey="label"
                onChange={auditLogsFromik.values.severity}
                formgroupClassName="tw-mb-0"
              ></SelectInput>
            </div>
            <div className="lg:tw-col-span-2">
              <SelectInput
                name="actor"
                labelText="Actor"
                floatingLabel
                menuItems={[]}
                valueKey="id"
                textKey="label"
                onChange={auditLogsFromik.values.actor}
                formgroupClassName="tw-mb-0"
              ></SelectInput>
            </div>
            <div className="lg:tw-col-span-2">
              <SelectInput
                name="branch"
                labelText="Branch"
                floatingLabel
                menuItems={[]}
                valueKey="id"
                textKey="label"
                onChange={auditLogsFromik.values.branch}
                formgroupClassName="tw-mb-0"
              ></SelectInput>
            </div>
          </div>
          {auditLogs.map((log) => (
            <div className="tw-card" key={log.id}>
              <div className={`tw-card-body tw-p-4`}>
                <div className="tw-flex tw-items-center tw-justify-between">
                  <div>
                    <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                      <span
                        className={`${priorityStyleMap[log.priority.toLowerCase()].textColor} ${priorityStyleMap[log.priority.toLowerCase()].bgColor} tw-text-xs tw-px-2 tw-py-1 tw-rounded`}
                      >
                        {log.priority}
                      </span>
                      <span className="tw-text-gray-900 tw-font-medium">
                        {log.action}
                      </span>
                    </div>
                    <ul className="tw-tw-mb-0 tw-text-zinc-400 tw-text-xs tw-flex tw-gap-x-2 tw-ps-0 tw-list-none tw-items-center">
                      <li>{log.time}</li>
                      <li className="before:tw-content-[''] before:tw-inline-block before:tw-w-1 before:tw-h-1 before:tw-rounded-full before:tw-bg-zinc-400 before:tw-mr-1 before:tw-align-middle">
                        by {log.performedBy}
                      </li>
                      <li className="before:tw-content-[''] before:tw-inline-block before:tw-w-1 before:tw-h-1 before:tw-rounded-full before:tw-bg-zinc-400 before:tw-mr-1 before:tw-align-middle">
                        Branch: {log.branch}
                      </li>
                      <li className="before:tw-content-[''] before:tw-inline-block before:tw-w-1 before:tw-h-1 before:tw-rounded-full before:tw-bg-zinc-400 before:tw-mr-1 before:tw-align-middle">
                        IP: {log.ip}
                      </li>
                    </ul>
                  </div>
                  <div onClick={() => auditLogsOpenModal(log.id)}>
                    <button className="tw-flex tw-gap-2 tw-items-center">
                      <span
                        className={`tw-h-3 tw-w-3 tw-inline-block tw-rounded-full ${priorityStyleMap[log.priority.toLowerCase()].dotColor}`}
                      ></span>
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalContainerUpdated
        id="auditLogsModal"
        isOpen={auditLogsModalState.showModal}
        toggle={auditLogsCloseModal}
        modalTitle="Audit Details"
        modalSize="md"
      >
        <AuditLogsModal
          toggle={auditLogsCloseModal}
          selectedItemId={auditLogsModalState.modalData}
        ></AuditLogsModal>
      </ModalContainerUpdated>
    </>
  );
};

export default AuditLogs;
