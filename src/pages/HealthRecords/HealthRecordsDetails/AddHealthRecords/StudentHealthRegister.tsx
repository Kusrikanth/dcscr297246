import React, { useEffect } from 'react'
import { DateInput, SelectInput, TextInput, TextInputWithRegex } from '../../../../Components/Common'
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { selectData1 } from './helper';


const StudentHealthRegister = (props: any) => {

    const { addStudentHealthRecordForm , route, setStudentListState, setSearchStudentState } = props || {};
    const { isDisabled , isEditDisabled } = route || {};

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getMiRoomListResp,
        healthRecordsErrResp,
    }: any = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, healthRecords }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getMiRoomListResp: healthRecords.getMiRoomListResp,
            healthRecordsErrResp: healthRecords.healthRecordsErrResp,
        }),
        shallowEqual
    );

    const onChangeHndler = (event:any)=>{
        const { name , value } = event.target || {};

        const data = getMiRoomListResp?.data?.find((data:any)=>data?.roomName === value);
       
        if (name === 'miRoomName') {
            const data = getMiRoomListResp?.data?.find((data: any) => data?.roomName === value);
            addStudentHealthRecordForm.setValues((prev: any) => ({
                ...prev,
                [name]: data?.roomName,
                miInchargeId: data?.inchargeId,
                miInchargeName: data?.inchargeName
            }));
        } else if (name === 'userType') {
            addStudentHealthRecordForm.setValues((prev: any) => ({
                ...prev,
                [name]: value
            }));
        } else if (name === 'academicYearId') {
            addStudentHealthRecordForm.setValues((prev: any) => ({
                ...prev,
                [name]: value
            }));
        }
        else if( name === 'date') {
            addStudentHealthRecordForm.setValues((prev: any) => ({
                ...prev,
                [name]: value
            }));
        }
    }
    
    return (
        <>
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12 md:tw-col-span-4">
                    <SelectInput
                        name="academicYearId"
                        value={addStudentHealthRecordForm.values.academicYearId}
                        onChange={onChangeHndler}
                        menuItems={academicYearListResp?.data || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelText="Academic Year"
                        isDisabled={isEditDisabled || isDisabled }
                    />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-4">
                    <DateInput
                        name="date"
                        labelText="Date"
                        value={addStudentHealthRecordForm.values.date}
                        onChange={onChangeHndler}
                        isDisabled={isEditDisabled || isDisabled}
                        onBlur={addStudentHealthRecordForm.handleBlur}
                    />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-4">
                    <SelectInput
                        name="userType"
                        value={addStudentHealthRecordForm.values.userType}
                        onChange={onChangeHndler}
                        menuItems={selectData1}
                        valueKey="userType"
                        textKey="userType"
                        labelClass="required"
                        labelText="User Type"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        isDisabled={isDisabled || isEditDisabled}
                        invalid={addStudentHealthRecordForm.touched.userType && addStudentHealthRecordForm.errors.userType ? true : false}
                        error={addStudentHealthRecordForm.touched.userType && addStudentHealthRecordForm.errors.userType ? addStudentHealthRecordForm.errors.userType : ""}
                    />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-4 tw-mt-2">
                    <SelectInput
                        name="miRoomName"
                        value={addStudentHealthRecordForm.values.miRoomName}
                        onChange={onChangeHndler}
                        menuItems={getMiRoomListResp?.data}
                        valueKey="roomName"
                        textKey="roomName"
                        labelClass='required'
                        labelText='MI Room Name'
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        isDisabled={isDisabled || isEditDisabled} 
                        invalid={addStudentHealthRecordForm.touched.miRoomName && addStudentHealthRecordForm.errors.miRoomName ? true : false}
                        error={ addStudentHealthRecordForm.touched.miRoomName && addStudentHealthRecordForm.errors.miRoomName ? addStudentHealthRecordForm.errors.miRoomName : "" }
                    />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-4 tw-mt-2">
                    <TextInput
                        name="miInchargeName"
                        labelText="MI Incharge"
                        value={addStudentHealthRecordForm.values.miInchargeName}
                        onChange={undefined}
                        isDisabled={true}
                    />
                </div>

            </div>
        </>
    )
}

export default StudentHealthRegister