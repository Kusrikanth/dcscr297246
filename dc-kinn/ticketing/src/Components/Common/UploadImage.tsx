import { useMemo, useState } from "react";
import { Input, Label } from "reactstrap";
//Images
import DPSLogoSM from "../../assets/imagesdps/mastersetup/dps_logo.png";
import DefaultUserImg from "../../assets/imagesdps/default-upload-img.png";

interface IUploadImage {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    formgroupClassName?: (string | undefined),
    // labelText?: string,
    inputClassName?: string,
    acceptFileFormat: string,
    value?: any,
    onChange?: any,
    invalid?: boolean,
    error?: any,
    isDisabled?: boolean,
}
export const UploadImage: React.FC<IUploadImage> = (props) => {
    return (<div className="tw-inline">
        <div className="tw-relative tw-inline-block">
            <div className="tw-absolute tw-bottom-0 tw-end-0">
                <Label htmlFor={props.name} className="tw-mb-0">
                    <div className="avatar-xs tw-cursor-pointer">
                        <div className="avatar-title !tw-bg-gray-200 tw-border tw-rounded-full !tw-text-gray-500">
                            <i className="ri-image-edit-line"></i>
                        </div>
                    </div>
                </Label>
                <Input name="img" className="form-control d-none" id={props.name} type="file"
                    accept={props.acceptFileFormat}
                    onChange={props.onChange}
                    invalid={props.invalid}
                    disabled={props.isDisabled}
                />
            </div>
            <div className="avatar-lg tw-p-1">
                <div className="avatar-title !tw-bg-gray-200 !tw-rounded-full">
                    <img src={props.value || DPSLogoSM} alt="multiUser" id="companylogo-img" className="avatar-md !tw-rounded-full !tw-object-cover" />
                </div>
            </div>
        </div>
        {props.error && <p className="!tw-text-red-500 !tw-absolute">{props.error}</p>}
    </div>

    )
}



interface IUploadImageUpdated {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    formgroupClassName?: (string | undefined),
    // labelText?: string,
    inputClassName?: string,
    acceptFileFormat: string,
    value?: any,
    onChange?: any,
    invalid?: boolean,
    error?: any,
    isDisabled?: boolean,
    defaultUserType?: string,
    hideHelperText?: boolean,
}
export const UploadImageUpdated: React.FC<IUploadImageUpdated> = (props) => {
    // const [fileErrorState, setFileErrorState] = useState({
    //     errorMessage: ""
    // })
    // function onFileUploadHndlr(event: any) {
    //     const file = event.file
    // }
    const defaultImage = useMemo(() => {
        const { defaultUserType } = props;
        if (defaultUserType === "branch") {
            return DPSLogoSM;
        } else {
            return DefaultUserImg;
        }
    }, [props.defaultUserType]);

    return (<div className="tw-flex tw-flex-col tw-items-center">
        <div className="tw-relative tw-inline-block">
            <div className="tw-absolute tw-bottom-0 tw-end-0">
                <Label htmlFor={props.name} className="tw-mb-0">
                    <div className="avatar-xs tw-cursor-pointer">
                        <div className="avatar-title !tw-bg-gray-200 !tw-border !tw-rounded-full !tw-text-gray-500">
                            <i className="ri-image-fill"></i>
                        </div>
                    </div>
                </Label>
                <Input name={props.name} className="form-control !tw-hidden" id={props.name} type="file"
                    accept={props.acceptFileFormat}
                    onChange={props.onChange}
                    invalid={props.invalid}
                    disabled={props.isDisabled}
                />
            </div>
            <div className="avatar-lg tw-p-1">
                <div className="avatar-title !tw-bg-gray-200 !tw-rounded-full">
                    <img src={props.value || defaultImage} alt="multiUser" id="companylogo-img"
                        className="avatar-md !tw-rounded-full !tw-object-contain" />
                </div>
            </div>
        </div>
        {props.error && <p className="!tw-text-red-500 tw-mb-0 tw-text-xs tw-mt-2">{props.error}</p>}
        {!props.hideHelperText && <div className="!tw-text-gray-500 tw-text-xs tw-mt-2">* Maximum size 1mb allowed in jpg, png or jpeg format.</div>}
    </div>

    )
}


export const ShowUploadedImage: React.FC<any> = (props) => {
    const defaultImage = useMemo(() => {
        const { defaultUserType } = props;
        if (defaultUserType === "branch") {
            return DPSLogoSM;
        } else {
            return DefaultUserImg;
        }
    }, [props.defaultUserType]);

    return (
        <div className="avatar-lg tw-p-1">
            <div className="avatar-title !tw-bg-gray-200 !tw-rounded-full">
                <img src={props.value || defaultImage} alt={props.altText} id={props.name}
                    className="avatar-md !tw-rounded-full !tw-object-contain" />
            </div>
        </div>
    )
}
