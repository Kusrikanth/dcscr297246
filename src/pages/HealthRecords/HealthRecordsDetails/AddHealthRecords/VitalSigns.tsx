import React, { useEffect, useRef, useState } from 'react'
import { InputCheckbox, TextArea, TextInput, TextInputGroup } from '../../../../Components/Common'
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { medicalOptions } from './helper';
import { useLocation } from 'react-router-dom';

const VitalSigns = (props: any) => {

    const location:any = useLocation()
    const { addStudentHealthRecordForm , route,  smsAndEmailMenu, setSmsAndEmailMenu } = props || {};
    const { isDisabled } = route || {};

    const [medicalOptionList, setMedicalOptionList] = useState<any>(medicalOptions)

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getStuAlimentListResp,
        getHealthRecordsListByIdResp,
    }: any = useAppSelector(
        ({ globalData, appData, healthRecords }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getStuAlimentListResp: healthRecords.getStuAlimentListResp,
            getHealthRecordsListByIdResp: healthRecords.getHealthRecordsListByIdResp,
        }),
        shallowEqual
    );

    const studentDetailsRef = useRef<any>({
        prevGetStuAlimentListResp: getStuAlimentListResp,
        prevGetHealthRecordsListByIdResp : getHealthRecordsListByIdResp || {},
    })

    useEffect(() => {
        const { prevGetStuAlimentListResp , prevGetHealthRecordsListByIdResp } = studentDetailsRef.current;

        if(getHealthRecordsListByIdResp && prevGetHealthRecordsListByIdResp !== getHealthRecordsListByIdResp){

                // Set medical options
                setMedicalOptionList(medicalOptionList.map((item: any) => {
                    return { ...item, isChecked: getHealthRecordsListByIdResp[`${item?.key}`]?.toLowerCase() === "yes" ? true : false }
                }))
                
        }
        else if ((getStuAlimentListResp && prevGetStuAlimentListResp !== getStuAlimentListResp) && !location?.state?.id ) {
            if (Array.isArray(getStuAlimentListResp) && getStuAlimentListResp?.length > 0) {
                const newList = getStuAlimentListResp.map((i: any) => ({ ...i, isChecked: false, subAlimentName: i?.subAlimentName?.map((j: any) => ({ ...j, isChecked: false })) }))
                addStudentHealthRecordForm.setFieldValue("alimentRequestDtos",newList)

            } else {
                addStudentHealthRecordForm.setFieldValue("alimentRequestDtos",[])
            }
        }
        
        studentDetailsRef.current.prevGetStuAlimentListResp = getStuAlimentListResp;
        studentDetailsRef.current.prevGetHealthRecordsListByIdResp = getHealthRecordsListByIdResp;

    }, [getStuAlimentListResp,getHealthRecordsListByIdResp])

    const CheckBoxHandler = (type: string, parentId: any, subId?: any) => {
        const newList = addStudentHealthRecordForm.values.alimentRequestDtos?.map((i: any) => {
            if (+i?.id !== +parentId) return i;

            if (type === "common") {
                const isChecked = !i.isChecked;
                return {
                    ...i,
                    isChecked,
                    subAlimentName: i.subAlimentName?.map((j: any) => ({ ...j, isChecked: isChecked ? j.isChecked : false }))
                };
            } else {
                return {
                    ...i,
                    subAlimentName: i.subAlimentName?.map((j: any) =>
                        +j?.id === +subId ? { ...j, isChecked: !j.isChecked } : j
                    )
                };
            }
        });

        addStudentHealthRecordForm.setFieldValue("alimentRequestDtos",newList)
    }

    const medicalOptionHndler = (index:number)=>{
        const newList = medicalOptionList?.map((i: any,idx : number) => {
            idx === index ? addStudentHealthRecordForm.setFieldValue(i?.key,!i.isChecked) : addStudentHealthRecordForm.setFieldValue(i?.key,i.isChecked)
            return idx === index ? {...i,isChecked:!i.isChecked} : i
        })
        setMedicalOptionList(newList)
    }

    function smsAndEmailChangeHndler(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target;
    
        const newList = smsAndEmailMenu?.map((item: any) => {
            if (item?.id === name) {
                return {
                    ...item,
                    selected: checked,
                };
            }
            return item;
        });
        setSmsAndEmailMenu(newList);
    }
    
    return (
        <>
            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-px-2">

                {/* Common Ailments Table */}
                <div className="tw-col-span-12">
                    {addStudentHealthRecordForm.values.alimentRequestDtos?.length > 0 && (
                        <div className="tw-grid tw-grid-cols-12 tw-my-3 tw-border-2">

                            {/* Headers */}
                            <div className="tw-col-span-3 tw-border-b tw-border-r tw-pl-4 tw-py-2 tw-font-bold">
                                Common Ailment
                            </div>
                            <div className="tw-col-span-6 tw-border-b tw-border-r tw-pl-4 tw-py-2 tw-font-bold">
                                Common Sub Ailments
                            </div>
                            <div className="tw-col-span-3 tw-border-b tw-pl-4 tw-py-2 tw-font-bold">
                                Remarks
                            </div>

                            {/* Common Ailments */}
                            <div className="tw-col-span-3 tw-border-r tw-pr-0">
                                {addStudentHealthRecordForm.values.alimentRequestDtos?.map(
                                    (sub: any, index: number) => (
                                        <div key={index} className="tw-border-b tw-pl-4 tw-py-2 tw-h-12">
                                            <InputCheckbox
                                                key={index}
                                                name={`${sub.alimentName}`}
                                                labelName={`${sub.alimentName}`}
                                                value={sub.isChecked}
                                                isDisabled={isDisabled}
                                                onChange={() => CheckBoxHandler("common", sub?.id)}
                                            />
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Sub Ailments */}
                            <div className="tw-col-span-6 tw-border-r tw-pr-0">
                                {addStudentHealthRecordForm.values.alimentRequestDtos?.map(
                                    (item: any, index: number) => {
                                        if (item?.subAlimentName?.length > 0) {
                                            return (
                                                <div key={`${item?.subAlimentName}-${index}`} className="tw-flex tw-border-b tw-pl-4 tw-py-2 tw-h-12">
                                                    {item?.subAlimentName?.map((sub: any, idx: number) => (
                                                        <div key={`${sub?.id}-${idx}`} className={idx > 0 ? "tw-ml-4" : ""}>
                                                            <InputCheckbox
                                                                key={index}
                                                                name={`${item.alimentName}-${sub.ailmentName}`}
                                                                labelName={`${sub.ailmentName}`}
                                                                isDisabled={!item?.isChecked || isDisabled}
                                                                value={sub.isChecked}
                                                                onChange={() => CheckBoxHandler("sub", item?.id, sub?.id)}
                                                                formgroupClassName="tw-mb-0"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        } else {
                                            return <div key={`${item?.subAlimentName}-${index}`} className="tw-border-b tw-pl-4 tw-py-2 tw-h-12" />;
                                        }
                                    }
                                )}
                            </div>

                            {/* Remarks */}
                            <div className="tw-col-span-3 tw-pr-0">
                                {addStudentHealthRecordForm.values.alimentRequestDtos?.map((sub: any, index: number) => (
                                    <div key={index} className="tw-border-b tw-pl-4 tw-p-2 tw-h-12">
                                        <TextInput
                                            key={index}
                                            name={`alimentRequestDtos[${index}].remarks`}
                                            formgroupClassName=""
                                            value={sub.remarks}
                                            isDisabled={!sub.isChecked || isDisabled}
                                            onChange={addStudentHealthRecordForm.handleChange}
                                            maxLength={200}
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}
                </div>

                <div className="tw-col-span-4">
                    <TextInputGroup
                        name="temperature"
                        value={addStudentHealthRecordForm.values.temperature}
                        onChange={addStudentHealthRecordForm.handleChange}
                        labelText="Temperature"
                        allowedInputRegex="^[0-9.]+$"
                        isDisabled={isDisabled}
                    >
                        *F
                    </TextInputGroup>
                </div>

                <div className="tw-col-span-4">
                    <TextInputGroup
                        name="pulseRate"
                        value={addStudentHealthRecordForm.values.pulseRate}
                        onChange={addStudentHealthRecordForm.handleChange}
                        labelText="Pulse Rate/Min"
                        allowedInputRegex="^[0-9/]*$"
                        isDisabled={isDisabled}
                    >
                        BPM
                    </TextInputGroup>
                </div>

                <div className="tw-col-span-4">
                    <TextInputGroup
                        name="bp"
                        value={addStudentHealthRecordForm.values.bp}
                        onChange={addStudentHealthRecordForm.handleChange}
                        labelText="Blood Pressure"
                        allowedInputRegex="^[0-9/]*$"
                        isDisabled={isDisabled}
                    >
                        MM HG
                    </TextInputGroup>
                </div>

                <div className="tw-col-span-4">
                    <TextInputGroup
                        name="respiratory"
                        value={addStudentHealthRecordForm.values.respiratory}
                        onChange={addStudentHealthRecordForm.handleChange}
                        labelText="Respiration"
                        allowedInputRegex="^[0-9.]+$"
                        isDisabled={isDisabled}
                    >
                        BMP
                    </TextInputGroup>
                </div>

                <div className="tw-col-span-4">
                    <TextInputGroup
                        name="grbs"
                        value={addStudentHealthRecordForm.values.grbs}
                        onChange={addStudentHealthRecordForm.handleChange}
                        labelText="GRBS"
                        allowedInputRegex="^[0-9/]*$"
                        isDisabled={isDisabled}
                    >
                        MG/DL
                    </TextInputGroup>
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="pupilsReaction"
                        labelText="Pupils Reaction"
                        value={addStudentHealthRecordForm.values.pupilsReaction}
                        onChange={addStudentHealthRecordForm.handleChange}
                        isDisabled={isDisabled}
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="spo2"
                        labelText="SpO2"
                        value={addStudentHealthRecordForm.values.spo2}
                        onChange={addStudentHealthRecordForm.handleChange}
                        isDisabled={isDisabled}
                    />
                </div>

                <div className="tw-col-span-8">
                    <TextInput
                        name="presentComplaints"
                        labelText="Present Complaints"
                        value={addStudentHealthRecordForm.values.presentComplaints}
                        onChange={addStudentHealthRecordForm.handleChange}
                        isDisabled={isDisabled}
                        maxLength={200}
                    />
                </div>

                <div className="tw-col-span-12">
                    <TextArea
                        name="treatmentGiven"
                        labelText="Treatment Given"
                        value={addStudentHealthRecordForm.values.treatmentGiven}
                        onChange={addStudentHealthRecordForm.handleChange}
                        isDisabled={isDisabled}
                    />
                </div>

                {/* SMS/Email Checkboxes */}
                <div className="tw-col-span-6 tw-font-bold">Remarks</div>
                <div className="tw-col-span-6 tw-flex tw-justify-end tw-items-center tw-pr-4">
                    {smsAndEmailMenu?.map((item: any) => (
                        <div key={item.id} className="tw-ml-3">
                            <InputCheckbox
                                name={`${item.id}`}
                                labelName={item.name}
                                value={item.selected}
                                onChange={smsAndEmailChangeHndler}
                                dataId={item.id}
                            />
                        </div>
                    ))}
                </div>

                {/* Final Remarks TextArea */}
                <div className="tw-col-span-12">
                    <TextArea
                        name="remarks"
                        value={addStudentHealthRecordForm.values.remarks}
                        onChange={addStudentHealthRecordForm.handleChange}
                        invalid={addStudentHealthRecordForm.touched.remarks && addStudentHealthRecordForm.errors.remarks ? true : false}
                        error={ addStudentHealthRecordForm.touched.remarks && addStudentHealthRecordForm.errors.remarks ? addStudentHealthRecordForm.errors.remarks : "" }
                        isDisabled={isDisabled}
                    />
                </div>

                {/* Medical Options */}
                <div className="tw-col-span-12">
                    {medicalOptionList?.map((sub: any, index: number) => (
                        <div key={index}>
                            <InputCheckbox
                                key={index}
                                name={`${sub.key}`}
                                labelName={`${sub.name}`}
                                value={sub.isChecked}
                                onChange={() => medicalOptionHndler(index)}
                                isDisabled={isDisabled}
                                formgroupClassName="tw-py-2"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default VitalSigns