export const acceptedImageFile = ["image/jpeg", "image/jpg", "image/png"];

export function uploadFileErrorHndlr(fileSize: any, fileType: string) {
    if (!acceptedImageFile.includes(fileType)) {
        return `Upload file should be of format ${acceptedImageFile.join(',')}`;
    }
    if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 1)) {
        return "Upload file should be less than 1Mb.";
    }
    return "";
}

export function validateDimension(height: number, width: number) {
    if (height > 230 || width > 200) {
        return `Max dimension for uploading photo should be 200 x 230 size.`;
    }
    return "";
}

