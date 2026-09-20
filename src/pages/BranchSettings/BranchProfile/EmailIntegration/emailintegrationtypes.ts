
//Index file types
export interface IEmailIntegrationProps {
    branchId: string,
}

/** One row of the branch mail configuration. */
export interface IEmailIntegration {
    id: number,
    instituteId: number,
    branchId: number,
    host: string,
    fromAddress: string,
    /** The encrypted / app password used by the SMTP client. */
    password: string,
    /** The actual mailbox account password. */
    actualPassword: string,
    port: number,
    rs: string,
    admissionFromAddress: string,
    admissionPassword: string,
    department: string,
    admissionMailId: string,
}

export interface IEmailIntegrationModalState {
    showModal: boolean,
    emailIntegrationId: (number | undefined),
    modalData: (IEmailIntegration | undefined)
}

export interface IUpdateEmailPasswordPayload {
    id: number,
    password: string,
    actualPassword: string,
    admissionPassword: string,
    rs: string,
}
