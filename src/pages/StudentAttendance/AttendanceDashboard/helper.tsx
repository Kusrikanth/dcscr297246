

const borderColors = ["#BCE3FF", "#C4F4E4", "#D8D4FE"];

const getDynamicBorderColor = (index: number): string => borderColors[index % borderColors.length];
export function generateRowData(masterSection:any, mainApiResponse:any) {
        return (masterSection && mainApiResponse)
            ? Object.entries(masterSection).map(([key, label]) => {
                const mainApiData = mainApiResponse[key] || {};

                return {
                    label: label, 
                    absents: mainApiData.ABSENT || 0, 
                    present: mainApiData.PRESENT || 0, 
                    holiday: mainApiData.HOLIDAY || 0, 
                    notMarked: mainApiData.NOT_MARKED || 0,
                    borderColor: getDynamicBorderColor(Number(key))
                };
            })
            : [];
    }