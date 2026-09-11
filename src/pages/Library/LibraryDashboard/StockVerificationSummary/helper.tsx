export const menuData = [
  {
    id: "MIDDLE SCHOOL LIBRARY",
    name: "MIDDLE SCHOOL LIBRARY",
  },
  {
    id: "JUNIOR LIBRARY",
    name: "JUNIOR LIBRARY",
  },
  {
    id: "PRE PRIMARY LIBRARY",
    name: "PRE PRIMARY LIBRARY",
  },
  {
    id: "CAIE LIBRARY",
    name: "CAIE LIBRARY",
  },
];
export const libraryDataToRowData = (libraryData: any[]) => {
  const borderColors = ["#BCE3FF", "#C4F4E4", "#D8D4FE"]; 

  return libraryData?.map((item, index) => ({
    roomName: item.roomName || "N/A",
    rackName: item.rackName || "N/A",
    shelfName: item.shelfName || "N/A",
    libraryName: item.libraryName || "N/A",
    roomId: item.roomId || 0,
    rackId: item.rackId || 0,
    shelfId: item.shelfId || 0,
    libraryId: item.libraryId || 0,
    roomNo: item.roomNo || "N/A",
    numberOfTotalBooks: item.numberOfTotalBooks || 0,
    numberOfVerifiedBooks: item.numberOfVerifiedBooks || 0,
    borderColor: borderColors[index % borderColors.length], 
  }));
};