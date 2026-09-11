
import "./_tctracking.scss";
import { ITcStepperTypes } from ".";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getDdMmYyyyFormat } from "../../utility/dateutility";
import { downloadBase64ToPdf } from "../../utility/commonutility";
import { setTcTrackingStuAct } from "../../store/appdata/appdataslice";
import Button from "../../Components/Common/Button";

const Result = (props: { setStepper: (stepper: ITcStepperTypes) => void, downloadTcLogsApiCall: () => void }) => {

    const dispatch = useAppDispatch()

    const {
        verifyTcRequestOtpResp, showApiLoader,
    } = useAppSelector(
        ({ applicationSale, globalData }) => ({
            verifyTcRequestOtpResp: applicationSale.verifyTcRequestOtpResp,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    const previousStepHndler = () => {
        props.setStepper("verification");
        dispatch(setTcTrackingStuAct(undefined))
    }

    const downloadTcCertificate = () => {
        downloadBase64ToPdf(verifyTcRequestOtpResp?.tcFile, "TC_Certificate")
        props.downloadTcLogsApiCall()
    }

    return (
        <>
            <main className="main-content-tracking">
                <div>
                    <span className="title">
                        Application Status :
                        <span className="tw-text-emerald-600 tw-ml-1">
                            TC Generated
                        </span>
                    </span>
                </div>

                <div className="tw-mt-6">
                    <div className="tw-bg-[#0AB39C29] tw-w-full tw-p-4 tw-rounded-lg tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-gap-4">

                        <div className="tw-flex tw-flex-col tw-justify-center">
                            <div className="tw-text-base tw-font-bold">
                                TC ID : {verifyTcRequestOtpResp?.tcNo || "N/A"}
                            </div>
                            <div className="tw-text-sm tw-text-gray-500 tw-mt-2">
                                Created on {getDdMmYyyyFormat(verifyTcRequestOtpResp?.requestDate)}
                            </div>
                        </div>

                        <div className="tw-flex tw-flex-col tw-items-start sm:tw-items-end">
                            <Button
                                type="button"
                                onClick={downloadTcCertificate}
                                disabled={showApiLoader}
                                variant="primary"
                            >
                                Download
                            </Button>
                            <div className="tw-text-xs tw-text-gray-500 tw-mt-2">
                                ( Click here to Download )
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tw-mt-6 tw-text-lg">
                    Please{" "}
                    <span
                        onClick={previousStepHndler}
                        className="tw-text-sky-600 tw-underline tw-cursor-pointer hover:tw-text-sky-700"
                    >
                        click here
                    </span>{" "}
                    to enter your details again.
                </div>
            </main>
        </>
    )
}

export default Result