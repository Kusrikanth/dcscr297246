export type IMenuOptionsId = "all" | "academic" | "transport";

interface IMenuOptions {
  id: IMenuOptionsId;
  labelName: string;
  customPadding: string;
}

export const MenuOptions: Array<IMenuOptions> = [
  {
    id: "all",
    labelName: "All",
    customPadding: "0px 0px 0px 0px",
  },
  {
    id: "academic",
    labelName: "Academic",
    customPadding: "0px 0px 0px 0px",
  },
  {
    id: "transport",
    labelName: "Transport",
    customPadding: "0px 0px 0px 0px",
  },
];

export function formatNumber(num: number) {
  if (num < 1000) {
    return num;
  } else if (num < 100000) {
    return (num / 1000).toFixed(2) + "K";
  } else if (num < 10000000) {
    return (num / 100000).toFixed(2) + "L";
  } else {
    return (num / 10000000).toFixed(2) + "Cr";
  }
}

export const colorOptions = ["#0AB39C", "#405189", "#FEB019", "#F06530"];
