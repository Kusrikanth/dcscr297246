import React from "react";

interface IMenuOptions {
    id: string,
    labelName: string
}
export const MenuOptions: Array<IMenuOptions> = [
    {
        id: "advance-settings",
        labelName: "Advance Settings"
    },
    {
        id: "grades-distribution",
        labelName: "Grades Distribution"
    },
    {
        id: "notifcations",
        labelName: "Notifcations"
    },
    {
        id: "rules",
        labelName: "Rules"
    },
    {
        id: "result-settings",
        labelName: "Result Settings"
    },
]