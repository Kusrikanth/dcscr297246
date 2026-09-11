import type { CalculatedField } from "../helper";
import { makeGroup } from "./conditionhelper";

export const emptyCalculatedField = (): CalculatedField => ({
    id: "",
    name: "",
    formula: "",
    formulaMode: "auto",
    calculationType: "row",
    outputType: "Number",
    conditions: makeGroup("AND"),
    aggregationFunction: "",
    aggregationField: "",
});
