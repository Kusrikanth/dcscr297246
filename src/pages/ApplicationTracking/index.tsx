import { useEffect, useMemo, useRef, useState } from "react";
import frame from "../../assets/images/frame.png";
import { FullPageLoader, RadioInputContainer, TextInput } from "../../Components/Common";
import "./_apptracking.scss";
import { useFormik } from "formik";
import MainContent from "./MainContent";
import NoResult from "./NoResult";
import { removeLocalStorage, setLocalStorage } from "../../utility/storageUtility";
import { generateTokenForUserAct } from "../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { generateActionPayload } from "../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getStuAppTrackerListAct, getStuListAppTrackerAct, setStuListAppTrackerAct } from "../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import HeaderLoginImg from "../../assets/imagesdps/authiconV1/dc-dark-logo.png";
import { toast } from "react-toastify";
import * as Yup from "yup";
import TableContainer from "../../Components/Common/TableContainer";
import { generateColumns, getParamsValue, getValue, menuItems } from "./helper";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { parseQueryStringToObject } from "../../utility/commonutility";
import Button from "../../Components/Common/Button";

interface initialValues {
    searchString: string,
    searchBy: string,
}

const initialValues: initialValues = {
    searchString: "",
    searchBy: "Phone No",
}

const ApplicationTracking = () => {

    const dispatch = useAppDispatch();
    const [stepper, setStepper] = useState("verification");
    const history = useHistory();
    const params = useLocation().search;
    const queryParamsObject = parseQueryStringToObject(params);
    const urlParams:any = useParams()

    const {
        generateTokenForUserResp,
        getStuAppTrackerListResp,
        getStuListAppTrackerResp,
        academicAvailabilityErrorResp,
        showApiLoader
    } = useAppSelector(
        ({ applicationSale, globalData, admissionAvailabilityRequest }) => ({
            showApiLoader: globalData.showApiLoader,
            generateTokenForUserResp: applicationSale.generateTokenForUserResp,
            getStuAppTrackerListResp: admissionAvailabilityRequest.getStuAppTrackerListResp,
            getStuListAppTrackerResp: admissionAvailabilityRequest.getStuListAppTrackerResp,
            academicAvailabilityErrorResp: admissionAvailabilityRequest.academicAvailabilityErrorResp,
        }),
        shallowEqual
    );

    const stuAppTrackerRef = useRef({
        prevStuAppTrackerRef: getStuAppTrackerListResp,
        prevGetStuListAppTrackerResp: getStuListAppTrackerResp,
        prevAcademicAvailabilityErrorResp: academicAvailabilityErrorResp,
    });

    useEffect(() => {
        const { prevStuAppTrackerRef, prevGetStuListAppTrackerResp, prevAcademicAvailabilityErrorResp } = stuAppTrackerRef.current || {}

        if (getStuAppTrackerListResp && prevStuAppTrackerRef !== getStuAppTrackerListResp) {
            // appliactionTrackingForm.resetForm()
            setStepper("success")
        }
        else if (academicAvailabilityErrorResp && prevAcademicAvailabilityErrorResp !== academicAvailabilityErrorResp) {
            const { details, code } = academicAvailabilityErrorResp || {}
            // appliactionTrackingForm.resetForm()
            if (code === 404) {
                setStepper("no-result")
            } else {
                toast.error(details || "Something went wrong. Please try again later.")
            }
        }
        else if (getStuListAppTrackerResp && prevGetStuListAppTrackerResp !== getStuListAppTrackerResp) {
            if (Array.isArray(getStuListAppTrackerResp) && getStuListAppTrackerResp.length === 0) {
                toast.error("No result found")
                appliactionTrackingForm.resetForm()
            }
        }

        stuAppTrackerRef.current.prevStuAppTrackerRef = getStuAppTrackerListResp;
        stuAppTrackerRef.current.prevGetStuListAppTrackerResp = getStuListAppTrackerResp;
        stuAppTrackerRef.current.prevAcademicAvailabilityErrorResp = academicAvailabilityErrorResp;

    }, [getStuAppTrackerListResp, getStuListAppTrackerResp, academicAvailabilityErrorResp])

    const getStuListApi = (searchString: any) => {
        dispatch(getStuListAppTrackerAct(generateActionPayload("get_stu_list_for_app_tracker", { searchString })));
    }

    const initalAPICalls = () => {
        if(urlParams?.applicationo){
            dispatch(getStuAppTrackerListAct(generateActionPayload("get_stu_app_tracker_list", { searchString: urlParams?.applicationo })));
        }
        else if (Object.keys(queryParamsObject).length > 0) {
            const searchString = getParamsValue(queryParamsObject)
            appliactionTrackingForm.setFieldValue('searchString', searchString.value)
            appliactionTrackingForm.setFieldValue('searchBy', getValue({searchString : searchString.value, searchBy : searchString.name}).name)
            getStuListApi(searchString.value)
        }
    }

    const appliactionTrackingForm = useFormik({
        initialValues,
        // validationSchema,
        onSubmit: (values) => {
            const { searchString } = values || {}
            getStuListApi(searchString)
        },
    })

    useEffect(() => {
        const formData = new FormData();
        formData.append("clientName","WEB")
        formData.append("publicKey",import.meta.env.VITE_GENERATE_TOKEN_PUBLIC_KEY)
        removeLocalStorage('accesstoken')
        dispatch(generateTokenForUserAct(generateActionPayload("generate_token_for_user", undefined, formData, { tokenNotRequired: true })));
        return () => {
        }
    }, []);

    useEffect(() => {
        if (generateTokenForUserResp?.token) {
            setLocalStorage('accesstoken', generateTokenForUserResp.token);
            initalAPICalls();
        }
    }, [generateTokenForUserResp]);

    const resetHndler = () => {
        appliactionTrackingForm.resetForm()
        history.replace(`/application-tracking`);
        dispatch(setStuListAppTrackerAct(undefined))
    }

    const viewStuHndler = (appNo: string) => {
        dispatch(getStuAppTrackerListAct(generateActionPayload("get_stu_app_tracker_list", { searchString: appNo })));
        const searchString = getValue(appliactionTrackingForm.values)
        history.replace(`/application-tracking?${searchString.name}=${searchString.value}`);
    }

    const filterHndler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        appliactionTrackingForm.setFieldValue(name, value)
        appliactionTrackingForm.setFieldValue("searchString", "")
    }

    const roleColumns = useMemo(() => generateColumns(viewStuHndler), [getStuListAppTrackerResp]);

    return (
        <>
            {showApiLoader && <FullPageLoader />}
            <form className="application-tracking-container" onSubmit={appliactionTrackingForm.handleSubmit}>
                <div className="logo-container">
                    <img src={HeaderLoginImg} className="logo" alt="logo" />
                </div>

                {stepper === "verification" && !urlParams?.applicationo && <main className="main-content-tracking">

                    <div className="content-logo-container">
                        <div className="content-logo-container-1">
                            <h1 className="title">Track your Application</h1>

                            <p className="description">
                                DPS believes you deserve to have a hassle-free admission experience and had made
                                applying for admission and tracking application easy. Once you have filled the
                                application form DPS allows easy ways to track your application both online and offline.
                            </p>

                            <p className="instruction">
                                To track your application offline, you can call admission department office and ask
                                status. You can also track your application if you have application or registration
                                Number you can track your application here.
                            </p>
                        </div>
                        <div className="content-logo-container-2">
                            <img src={frame} alt="frame" width={"200px"} className="frame" />
                        </div>

                    </div>

                    <div className="application-no-container">
                        <div className="heading">
                            Please enter either the Email ID, or Phone Number.
                        </div>
                        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4  tw-items-baseline tw-mt-4">
                            <div className="md:tw-col-span-12">
                                <RadioInputContainer
                                    name="searchBy"
                                    labelText="Search By : "
                                    containerClassName="tw-flex"
                                    labelClassName="tw-mr-3 tw-font-bold"
                                    formgroupClassName="tw-text-base tw-mb-3"
                                    radioClassName="tw-mr-3"
                                    value={appliactionTrackingForm.values.searchBy}
                                    onChange={filterHndler}
                                    radioOptions={menuItems}
                                    invalid={(appliactionTrackingForm.touched.searchBy && appliactionTrackingForm.errors.searchBy) ? true : false}
                                    error={(appliactionTrackingForm.touched.searchBy && appliactionTrackingForm.errors.searchBy) ? appliactionTrackingForm.errors.searchBy : ""}
                                />
                            </div>
                            <div className="md:tw-col-span-8">
                                <TextInput
                                    name="searchString"
                                    onChange={appliactionTrackingForm.handleChange}
                                    value={appliactionTrackingForm.values.searchString}
                                    inputClassName="tw-h-12"
                                    placeHolder={`Search ${appliactionTrackingForm.values.searchBy}`}
                                />
                            </div>
                            <div className="md:tw-col-span-4 tw-flex tw-gap-2">
                                <Button
                                    disabled={showApiLoader}
                                    type="submit"
                                    variant="primary"
                                >
                                    Submit
                                </Button>

                                <Button
                                    disabled={showApiLoader}
                                    type="button"
                                    variant="secondary"
                                    onClick={resetHndler}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                        <div className="mt-3">
                            <TableContainer
                                columns={roleColumns || []}
                                data={getStuListAppTrackerResp || []}
                                divClass="tw-overflow-x-auto tw-mb-3"
                                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                                // showCheckbox={true}
                                showPagination={false}
                            />
                        </div>
                    </div>

                </main>}
                {stepper === "no-result" && <NoResult setStepper={setStepper} />}
                {stepper === "success" && <MainContent setStepper={setStepper} />}
            </form>
        </>
    )
}

export default ApplicationTracking