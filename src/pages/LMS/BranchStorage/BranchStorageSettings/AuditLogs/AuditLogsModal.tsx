import Button from '../../../../../Components/Common/Button';
import { auditLogs, priorityStyleMap } from './helper';

const AuditLogsModal = ({ toggle, selectedItemId }) => {
  const selectedItem = auditLogs.find((item) => item.id === selectedItemId);
  console.log(selectedItem);

  const {
    id,
    priority = '',
    action,
    time,
    performedBy,
    branch,
    ip,
  } = selectedItem || {};

  return (
    <>
      <div className="modal-body">
        <div className="tw-card">
          <div className="tw-card-header">
            <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1">
              <span
                className={`${priorityStyleMap[priority.toLowerCase()].textColor} ${priorityStyleMap[priority.toLowerCase()].bgColor} tw-text-xs tw-px-2 tw-py-1 tw-rounded`}
              >
                {priority}
              </span>
              <span className="tw-text-gray-900 tw-font-medium">{action}</span>
            </div>
            <div className="tw-text-green-500">{time}</div>
          </div>
          <div className="tw-card-body">
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-3">
              <div>
                <p className="tw-mb-0 tw-text-xs tw-text-gray-400">Actor</p>
                <p className="tw-mb-0 tw-font-semibold">{performedBy}</p>
              </div>
              <div>
                <p className="tw-mb-0 tw-text-xs tw-text-gray-400">Branch</p>
                <p className="tw-mb-0 tw-font-semibold">{branch}</p>
              </div>
              <div>
                <p className="tw-mb-0 tw-text-xs tw-text-gray-400">IP</p>
                <p className="tw-mb-0 tw-font-semibold">{ip}</p>
              </div>
              <div>
                <p className="tw-mb-0 tw-text-xs tw-text-gray-400">Event ID</p>
                <p className="tw-mb-0 tw-font-semibold">AUD-001</p>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-card">
          <div className="tw-card-header">
            <div className="">
              <h4 className="tw-card-title">Change Summary</h4>
              <span className="tw-text-gray-400 tw-text-xs">
                Quick view of important fields (no clutter)
              </span>
            </div>
          </div>
          <div className="tw-card-body">
            <div className="tw-space-y-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <p className="tw-mb-0 tw-text-green-500">Before</p>
                <p className="tw-mb-0">80GB</p>
              </div>
              <div className="tw-flex tw-items-center tw-justify-between">
                <p className="tw-mb-0 tw-text-green-500">After</p>
                <p className="tw-mb-0">100GB</p>
              </div>
              <div className="tw-flex tw-items-center tw-justify-between">
                <p className="tw-mb-0 tw-text-green-500">Reason</p>
                <p className="tw-mb-0">High utilization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-border-t tw-px-4 tw-py-3 tw-flex tw-justify-end">
        <Button variant="info">Close</Button>
      </div>
    </>
  );
};

export default AuditLogsModal;
