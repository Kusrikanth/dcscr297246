import React, { useEffect, useRef, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import { useFormik } from 'formik'
import StudentHealthRegister from './StudentHealthRegister'
import { convertToFullTime, Current_Date, getYyyyMmDdFormat } from '../../../../utility/dateutility'
import StudentDetails from './StudentDetails'
import UncontrolledAccordionCard from '../../../../Components/Common/UncontrolledAccordionCard'
import AccordionCardItem from '../../../../Components/Common/AccordionCardItem'
import AccordionCardHeader from '../../../../Components/Common/AccordionCardHeader'
import AccordionCardBody from '../../../../Components/Common/AccordionCardBody'
import VitalSigns from './VitalSigns'
import { useAppSelector } from '../../../../hooks/storehook'
import { shallowEqual, useDispatch } from 'react-redux'
import { editHealthRecordsListAct, getHealthRecordsListByIdAct, getMiRoomListAct, getStuAlimentListAct, resetHealthRecordsListByIdAct, saveHealthRecordsListAct } from '../../../../store/healthrecords/healthrecordsaction'
import { generateActionPayload } from '../../../../utility/reduxutility'
import { toast } from 'react-toastify'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import * as Yup from "yup";
import { calculateAge, statusOptions } from './helper'
import { generateUniqueNumber } from '../../../../utility/commonutility'
import Medicine from './Medicine'
import Button from '../../../../Components/Common/Button'

const initialValues = {
    academicYearId: "",
    academicYearName: "",
    studentDetailId: "",
    employeeId: "",
    branchClassId: "",
    sectionId: "",
    miInchargeId: "",
    miInchargeName: "",
    alimentRequestDtos: [],
    date: Current_Date,
    miRoomName: "",
    className: "",
    sectionName: "",
    age: "",
    gender: "",
    motherMobileNo: "",
    fatherMobileNo: "",
    transportId: "",
    transportRouteName: "",
    height: "",
    weight: "",
    time: "",
    temperature: "",
    pulseRate: "",
    bp: "",
    respiratory: "",
    grbs: "",
    pupilsReaction: "",
    spo2: "",
    presentComplaints: "",
    treatmentGiven: "",
    firstAid: null,
    medication: null,
    referredToHospital: null,
    sentToHome: null,
    userType: "STUDENT",
    genderName:"",
    employeeMobileNo :"",
    employeeEmail :"",
    employeeDepartmentName :"",
    bloodGroupName:"",
    medicineRequestDtos: [
        {
            uniqueId: generateUniqueNumber(),
            searchString: "",
            medicineId: "",
            quantity: "",
            medicineRemarks: "",
        },
    ],
    remarks:"",
}

const validationSchema = Yup.object().shape({
    miRoomName: Yup.string().required("MI Room Name is required."),
    studentDetailId: Yup.string().nullable().when('userType', {
        is: (item: any) => item === "STUDENT",
        then: Yup.string().required('Student Name is required.')
    }),
    employeeId: Yup.string().nullable().when('userType', {
        is: (item: any) => item === "EMPLOYEE",
        then: Yup.string().required('Employee Name is required.')
    }),
    // remarks: Yup.string().required("Remarks is required.").nullable(),
});

const AddHealthRecords = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const location: any = useLocation()
    const params: any = useParams();
    const [smsAndEmailMenu, setSmsAndEmailMenu] = useState(statusOptions);

    const [route, setRoute] = useState<any>(null)

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        saveHealthRecordsListResp,
        getHealthRecordsListByIdResp,
        editHealthRecordsListResp,
        getStuAlimentListResp,
        healthRecordsErrResp,
    }: any = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, healthRecords }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            saveHealthRecordsListResp: healthRecords.saveHealthRecordsListResp,
            getHealthRecordsListByIdResp: healthRecords.getHealthRecordsListByIdResp,
            editHealthRecordsListResp: healthRecords.editHealthRecordsListResp,
            getStuAlimentListResp: healthRecords.getStuAlimentListResp,
            healthRecordsErrResp: healthRecords.healthRecordsErrResp,
        }),
        shallowEqual
    );

    const addHealthRecordRef = useRef<any>({
        prevSaveHealthRecordsListResp: saveHealthRecordsListResp,
        prevGetHealthRecordsListByIdResp: getHealthRecordsListByIdResp,
        prevEditHealthRecordsListResp: editHealthRecordsListResp,
        prevGetStuAlimentListResp: getStuAlimentListResp,
        prevHealthRecordsErrResp: healthRecordsErrResp,
    })

    useEffect(() => {
        const { prevSaveHealthRecordsListResp, prevGetStuAlimentListResp, prevGetHealthRecordsListByIdResp, prevEditHealthRecordsListResp, prevHealthRecordsErrResp } = addHealthRecordRef.current;

        if (saveHealthRecordsListResp && prevSaveHealthRecordsListResp !== saveHealthRecordsListResp) {
            toast.success("Health Records Added Successfully");
            history.push("/health-records")
        }
        else if (editHealthRecordsListResp && prevEditHealthRecordsListResp !== editHealthRecordsListResp) {
            toast.success("Health Record Updated Successfully");
            history.push("/health-records")
        }
        else if (getHealthRecordsListByIdResp && prevGetHealthRecordsListByIdResp !== getHealthRecordsListByIdResp) {
            if (getHealthRecordsListByIdResp && Array.isArray(getStuAlimentListResp) && getStuAlimentListResp?.length > 0) {

                const { academicYearId, academicYearName, studentId, employeeId, classId, className, sectionName, sectionId, transportRouteId, transportRoute, miInchargeId,miRoomName, temperature, pulseRate, bp, respiratory, grbs, pupilsReaction, spo2, presentComplaints, treatmentGiven, remarks, firstAid, medication, referredToHospital, sentToHome, alignResponseDtos, age, gender, fatherContactNo, motherContactNo,inchargeName,roomName,height,weight,time , dob, userType, genderName, contactNo, workEmailId, departmentName, bloodGroupName, medicineResponseDtos, date  } = getHealthRecordsListByIdResp || {};

                // For finding checkboxes in alinmnet list

                const result = alignResponseDtos.reduce((acc:any, curr:any) => {
                    const found = acc.find((item:any) => item.id === curr.id);
                    if (found) {
                        if (curr.subAlimentId !== null && curr.subAlimentName !== null) {
                            found.subAlimentName.push({ id: curr.subAlimentId, ailmentName: curr.subAlimentName, remarks: curr.remarks });
                        }
                    } else {
                        acc.push({
                            id: curr.id,
                            alimentName: curr.alimentName,
                            remarks: curr.remarks,
                            subAlimentName: curr.subAlimentId !== null && curr.subAlimentName !== null 
                                ? [{ id: curr.subAlimentId, ailmentName: curr.subAlimentName, remarks: curr.remarks }] 
                                : []
                        });
                    }
                    return acc;
                }, []);
    
                const medicineRequestDtos = medicineResponseDtos?.map((medicine: any)=> {
                    return {
                        medicineId: medicine.medicineId || "", 
                        searchString: medicine.name || "", 
                        medicineRemarks: medicine.remarks || "", 
                        quantity: medicine.quantity ? medicine.quantity.toString() : "",
                        isDeleted: medicine.isDeleted || false, 
                    };
                }) || [];

                const { parentArray, subArray } = result?.reduce((acc:any, item:any) => {
                    acc.parentArray.push(item.id);
                    if (Array.isArray(item?.subAlimentName)) {
                        item?.subAlimentName?.forEach((subItem:any) => {
                            acc.subArray.push(subItem.id);
                        });
                    }
                    return acc;
                }, { parentArray: [], subArray: [] }) || { parentArray: [], subArray: [] };
    
                const newList = getStuAlimentListResp.map((i) => ({
                    ...i,
                    isChecked: parentArray.includes(i.id),
                    remarks: result.find((aliment: { id: any }) => aliment.id === i.id)?.remarks || '',
                    subAlimentName: i.subAlimentName?.map((j: { id: any }) => ({
                        ...j,
                        isChecked: subArray.includes(j.id),
                        remarks: result.find((aliment: { id: any }) => aliment.id === i.id)?.subAlimentName?.find((sub: { id: any }) => sub.id === j.id)?.remarks || '',
                    })) || [],
                }));
    

                addStudentHealthRecordForm.setValues((prev: any) => ({
                    ...prev,
                    academicYearId,
                    academicYearName,
                    studentDetailId: studentId,
                    employeeId: employeeId,
                    branchClassId: classId,
                    className,
                    sectionName,
                    sectionId,
                    transportRouteId,
                    transportRouteName: transportRoute,
                    miInchargeId,
                    temperature,
                    pulseRate,
                    bp,
                    respiratory,
                    grbs,
                    pupilsReaction,
                    spo2,height,weight,time,
                    miRoomName:roomName,
                    miInchargeName:inchargeName,
                    presentComplaints,
                    userType,
                    date: getYyyyMmDdFormat(date) || Current_Date,
                    genderName, employeeMobileNo: contactNo, employeeEmail : workEmailId, employeeDepartmentName : departmentName, bloodGroupName,
                    age : calculateAge(dob), gender, motherMobileNo: motherContactNo, fatherMobileNo: fatherContactNo,
                    treatmentGiven, remarks, alimentRequestDtos: newList,
                    firstAid: firstAid?.toLowerCase() === "yes" ? true : false,
                    medication: medication?.toLowerCase() === "yes" ? true : false,
                    referredToHospital: referredToHospital?.toLowerCase() === "yes" ? true : false,
                    sentToHome: sentToHome?.toLowerCase() === "yes" ? true : false,
                    medicineRequestDtos,
                }));

            }
        }
        else if (healthRecordsErrResp && prevHealthRecordsErrResp !== healthRecordsErrResp) {
            const { details } = healthRecordsErrResp || {};
            toast.error(details || "Something went wrong");
        }

        addHealthRecordRef.current.prevSaveHealthRecordsListResp = saveHealthRecordsListResp;
        addHealthRecordRef.current.prevGetHealthRecordsListByIdResp = getHealthRecordsListByIdResp;
        addHealthRecordRef.current.prevEditHealthRecordsListResp = editHealthRecordsListResp;
        addHealthRecordRef.current.prevGetStuAlimentListResp = getStuAlimentListResp;
        addHealthRecordRef.current.prevHealthRecordsErrResp = healthRecordsErrResp;

    }, [saveHealthRecordsListResp, getHealthRecordsListByIdResp, editHealthRecordsListResp, getStuAlimentListResp, healthRecordsErrResp])

    useEffect(() => {
        if (params?.route) {
            if (!(params?.route === "add")) {
                dispatch(getHealthRecordsListByIdAct(generateActionPayload('get_health_records_list_by_id', { id: location?.state?.id })))
            }
            setRoute({
                route: params?.route,
                isDisabled: params?.route === "view" ? true : false,
                isEditDisabled: params?.route === "edit" ? true : false,
            })
        }
    }, [params])

    const addStudentHealthRecordForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
          const {
            academicYearId, studentDetailId, employeeId, branchClassId, sectionId, transportId, miInchargeId, miRoomName, temperature, pulseRate, bp, respiratory, grbs, pupilsReaction, spo2, presentComplaints, treatmentGiven, remarks, firstAid, medication, referredToHospital, sentToHome, alimentRequestDtos, userType, height, weight, time, age, gender,
          } = values || {};
      
          const alimentList = alimentRequestDtos?.map((item: any) => {
            if (item?.isChecked) {
              const subAlignIds = item?.subAlimentName?.map((sub: any) => sub?.isChecked ? sub?.id : null).filter((f: any) => f);
              return {
                alimentId: item?.id,
                remarks: item?.remarks || "",
                subAlignIds: subAlignIds.length > 0 ? subAlignIds : undefined
              };
            }
            return null;
          }).filter(f => f);
      
          const payload: any = {
            academicYearId, branchId, studentDetailId, employeeId, branchClassId, sectionId, transportId, miInchargeId, miRoomName, temperature, height, weight, time, age, gender: gender || null, pulseRate, bp, respiratory, grbs, pupilsReaction, spo2, presentComplaints, treatmentGiven, remarks, firstAid: firstAid ? "YES" : "NO", medication: medication ? "YES" : "NO", referredToHospital: referredToHospital ? "YES" : "NO", sentToHome: sentToHome ? "YES" : "NO", alimentRequestDtos: alimentList, userType,date: convertToFullTime(values.date) || convertToFullTime(Current_Date),
          };

          smsAndEmailMenu?.forEach((item: any) => {
            payload[item?.id] = item?.selected;
          });
          
          if (location?.state?.id) {
            const medicineResponseDtos = values.medicineRequestDtos.map((medicine: any) => ({
              medicineId: medicine.medicineId,
              quantity: parseInt(medicine.quantity, 10) || 0,
              remarks: medicine.medicineRemarks || '',
              isDeleted: medicine.isDeleted || false
            }));
            const editPayload = {
              ...payload,
              medicineResponseDtos
            };
            dispatch(editHealthRecordsListAct(generateActionPayload('edit_health_records_list', { id: location?.state?.id }, editPayload)));
          } else {
            const medicineResponseDtos = addStudentHealthRecordForm.values.medicineRequestDtos.map((medicine: any) => ({
              medicineId: medicine.medicineId || "",
              remarks: medicine.medicineRemarks || "",
              quantity: parseInt(medicine.quantity, 10) || 0,
              name: medicine.searchString || "" 
            })).filter(medicine => medicine.medicineId);
            
            const savePayload = {
              ...payload,
              medicineResponseDtos
            };
      
            dispatch(saveHealthRecordsListAct(generateActionPayload('save_health_records_list', undefined, savePayload)));
          }
        }
      });
      
    
    
    useEffect(() => {
        dispatch(getMiRoomListAct(generateActionPayload('get_mi_room_list', undefined, { branchId })))

        dispatch(getStuAlimentListAct(generateActionPayload('get_stu_aliment_list')))

        return () => {
            dispatch(resetHealthRecordsListByIdAct(undefined))
        }
    }, [])

    useEffect(() => {
        if (academicYearListResp && !location?.state?.id) {
            let data = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")
            addStudentHealthRecordForm.setFieldValue("academicYearId", data?.academicYearId)
            addStudentHealthRecordForm.setFieldValue("academicYearName", data?.academicYearName)
        }
    }, [academicYearListResp]);

    const props = {
        addStudentHealthRecordForm,
        route,
        smsAndEmailMenu,
        setSmsAndEmailMenu
    };

    return (
        <>
            <div className="tw-w-full page-content  ">
                <div className="tw-px-4">

                    <BreadCrumb
                        title="Create Health Records"
                        pageTitle="Health Records Details"
                        pageTitleUrl="/health-records"
                    />

                    <div className="tw-grid tw-grid-cols-12 tw-justify-center tw-mb-4">
                    <div className="tw-col-span-10 tw-col-start-2">

                            <div className="tw-bg-white tw-rounded tw-shadow">

                                {/* Card Header */}
                                <div className="tw-border-b tw-px-4 tw-py-3">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        Health Register
                                    </h4>
                                </div>

                                {/* Card Body */}
                                <div className="tw-p-4">
                                    <form onSubmit={addStudentHealthRecordForm.handleSubmit}>

                                        <UncontrolledAccordionCard defaultOpen={['1', '2', '3', '4']}>

                                            <AccordionCardItem>
                                                <AccordionCardHeader
                                                    titleClass="tw-font-bold"
                                                    targetId="1"
                                                    title="Health Register"
                                                />
                                                <AccordionCardBody
                                                    accordionId="1"
                                                    className="tw-border-0 tw-rounded-b tw-p-0"
                                                >
                                                    <StudentHealthRegister {...props} />
                                                </AccordionCardBody>
                                            </AccordionCardItem>

                                            <AccordionCardItem>
                                                <AccordionCardHeader
                                                    titleClass="tw-font-bold"
                                                    targetId="2"
                                                    title="Details"
                                                />
                                                <AccordionCardBody
                                                    accordionId="2"
                                                    className="tw-border-0 tw-rounded-b tw-p-0"
                                                >
                                                    <StudentDetails {...props} />
                                                </AccordionCardBody>
                                            </AccordionCardItem>

                                            <AccordionCardItem>
                                                <AccordionCardHeader
                                                    titleClass="tw-font-bold"
                                                    targetId="3"
                                                    title="Vital Signs"
                                                />
                                                <AccordionCardBody
                                                    accordionId="3"
                                                    className="tw-border-0 tw-rounded-b tw-p-0"
                                                >
                                                    <VitalSigns {...props} />
                                                </AccordionCardBody>
                                            </AccordionCardItem>

                                            <AccordionCardItem>
                                                <AccordionCardHeader
                                                    titleClass="tw-font-bold"
                                                    targetId="4"
                                                    title="Medicine"
                                                />
                                                <AccordionCardBody
                                                    accordionId="4"
                                                    className="tw-border-0 tw-rounded-b tw-p-0"
                                                >
                                                    <Medicine {...props} />
                                                </AccordionCardBody>
                                            </AccordionCardItem>

                                        </UncontrolledAccordionCard>

                                        {/* Footer Actions */}
                                        {route?.route !== "view" && (
                                            <div className="tw-flex tw-justify-end tw-mt-4">
                                                <div className="tw-flex tw-gap-2">
                                                    <Button
                                                        type="button"
                                                        onClick={() => history.push("/health-records")}
                                                        variant='secondary'
                                                    >
                                                        Cancel
                                                    </Button>

                                                    <Button
                                                        type="submit"
                                                        disabled={showApiLoader}
                                                        variant='primary'>
                                                        {route?.route === "edit" ? "Update" : "Submit"}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AddHealthRecords