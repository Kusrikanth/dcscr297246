export const selectData1 = [
  {
    routeNameOption: "option1",
  },
  {
    routeNameOption: "option2",
  },
  {
    routeNameOption: "option3",
  },
];

export const selectData2 = [
  {
    slabOption: "option1",
  },
  {
    slabOption: "option2",
  },
  {
    slabOption: "option3",
  },
];

export const selectData3 = [
  {
    stopNameOption: "option1",
  },
  {
    stopNameOption: "option2",
  },
  {
    stopNameOption: "option3",
  },
];

export const selectData4 = [
  {
    shiftToRouteOption: "option1",
  },
  {
    shiftToRouteOption: "option2",
  },
  {
    shiftToRouteOption: "option3",
  },
];

export function renderOptionsRoute(item: any) {
  return `${item?.routeName || ""}`;
}

export function renderValueRoute(selectedItems: any) {
  return `${selectedItems?.routeName || ""}`;
}
