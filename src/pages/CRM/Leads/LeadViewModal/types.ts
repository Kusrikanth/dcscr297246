export interface LeadViewOption {
    id: string;
    name: string;
}

export type LeadDetailsState = {
    touchStatus: LeadViewOption[];
    leadAddedVia: LeadViewOption[];
    branch: LeadViewOption[];
    currentStage: LeadViewOption[];
    subStage: LeadViewOption[];
    leadSource: LeadViewOption[];
    counsellorReferredTo: LeadViewOption[];
    campaignCategory: LeadViewOption[];
    campaignName: LeadViewOption[];
    channelCategory: LeadViewOption[];
    channel: LeadViewOption[];
}

export type LeadDetailsFieldName = keyof LeadDetailsState;

export interface LeadDetailsField {
    id: LeadDetailsFieldName;
    labelName: string;
    defaultSelect: string;
    options: LeadViewOption[];
}

export type AcademicDetailsState = {
    className: LeadViewOption[];
    curriculum: LeadViewOption[];
    admissionType: LeadViewOption[];
    referredFrom: LeadViewOption[];
}

export type AcademicDetailsFieldName =
    keyof AcademicDetailsState;

export interface AcademicDetailsField {
    id: AcademicDetailsFieldName;
    labelName: string;
    defaultSelect: string;
    options: LeadViewOption[];
}

export interface CommunicationDetailsState {
    studentName: string;
    primaryPhone: string;
    alternatePhone: string;
    email: string;
    parentName: string;
}

export type CommunicationDetailsFieldName =
    keyof CommunicationDetailsState;

export interface CommunicationDetailsField {
    id: CommunicationDetailsFieldName;
    labelName: string;
    placeHolder: string;
    inputType?: "text" | "number";
}

export interface RangeFiltersState {
    minimumLeadScore: string;
    maximumLeadScore: string;
}

export type MarketingCampaignsState = {
    bulkMarketingCampaign: LeadViewOption[];
    whatsappDeliveryStatus: LeadViewOption[];
}

export type MarketingCampaignsFieldName =
    keyof MarketingCampaignsState;

export interface MarketingCampaignsField {
    id: MarketingCampaignsFieldName;
    labelName: string;
    defaultSelect: string;
    options: LeadViewOption[];
}

export interface DateRangeValue {
    startDate: string;
    endDate: string;
}

export interface DateFiltersState {
    added: DateRangeValue;
    updated: DateRangeValue;
    referred: DateRangeValue;
    nextFollowUp: DateRangeValue;
    reEnquired: DateRangeValue;
}

export type DateFiltersFieldName = keyof DateFiltersState;

export interface DateFiltersField {
    id: DateFiltersFieldName;
    labelName: string;
    placeholder: string;
}
