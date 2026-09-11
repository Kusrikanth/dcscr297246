interface TicketStats {
  totalComplaints: number;
  openComplaints: number;
  inProgressComplaints: number;
  closedComplaints: number;
  onHoldComplaints: number;
  blockedComplaints: number;
}

interface TicketsOverviewProps {
  stats: TicketStats;
}

const TicketsOverview = ({ stats }: TicketsOverviewProps) => {
  // Calculate percentages
  const total = stats?.totalComplaints || 0;
  const openPercentage = total > 0 ? ((stats.openComplaints / total) * 100).toFixed(2) : 0;
  const inProgressPercentage = total > 0 ? ((stats.inProgressComplaints / total) * 100).toFixed(2) : 0;
  const closedPercentage = total > 0 ? ((stats.closedComplaints / total) * 100).toFixed(2) : 0;
  const onHoldPercentage = total > 0 ?((stats.onHoldComplaints / total) * 100).toFixed(2) : 0;
  const blockedPercentage = total > 0 ? ((stats.blockedComplaints / total) * 100).toFixed(2) : 0;

  // Calculate widths for progress bar (ensure they add up to 100%)
  const openWidth = openPercentage;
  const inProgressWidth = inProgressPercentage;
  const closedWidth = closedPercentage;
  const onHoldWidth = onHoldPercentage;
  const blockedWidth = blockedPercentage;

  return (
    <div className="">
      <div className="!tw-flex !tw-justify-between !tw-mb-4">
        <p className="!tw-text-gray-500 !tw-mb-0">Total Tickets</p>
        <h4 className="!tw-font-semibold !tw-mb-0">{total}</h4>
      </div>
      
      {/* Progress Bar */}
      <div
        className="!tw-rounded !tw-overflow-hidden !tw-flex !tw-mb-4"
        style={{ height: "26px" }}
      >
        {+openWidth > 0 && (
          <div 
            className="!tw-bg-red-500 !tw-h-full" 
            style={{ width: `${openWidth}%` }}
          ></div>
        )}
        {+inProgressWidth > 0 && (
          <div 
            className="!tw-bg-yellow-500 !tw-h-full" 
            style={{ width: `${inProgressWidth}%` }}
          ></div>
        )}
        {+closedWidth > 0 && (
          <div 
            className="!tw-bg-green-500 !tw-h-full" 
            style={{ width: `${closedWidth}%` }}
          ></div>
        )}
        {+onHoldWidth > 0 && (
          <div
            className="!tw-bg-[#8b5cf6] !tw-h-full"
            style={{ width: `${onHoldWidth}%` }}
          ></div>
        )}
        {+blockedWidth > 0 && (
          <div 
            className="!tw-bg-cyan-500 !tw-h-full" 
            style={{ width: `${blockedWidth}%` }}
          ></div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="!tw-flex !tw-flex-wrap !tw-border !tw-border-gray-200 !tw-w-full !tw-mx-auto !tw-rounded !tw-mb-3">
        <div className="!tw-w-1/2 !tw-p-3 !tw-border-b !tw-border-r !tw-border-gray-200">
          <p className="!tw-mb-0 !tw-flex !tw-items-center">
            <span
              className="!tw-bg-red-500 !tw-me-2"
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "2px",
                display: "inline-block",
              }}
            ></span>
            <span className="!tw-me-2">Open</span>
            <span className="!tw-font-semibold">({openPercentage}%)</span>
          </p>
          <p className="!tw-mb-0 !tw-font-semibold !tw-text-[18px]">{stats?.openComplaints || 0}</p>
        </div>
        <div className="!tw-w-1/2 !tw-p-3 !tw-text-right !tw-border-b !tw-border-gray-200">
          <p className="!tw-mb-0 !tw-flex !tw-items-center !tw-justify-end">
            <span
              className="!tw-bg-yellow-500 !tw-me-2"
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "2px",
                display: "inline-block",
              }}
            ></span>
            <span className="!tw-me-2">In Progress</span>
            <span className="!tw-font-semibold">({inProgressPercentage}%)</span>
          </p>
          <p className="!tw-mb-0 !tw-font-semibold !tw-text-[18px]">{stats?.inProgressComplaints || 0}</p>
        </div>
        <div className="!tw-w-1/2 !tw-p-3 !tw-border-r !tw-border-b !tw-border-gray-200">
          <p className="!tw-mb-0 !tw-flex !tw-items-center">
            <span
              className="!tw-bg-green-500 !tw-me-2"
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "2px",
                display: "inline-block",
              }}
            ></span>
            <span className="!tw-me-2">Closed</span>
            <span className="!tw-font-semibold">({closedPercentage}%)</span>
          </p>
          <p className="!tw-mb-0 !tw-font-semibold !tw-text-[18px]">{stats?.closedComplaints || 0}</p>
        </div>
        <div className="!tw-w-1/2 !tw-p-3 !tw-text-right !tw-border-b !tw-border-gray-200">
          <p className="!tw-mb-0 !tw-flex !tw-items-center !tw-justify-end">
            <span
              className="!tw-bg-[#8b5cf6] !tw-me-2"
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "2px",
                display: "inline-block",
              }}
            ></span>
            <span className="!tw-me-2">On Hold</span>
            <span className="!tw-font-semibold">({onHoldPercentage}%)</span>
          </p>
          <p className="!tw-mb-0 !tw-font-semibold !tw-text-[18px]">{stats?.onHoldComplaints || 0}</p>
        </div>
      { +blockedPercentage > 0 && (
        <div className="!tw-flex !tw-flex-wrap !tw-w-full !tw-mx-auto ">
          <div className="!tw-w-full !tw-p-3 !tw-text-center">
            <p className="!tw-mb-0 !tw-flex !tw-items-center !tw-justify-center">
              <span
                className="!tw-bg-cyan-500 !tw-me-2"
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "2px",
                  display: "inline-block",
                }}
              ></span>
              <span className="!tw-me-2">Blocked</span>
              <span className="!tw-font-semibold">({blockedPercentage}%)</span>
            </p>
            <p className="!tw-mb-0 !tw-font-semibold !tw-text-[18px]">{stats?.blockedComplaints || 0}</p>
          </div>
        </div>
      )}
      </div>
      
      {/* Show Blocked tickets if they exist */}
    </div>
  );
};

export default TicketsOverview;