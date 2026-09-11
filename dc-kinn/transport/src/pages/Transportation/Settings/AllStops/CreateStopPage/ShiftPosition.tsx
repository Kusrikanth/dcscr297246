import React, { useEffect, useMemo } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { SelectInput } from "../../../../../Components/Common";
import Button from "../../../../../Components/Common/Button";

const initialValues = {
    stopPosition: "",
}

const validationSchema = Yup.object().shape({
    stopPosition: Yup.string().required("Stop position is required."),
});
export default function ShiftPosition(props: any) {
    const positionForm = useFormik({
        validationSchema,
        initialValues,
        onSubmit: (values) => {
            props.updatePositionHandler(values.stopPosition);
        },
    });

    useEffect(() => {
        const { stopInfo, stopsList } = props,
            { stopId } = stopInfo || {};
        if (props.isOpen && Array.isArray(stopsList)) {
            const { stopOrderSeq = "" } = stopsList.find((item: any) => item?.stopId?.toString() === stopId?.toString()) || {};
            positionForm.setFieldValue("stopPosition", stopOrderSeq?.toString());
        }
    }, [props.isOpen, props.stopsList]);

    const stopsOptions = useMemo(() => {
        const { stopsList } = props;
        if (Array.isArray(stopsList)) {
            return stopsList.filter(item => !item.isDeleted).map(item => {
                return ({
                    id: item?.stopOrderSeq,
                    name: item?.stopOrderSeq
                })
            })
        }
        return [];
    }, [props.stopsList]);

    return (
        <form onSubmit={positionForm.handleSubmit}>
            <div className="tw-pb-0 tw-p-4">
                <SelectInput
                    name="stopPosition"
                    labelText="Stop Position"
                    value={positionForm.values.stopPosition}
                    onChange={positionForm.handleChange}
                    menuItems={stopsOptions}
                    valueKey="id"
                    textKey="name"
                    formgroupClassName="tw-mb-3"
                    invalid={(positionForm.touched.stopPosition && positionForm.errors.stopPosition) ? true : false}
                    error={(positionForm.touched.stopPosition && positionForm.errors.stopPosition) ? positionForm.errors.stopPosition : ""}
                />
            </div>

            <div className="tw-border-t tw-p-4">
                <div className="tw-flex tw-justify-end tw-gap-2">
                    <Button
                        type="button"
                        onClick={props.closeModal}
                        variant="secondary"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </form>
    )
}