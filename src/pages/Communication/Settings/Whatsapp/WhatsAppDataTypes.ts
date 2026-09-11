
export interface WhatsAppDataTypes {
  id: number;
  sno: string;
  templateName: string;
  templateFormate: string;
  alertName: string;
  dtlTemplateId: string;
  subject: string;
  recipientName: string;
  status: string;
}

export interface AddWhatsAppTemplateModalProps {
  modalData?: {
    [x: string]: any;
    id?: string;
    featureName?: string;
    templateName?: string;
    messageType?: string;
    title?: string;
    description?: string;
    sendType?: string;
  };
  isOpen: boolean;
  toggle: () => void;
}
export interface ITemplateData {
  id: number;
  [key: string]: any;
}