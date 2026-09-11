export type IMenuOptionsId = "all" | "academic" | "transport"

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

export const colorOptions = [
  "#0AB39C",
  "#405189",
  "#FEB019",
  "#F06530",
]