import Button from "../../Components/Common/Button"

const WarningModal = ({ toggle, submitHndler }: any) => {

    return (
        <div>
            <div className="tw-grid tw-grid-cols-1 tw-gap-3 tw-px-3 tw-pt-3">
                <div className="tw-col-span-1">
                    <ul className="tw-text-sm tw-text-red-500 tw-mb-0">
                        <li className="tw-mb-2">
                            Please ensure that full name with correct spellings are matching as
                            per records.
                        </li>
                        <li className="tw-mb-2">
                            Please ensure that date of birth is correct as per the dob
                            certificate.
                        </li>
                        <li>
                            No corrections will be entertained later. This data will be submitted
                            to the board.
                        </li>
                    </ul>
                </div>
            </div>

            <div className="tw-flex tw-justify-end tw-gap-3 tw-mx-3 tw-my-3">
                <Button
                    type="submit"
                    variant="secondary"
                    onClick={() => toggle()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    onClick={submitHndler}
                >
                    Submit
                </Button>
            </div>
        </div>
    )
}

export default WarningModal
