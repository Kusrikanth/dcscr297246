
import "./_tctracking.scss";
import { default as NoResultSvg } from "../../assets/imagesdps/academics/NoResult.svg?react"
import { ITcStepperTypes } from ".";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { setTcTrackingStuAct } from "../../store/appdata/appdataslice";

const NoResult = (props: { setStepper: (stepper: ITcStepperTypes) => void }) => {
    const dispatch = useAppDispatch()

    const {
        verifyTcRequestOtpResp,
    } = useAppSelector(
        ({ applicationSale, globalData, appData }) => ({
            verifyTcRequestOtpResp: applicationSale.verifyTcRequestOtpResp,
        }),
        shallowEqual
    );

    const previousStepHndler = () => {
        props.setStepper("verification");
        dispatch(setTcTrackingStuAct(undefined))
    }

    return (
        <>
            <main className="main-content-tracking">
                <div>
                    <span className="title">
                        Application Status :
                        <span className="tw-text-amber-500 tw-ml-1">
                            TC Application Status - {verifyTcRequestOtpResp?.preparationStatus}
                        </span>
                    </span>
                </div>

                <div className="no-result-container tw-text-gray-500 tw-mt-6">
                    <div>
                        <NoResultSvg />
                    </div>
                    <div className="tw-text-lg tw-mt-4">
                        No Application found
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

export default NoResult