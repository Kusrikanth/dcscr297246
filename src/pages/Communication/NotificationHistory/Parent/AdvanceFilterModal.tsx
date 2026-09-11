import React, { useState } from 'react'
import { CustomSelect, SelectInput } from '../../../../Components/Common';
import { notificationType, renderOptionsRoute, renderValueRoute } from './helper';
import { getOptions } from '../Employee/helper';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    notificationType: null,
    templateId: null,
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState(props.filterState || initialValues);
    const applyFilterHndlr = () => {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter();
    };

    const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAdvanceFilterState((prev: typeof initialValues) => ({ ...prev, [name]: value }))
    }

    function selectRouteHndlr(selectedOptions: any, config?: any) {
        const { name } = config;
        const data = props.getSmsTemplateListResp?.find((item: any) => +item.id === +selectedOptions);
        
        setAdvanceFilterState((prev: typeof initialValues) => ({ ...prev, templateId: selectedOptions }));
      }
    
    return (
        <>
             <div className="offcanvas-body">
                <div className="tw-mb-3">
                    <SelectInput
                        name="notificationType"
                        value={advanceFilterState.notificationType}
                        onChange={onChangeFilterHndlr}
                        menuItems={notificationType || []}
                        valueKey="value"
                        textKey="label"
                        formgroupClassName="tw-mb-0"
                        labelText="Notification Type"
                    />
                </div>

                <div>
                    <CustomSelect
                        name="templateId"
                        idKey="id"
                        labelText="SMS Template"
                        defaultSelect="Select"
                        value={advanceFilterState.templateId}
                        renderValue={renderValueRoute}
                        renderOptions={renderOptionsRoute}
                        onChange={selectRouteHndlr}
                        searchKey="smsTemplateName"
                        options={getOptions(props.getSmsTemplateListResp) || []}
                    />
                </div>
            </div>

            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        variant='primary'
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
