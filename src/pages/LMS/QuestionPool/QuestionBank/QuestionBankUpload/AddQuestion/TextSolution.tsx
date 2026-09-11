import { CustomTipTapEditor } from "../../../../../../Components/Common";

const TextSolution = (props: any) => {

    const { parentForm, parentFormHelpers } = props;

    const onChangeQuillHndlr = (content: any) => {
        if (parentFormHelpers) {
            parentFormHelpers.setFieldValue("textSolution", content);
        }
    }

    return (
        <>
            <div className=''>
                <div className='row'>
                    {/* <div className='col-12 px-0'>
                        <TextArea
                            name="textSolution"
                            value={updatePriorityForm.values.textSolution}
                            onChange={(e: any) => {
                                updatePriorityForm.handleChange(e);
                                if (parentFormHelpers) {
                                    parentFormHelpers.setFieldValue("textSolution", e.target.value);
                                }
                            }}
                            formgroupClassName="mb-0"
                            placeHolder="Type your Solution here"
                        />
                    </div> */}

                    <div className='col-12 lms lms_tiptap_editor'>
                        <CustomTipTapEditor
                            name="textSolution"
                            value={parentForm?.values?.textSolution || ""}
                            onChange={onChangeQuillHndlr}
                            placeHolder="Type your Solution here"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default TextSolution