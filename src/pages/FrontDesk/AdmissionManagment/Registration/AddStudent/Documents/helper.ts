export const documentList = [{
    id: "bonafide_certificate",
    name: "Bonafide Certificate",
}];

export const percentageList = [
    {
        id: "90 And Above",
        name: "90 And Above"
    },
    {
        id: "80 to 90%",
        name: "80-90%"
    },
    {
        id: "70 to 80",
        name: "70-80%"
    },
    {
        id: "60 to 70",
        name: "60-70%"
    },
    {
        id: "50 to 60",
        name: "50-60%"
    },
    {
        id: "50 And Below",
        name: "50 And Below"
    }
]

export const acceptedImageFile = ['application/pdf'];

export function uploadFileErrorHndlr(fileType: string) {
    if (fileType && !acceptedImageFile.includes(fileType)) {
        return `Upload file should be of format ${acceptedImageFile.join(',')}.`;
    }
    // if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 1)) {
    //     return "Upload file should be less than 1MB.";
    // }
    return "";
}

export function validateDimension(height: number, width: number) {
    if (height > 230 || width > 200) {
        return `Max dimension for uploading photo should be 200 x 230 size.`;
    }
    return "";
}

