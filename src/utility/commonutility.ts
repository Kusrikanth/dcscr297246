import { formatDuration, intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";

export function getUserImgIcon(titleName: string | undefined): string {
    const titleNameArr = (titleName && titleName.split(/\s/)) || "";
    let suggestedTitleName = "";
    if (Array.isArray(titleNameArr) && titleNameArr.length > 0) {
        for (let i = 0; i < titleNameArr.length && i < 3; i++) {
            suggestedTitleName += titleNameArr[i].substring(0, 1).toUpperCase();
        }
        return suggestedTitleName;
    } else {
        return "";
    }
}

export function generateUniqueNumber(): string {
    return new Date().getTime().toString();
}

export function getSuggestionMail(userMail: string | undefined | null) {
    if (!userMail) {
        return "********@gmail.com";
    }
    const [userName, mailDomain] = userMail.split("@"),
        userNameLength = userName.length;
    let appendSpecial = "", suggestEmail = "";
    for (let i = 0; i < userNameLength - 4; i++) {
        appendSpecial += "*";
    }
    suggestEmail = `${userName.substring(0, 2)}${appendSpecial}${userName.substring(userNameLength - 2)}`
    return `${suggestEmail}@${mailDomain}`;
}

export function exportCsvFile(fileName: any, csvData: any) {
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
    hiddenElement.target = '_blank';
    hiddenElement.download = `${fileName}.csv`;
    hiddenElement.click();
}

const acceptedImageFile = ["image/jpeg", "image/jpg", "image/png"];
export function uploadImageFileErrorHndlr(fileSize: any, fileType?: any) {
    if (!acceptedImageFile.includes(fileType)) {
        return "Upload file should be of format .jpg, .png and .jpeg";
    }
    if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 1)) {
        return "Upload file should be less than 1mb.";
    }
    return "";
}
export function uploadFileErrorHndlr(fileSize: any, fileType: string, validFileFormaters: Array<string>) {
    if (!validFileFormaters.includes(fileType)) {
        return `Upload file should be of format ${validFileFormaters.join(',')}`;
    }
    if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 1)) {
        return "Upload file should be less than 1mb.";
    }
    return "";
}
export function uploadFile2mbErrorHndlr(fileSize: any, fileType: string, validFileFormaters: Array<string>) {
    if (!validFileFormaters.includes(fileType)) {
        return `Upload file should be of format ${validFileFormaters.join(',')}`;
    }
    if (!isNaN(fileSize) && (Math.ceil(fileSize / (2 * 1024 * 1024)) > 1)) {
        return "Upload file should be less than 2mb.";
    }
    return "";
}


export function getSortingKeys(sortingKeys: any, isUpperCase?: boolean) {
    if (Array.isArray(sortingKeys) && sortingKeys.length > 0) {
        const { id, desc } = sortingKeys[0];
        const sortKey = (id && isUpperCase) ? id.toUpperCase() : id;
        return { sortBy: sortKey, orderBy: desc ? "desc" : "asc" };
    }
    return undefined;
}

export function getSortingKeysLower(sortingKeys: any, isUpperCase?: boolean) {
    if (Array.isArray(sortingKeys) && sortingKeys.length > 0) {
        const { id, desc } = sortingKeys[0];
        const sortKey = (id && isUpperCase) ? id : id;
        return { sortBy: sortKey, orderBy: desc ? "desc" : "asc" };
    }
    return undefined;
}

export function generateRandomPassword() {
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i <= 8; i++) {
        var char = Math.floor(Math.random()
            * str.length + 1);
        pass += str.charAt(char)
    }

    return pass;
}

export function getBrowserName() {
    const agent: any = window.navigator.userAgent.toLowerCase();
    switch (true) {
        case agent.indexOf("edge") > -1: return "MS Edge";
        case agent.indexOf("edg/") > -1: return "Edge ( chromium based)";
        // @ts-ignore
        case agent.indexOf("opr") > -1 && !!window.opr: return "Opera";
        // @ts-ignore
        case agent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";
        case agent.indexOf("trident") > -1: return "MS IE";
        case agent.indexOf("firefox") > -1: return "Mozilla Firefox";
        case agent.indexOf("safari") > -1: return "Safari";
        default: return "other";
    }
}


export function searhWithTextInList(listDetails: Array<any>, searchKeys: any, searchTerm: string) {
    if (Array.isArray(listDetails) && Array.isArray(searchKeys)) {
        return listDetails.filter(listInfo => {
            if (searchKeys.some(key => listInfo[key] && listInfo[key].toLowerCase().includes(searchTerm.toLowerCase()))) {
                return listInfo;
            }
        });
    } else if (Array.isArray(listDetails)) {
        return listDetails.filter(listInfo => listInfo[searchKeys] && listInfo[searchKeys].toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
        return [];
    }
}


export const debounce = (fn: any, delay: any) => {
    let timerId: any;
    return (...args: any) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn(...args), delay);
    }
};

export const percentageConverter = (amount: any, mode: any, value: any) => {
    if (mode && mode.toUpperCase() === "AMOUNT") {
        if (value && amount) {
            return ((+value / +amount) * 100);
        }
        else {
            return 0;
        }
    }
    else {
        return value || 0;
    }
}
export const valueConverter = (amount: any, mode: any, value: any) => {
    if (mode && mode.toUpperCase() === "PERCENTAGE") {

        if (value && amount) {
            return ((amount * value) / 100);
        }
        return "";
    }
    else {
        return value || "";
    }
}

export function getAmountValueWithDecimal(value: any) {
    if (!isNaN(value)) {
        return Number(value).toFixed(2);
    }
    return Number(0).toFixed(2);
}


export function getDisplayAmountValue(value: any) {
    if (!isNaN(value)) {
        const demicalNum = Number(value).toFixed(2);
        let convertedNum = demicalNum.split(".");
        return convertedNum[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") + "." + convertedNum[1];
    }
    return Number(0).toFixed(2);
}


export function getFeeAmountDisplayValue(amount: number) {
    if (!isNaN(amount)) {
        if (amount >= 1e7) {
            let crores = amount / 1e7;
            return `${getDisplayAmountValue(crores)}Cr`;
        } else if (amount >= 1e5) {
            let lakhs = amount / 1e5;
            return `${getDisplayAmountValue(lakhs)}L`;
        } else if (amount >= 1e3) {
            let thousands = amount / 1e3;
            return `${getDisplayAmountValue(thousands)}K`;
        } else {
            return `${getDisplayAmountValue(amount)}`;
        }
    }
    return Number(0).toFixed(2);
}

export function sanitizeUrlParams(inputParams: any) {
    if (!inputParams) {
        return {};
    }
    return Object.keys(inputParams).reduce((updatedParams: any, key: any) => {
        if (inputParams[key] !== null && inputParams[key] !== undefined && inputParams[key] !== "") {
            updatedParams[key] = inputParams[key];
        }
        return updatedParams
    }, {})
}

export function getValidMobileNumber(phoneInput: any) {
    if (!phoneInput) {
        return "";
    }
    if (phoneInput.length > 10) {
        return phoneInput.substring();
    } else {
        return phoneInput;
    }
}

export function generateBreadcrumb(pathName: string) {
    if (!pathName) {
        return "";
    }
    const breadCrumbList: any = [], pathKeys: Array<any> = pathName.split("/");
    for (let i = 0; i <= pathKeys.length; i++) {
        if (pathKeys[i] && isNaN(pathKeys[i])) {
            let generatedPathKeys = "";
            for (let j = 0; j < i; j++) {
                if (pathKeys[j]) {
                    generatedPathKeys += `${pathKeys[j]}/`;
                }
            }
            breadCrumbList.push({
                linkUrl: `${generatedPathKeys}${pathKeys[i]}`,
                name: pathKeys[i].replace(/-/g, " ")
            })
        }
    }
    return breadCrumbList;
}

// export function printDocumentHandler(innerHtml: string) {
//     if (!innerHtml) {
//         return;
//     }
//     const printContents = innerHtml;
//     const printWindow = window.open('', '_blank', 'width=600,height=600') as Window;
//     printWindow.document.open();
//     printWindow.document.write(`
//           <html>
//             <head>
//               <title>Print</title>
//             </head>
//             <body>
//               ${printContents}
//             </body>
//           </html>
//         `);
//     printWindow.document.close();
//     printWindow.onload = () => {
//         printWindow.print();
//         printWindow.close();
//     }
// }

export function printDocumentHandler(innerHtml: string) {
    if (!innerHtml) {
        return;
    }
    const printContents = innerHtml;
    const printWindow = window.open('', '_blank', 'width=795,height=795') as Window;
    printWindow.document.open();
    printWindow.document.write(`
        <html>
            <head>
                <title>Print</title>
            </head>
            <body>
            <center>
              ${printContents}
              </center>
            </body>
        </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 100);
    };
}


export function parseQueryStringToObject(queryString: any) {
    const params: any = new URLSearchParams(queryString);
    const queryParams: any = {};

    for (const [key, value] of params.entries()) {
        queryParams[key] = value;
    }

    return queryParams;
}

export function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}

export function downloadExcelFile(blobStream: any, fileName: string) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export function csvExportHndlr(data: any, fileName: string, fileType: 'csv' | 'xlsx' = 'csv') {
    const mimeTypes = {
        csv: 'text/csv;charset=utf-8;',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    const blob = new Blob([data], { type: mimeTypes[fileType] });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute('download', `${fileName}.${fileType}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
}


export function removeLeadingZeros(input: string) {
    return parseInt(input, 10).toString();
}

export function formatText(type: string) {
    return type
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function formatNumber(num: number = 0) {
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

export function downloadBase64ToPdf(base64: any, fileName: any) {
    const link = document.createElement("a");
    link.href = `data:${"application/pdf"};base64,${base64}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function useCountdown(
    startDateTime?: string | null,
    endDateTime?: string | null,
    status?: string
) {
    const [timeLeft, setTimeLeft] = useState<string>("N/A");
    const [label, setLabel] = useState<string>("");

    useEffect(() => {
        if (!startDateTime || !endDateTime || status === "DRAFT") {
            setTimeLeft("N/A");
            setLabel("");
            return;
        }
        const start = new Date(
            startDateTime.endsWith("Z") ? startDateTime : `${startDateTime}Z`
        ).getTime();

        const end = new Date(
            endDateTime.endsWith("Z") ? endDateTime : `${endDateTime}Z`
        ).getTime();
        const format = (diff: number) => {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            return `${String(days).padStart(2, "0")} Days : ${String(
                hours
            ).padStart(2, "0")} Hours : ${String(minutes).padStart(
                2,
                "0"
            )} Minutes : ${String(seconds).padStart(2, "0")} Seconds`;
        };
        const updateTimer = () => {
            const nowUTC = Date.now();
            if (nowUTC < start) {
                const diff = start - nowUTC;
                setLabel("Starts in");
                setTimeLeft(format(diff));
            } else if (nowUTC > end) {
                setLabel("");
                setTimeLeft("Expired");
            } else {
                const diff = end - nowUTC;
                setLabel("Ends in");
                setTimeLeft(format(diff));
            }
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [startDateTime, endDateTime, status]);

    return { label, timeLeft };
}

export function useOneMinuteCountdown(start: boolean, initialSeconds: number = 60) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    useEffect(() => {
        if (!start) return;

        setTimeLeft(initialSeconds); // reset whenever start changes
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [start, initialSeconds]);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(1, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    return { timeLeft, formatted: `${minutes}:${seconds}` };
}

export function formatMinutesToDuration(minutes: number) {
    const duration = intervalToDuration({
        start: 0,
        end: minutes * 60 * 1000,
    });
    return formatDuration(duration);
}

export function enableCCAvenueHandler(instituteCode?: string, branchId?: string) {
    if (!instituteCode || !branchId || instituteCode !== "DPS") {
        return false;
    }
    if (instituteCode === "DPS") {
        return branchId !== "5"
    }
}

export function checkExamTime(
    startTimeUtc?: string | null,
    endTimeUtc?: string | null,
    gracePeriod: number = 0
): "before" | "within" | "after" {
    const now = new Date().getTime();
    let start = startTimeUtc ? new Date(startTimeUtc).getTime() : null;
    let end = endTimeUtc ? new Date(endTimeUtc).getTime() : null;
    if (end) {
        end += gracePeriod * 60 * 1000;
    }
    if (start && now < start) {
        return "before";
    }
    if (end && now > end) {
        return "after";
    }
    return "within";
}

export function toPascalCase(input?: string) {
    if (!input) return '';
    return input
        .toString()
        .split(/[\s/]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
};
