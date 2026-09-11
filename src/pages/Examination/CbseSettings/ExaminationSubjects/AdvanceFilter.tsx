import { useState } from "react";
import { SelectInput } from "../../../../Components/Common";
import { coScholasticSubjects, scholasticSubjects, subjectType } from "./helper";

const initialValues = {
   subjectType: "SCHOLASTIC",
   scholasticType: "",
   coScholasticType: "",
};

const AdvanceFilterModal = (props: any) => {

    const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAdvanceFilterState((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const applyFilterHndlr = () => {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter();
    };
    
    return (
        <>
            <div className="offcanvas-body">
                <div className="col-md-12 mb-3">
                    <SelectInput
                        name="subjectType"
                        value={advanceFilterState.subjectType}
                        onChange={filterHandler}
                        menuItems={subjectType}
                        formgroupClassName="mb-0 "
                        valueKey="id"
                        textKey="name"
                        labelText="Subject Type"
                    />
                </div>
                <div className="col-md-12 mb-3">
                    {advanceFilterState.subjectType === "COSCHOLASTIC" ?
                        <SelectInput
                            name="coScholasticType"
                            value={advanceFilterState.coScholasticType}
                            onChange={filterHandler}
                            formgroupClassName="mb-0"
                            menuItems={coScholasticSubjects}
                            valueKey="id"
                            textKey="name"
                            labelText="Coscholastic Type"
                        />
                        :
                        <SelectInput
                            name="scholasticType"
                            value={advanceFilterState.scholasticType}
                            onChange={filterHandler}
                            formgroupClassName="mb-0"
                            menuItems={scholasticSubjects}
                            valueKey="id"
                            textKey="name"
                            labelText="Scholastic Type"
                        />
                    }
                </div>
            </div>
            <div className="border-top p-2 text-center">
                <div className="hstack gap-2 justify-content-end">
                    <button
                        type="submit"
                        onClick={applyFilterHndlr}
                        className="btn btn-success"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdvanceFilterModal;
