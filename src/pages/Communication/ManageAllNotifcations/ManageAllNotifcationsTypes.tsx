  export interface ManageAllNotifcationsDataTypes {
    id: number;
    module: string;
    description: string;
    publisherName: string;
    publisherId: string;
    communicationMode: string;
    sendTo: string;
    triggerDate: string;
    status: string;
   }
  export interface StatusCommunicationLogsDataTypes {
    id: number;
    tittle: string;
    channel: string;
    recipients: string;
    inProgress: string;
    deliveried: string;
    failed: string;
    totalSms: string;
    delivery: string;
    sendDate: string;
   }

   export interface Student {
    id: string;
  }
  
  export interface Employee {
    id: string;
  }