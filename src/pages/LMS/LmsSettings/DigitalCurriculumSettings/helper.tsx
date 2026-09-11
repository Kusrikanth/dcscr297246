interface IMenuOptions {
  id: string;
  labelName: string;
}

export const MenuOptions: Array<IMenuOptions> = [
  {
    id: "academic-year-details",
    labelName: "Academic Year Details",
  },
  {
    id: "academic-term-details",
    labelName: "Academic Term Details",
  },
  {
    id: "school-periods",
    labelName: "School Period's",
  },
  {
    id: "school-working-days",
    labelName: "Holidays & Special Days",
  },
  {
    id: "curriculum-validation",
    labelName: "Curriculum Validation",
  },
  {
    id: "curriculum-rules",
    labelName: "Curriculum Levels",
  },
];
