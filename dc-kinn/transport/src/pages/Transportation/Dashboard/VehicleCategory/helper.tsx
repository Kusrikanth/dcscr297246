export type IMenuOptionsId = "dunut" | "table";

interface IMenuOptions {
  id: IMenuOptionsId;
  labelName: string;
  customPadding: string;
}

export const MenuOptions: Array<IMenuOptions> = [
  {
    id: "dunut",
    labelName: "Chart",
    customPadding: "0px",
  },
  {
    id: "table",
    labelName: "Table",
    customPadding: "0px",
  },
];
