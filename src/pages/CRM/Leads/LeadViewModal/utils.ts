import { type LeadViewOption } from "./types";

export const optionList = (
    items: string[],
): LeadViewOption[] =>
    items.map(item => ({
        id: item.toLowerCase().replace(/ /g, "-"),
        name: item,
    }));
