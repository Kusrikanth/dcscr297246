export const transformComplaintStatsToCards = (data: any) => {
    return [
        {
            count: data?.openComplaints || 0,
            label: "Open",
            bgColor: "linear-gradient(135deg, #F06548D9, #F27E6AD9)",
            iconBgColor: "linear-gradient(45deg, #F06548D9, #F27E6AD9, #fff)",
        },
        {
            count: data?.inProgressComplaints || 0,
            label: "Inprogress",
            bgColor: "linear-gradient(135deg, #3b82f6, #60a5fa)",
            iconBgColor: "linear-gradient(45deg, #3b82f6, #60a5fa, #fff)",
        },
        {
            count: data?.closedComplaints || 0,
            label: "Closed",
            bgColor: "linear-gradient(135deg, #22c55e, #86efac)",
            iconBgColor: "linear-gradient(45deg, #22c55e, #86efac, #fff)",
        },
        {
            count: data?.onHoldComplaints || 0,
            label: "On Hold",
            bgColor: "linear-gradient(135deg, #8b5cf6, #c4b5fd)",
            iconBgColor: "linear-gradient(45deg, #8b5cf6, #c4b5fd, #fff)",
        },
        {
            count: data?.blockedComplaints || 0,
            label: "Blocked",
            bgColor: "linear-gradient(135deg, #f97316, #fdba74)",
            iconBgColor: "linear-gradient(45deg, #f97316, #fdba74, #fff)",
        },
    ];
};