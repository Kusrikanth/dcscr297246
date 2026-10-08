export const communicationUrl = {
    get_manage_notificaiton: `/communication/api/send-messages/all`,
    get_curriculum_class_section: `/academic/api/class-section/v1/curriculum-classes-sections`,
    compose_message: `/communication/api/send-messages`,
    update_notification: ({ id }: any) => `/communication/api/send-messages/${id}`,
    delete_notification: ({ id }: any) => `/communication/api/send-messages/${id}`,

    //setting template
    get_template_list: `/communication/api/settings/template/v1/all`,
    save_template: `/communication/api/settings/template/v1/save`,
    delete_template: ({ id }: any) => `/communication/api/settings/template/v1/${id}`,
    update_template: ({ id }: any) => `/communication/api/settings/template/v1/${id}`,

    //feeds
    get_feeds_list: `/communication/api/feeds/all`,
    save_feeds: `/communication/api/feeds/save`,
    delete_feeds: ({ id }: any) => `/communication/api/feeds/${id}`,
    get_feeds_by_id: ({ id }: any) => `/communication/api/feeds/${id}`,
    update_feeds: ({ id }: any) => `/communication/api/feeds/${id}`,
    update_feeds_files: ({ id }: any) => `/communication/api/feeds/modifyFiles/${id}`,
    //events 
    get_event_list: `/communication/api/events/all`,
    save_event: `/communication/api/events/save`,
    delete_event: ({ id }: any) => `/communication/api/events/${id}`,
    get_event_by_id: ({ id }: any) => `/communication/api/events/${id}`,
    update_event: ({ id }: any) => `/communication/api/events/${id}`,
    update_files: ({ id }: any) => `/communication/api/events/modifyFiles/${id}`,

    //notification history
    get_sms_template_list: `/notification/api/notification/sms-templates`,
    get_notification_history: `/notification/api/notification/logs`,
    export_notification_history: `/notification/api/notification/export`,

    // gallery management
    get_gallery_management_list:`/communication/api/communication-service/gallery/all`,
    get_gallery_management_by_id:({galleryId}:any) => `/communication//api/communication-service/gallery/${galleryId}`,
    save_gallery_managament_item:`/communication/api/communication-service/gallery`,
    update_gallery_managament_item:({galleryId}:any) => `/communication//api/communication-service/gallery/${galleryId}`,
    get_gallery_category: `/communication/api/communication-service/gallery/category/all`,
    delete_gallery_managament_item:({galleryId}:any) => `/communication//api/communication-service/gallery/${galleryId}`,
    //whatsapp notifications
    whatsapp_templates: ({ branchId }: any) => `/notification/whatsapp/template/branch/${branchId}`,
    whatsapp_templates_v1: ({ branchId }: any) => `/notification/whatsapp/v1/template/branch/${branchId}`,
    send_whatsapp_message: `/communication/api/send-messages/send-whatsapp`,
    upload_whatsapp_media: ({ branchId, fileId, mediaType }: any) => `/communication/api/communication-service/files/upload-noti-file?branchId=${branchId}&fileId=${fileId || ""}&mediaType=${mediaType}`,
    get_whatsapp_campaign_stats: ({ branchId }: any) => `/communication/api/send-messages/campaign-stats?branchId=${branchId}`,
    get_campagin_overview_details: ({ waRequestId }: any) => `/communication/api/send-messages/campaign/overview/stats?waRequestId=${waRequestId}`,
    get_campagin_recipients_details: ({ waRequestId, recipientType, contact }: any) => `/communication/api/send-messages/campaign/recipient/stats?waRequestId=${waRequestId}&recipientType=${recipientType}&contact=${contact}`,
    whatsapp_notifcation_validate_students: `/academic/api/v1/students/valid-student-info`,

    // whatsapp settings
    get_whatsapp_settings_templates: `/communication/api/whatsAppSettings/templates/branch`,
    update_whatsapp_settings_template: `/communication/api/whatsAppSettings/templates/branch`,

    get_notifcation_campaign_recipient_list: `/communication/api/send-messages/campaign/recipient/stats`,
    export_notification_item_by_id : `/communication/api/send-messages/campaign/recipient/stats/export`
}