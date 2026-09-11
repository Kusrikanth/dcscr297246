import { MoreActions, StatusLabel } from '../../../Components/Common';
import { IOptionsHrtl } from '../../../Components/Common/MenuOptions';
import { getMeetingActionOptions, meetingStatusColor } from './helper';
import Pagination, {
  IPaginationState,
} from '../../../Components/Common/Pagination';
import { getDateWithTimeFormat } from '../../../utility/dateutility';
import NoDataComp from '../../../Components/Common/NoDataComp';

interface IMeetingGridItem {
  id: string;
  title?: string;
  description?: string;
  sectionName?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  status?: string;
  createdByName?: string;
}

interface IMeetingGridViewProps {
  data: Array<IMeetingGridItem>;
  menuOptions: Array<IOptionsHrtl>;
  activeTabId: string;
  totalPages: number;
  totalRecords: number;
  callbackPaginationHndlr: (paginationInfo: IPaginationState) => void;
  currentPageNumber: number;
}

function MeetingGridItem({
  item,
  menuOptions,
  activeTabId,
}: {
  item: IMeetingGridItem;
  menuOptions: Array<IOptionsHrtl>;
  activeTabId: string;
}) {
  const {
    id,
    title,
    description,
    sectionName,
    scheduledStart,
    scheduledEnd,
    status,
    createdByName,
  } = item || {};

  const statusType = meetingStatusColor[status?.toLowerCase() || ''];
  const actionOptions = getMeetingActionOptions(
    menuOptions,
    activeTabId,
    status || '',
  );

  const date = scheduledStart?.split('T')?.[0];

  return (
    <div className="tw-card tw-mb-0">
      <div className="tw-card-header tw-flex tw-justify-between">
        <div>
          <h3 className="tw-card-title">{title || '-'}</h3>
        </div>
        <div className="tw-flex tw-items-center tw-shrink-0">
          <MoreActions actionOptions={actionOptions} rowId={id} isHorizontal />
        </div>
      </div>
      <div className="tw-card-body">
        <div className="tw-space-y-3">
          <div className="tw-grid tw-grid-cols-[76px_1fr] tw-gap-2">
            <span className="tw-text-sm tw-text-gray-500">Class/Sec :</span>
            <span className="tw-text-sm tw-font-semibold">
              {sectionName || '-'}
            </span>
          </div>

          <div className="tw-grid tw-grid-cols-[76px_1fr] tw-gap-2">
            <span className="tw-text-sm tw-text-gray-500">Date :</span>
            <span className="tw-text-sm tw-font-semibold">{date || '-'}</span>
          </div>

          <div className="tw-grid tw-grid-cols-[76px_1fr] tw-gap-2">
            <span className="tw-text-sm tw-text-gray-500">Start Time :</span>
            <span className="tw-text-sm tw-font-semibold">
              {getDateWithTimeFormat(scheduledStart) || '-'}
            </span>
          </div>
          <div className="tw-grid tw-grid-cols-[76px_1fr] tw-gap-2">
            <span className="tw-text-sm tw-text-gray-500">End Time :</span>
            <span className="tw-text-sm tw-font-semibold">
              {getDateWithTimeFormat(scheduledEnd) || '-'}
            </span>
          </div>

          <div className="tw-grid tw-grid-cols-[76px_1fr] tw-gap-2">
            <span className="tw-text-sm tw-text-gray-500">Created By :</span>

            <span className="tw-text-sm tw-font-semibold">
              {createdByName || '-'}
            </span>
          </div>
          <div className="tw-grid tw-grid-cols-[76px_1fr] tw-gap-2">
            <span className="tw-text-sm tw-text-gray-500">Status :</span>

            <div>
              <StatusLabel
                labelName={status || ''}
                type={statusType}
              ></StatusLabel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const MeetingGridView = ({
  data,
  menuOptions,
  activeTabId,
  totalPages,
  totalRecords,
  callbackPaginationHndlr,
  currentPageNumber,
}: IMeetingGridViewProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="">
          <div className="tw-grid tw-gap-4 tw-mb-6 tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3 2xl:tw-grid-cols-4">
            {data?.map((item) => (
              <MeetingGridItem
                key={item?.id}
                item={item || {}}
                menuOptions={menuOptions}
                activeTabId={activeTabId}
              ></MeetingGridItem>
            ))}
          </div>

          <div className="tw-flex tw-justify-end">
            <Pagination
              paginationContainerClass="mb-4"
              callbackPaginationHndlr={callbackPaginationHndlr}
              totalPages={totalPages || 0}
              totalRecords={totalRecords || 0}
              currentPageNumber={currentPageNumber}
            />
          </div>
        </div>
      ) : (
        <div className="tw-card">
          <div className="tw-card-body">
            <NoDataComp />
          </div>
        </div>
      )}
    </>
  );
};

export default MeetingGridView;
