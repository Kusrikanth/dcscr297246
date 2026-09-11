export interface PvaReportsTypes {
    // settings
    getPvaSubjectResp: any;
    savePvaSubjectResp: any;
    updatePvaSubjectResp: any;
    getPvaSubjectByIdResp: any;
    deletePvaSubjectResp: any;
    getPvaGradeEntrySubjectResp: any;

    // PVA Skill Area
    getPvaSkillAreaResp: any;
    savePvaSkillAreaResp: any;
    getPvaSkillAreaByIdResp: any;
    deletePvaSkillAreaResp: any;

    //PVA Grades
    getPvaGradesResp: any;
    savePvaGradesResp: any;
    updatePvaGradesResp: any;
    getPvaGradesByIdResp: any;
    deletePvaGradesResp: any;

    //PVA Subject to Class Mapping
    getPvaSubjecttoClassMappingResp: any;
    savePvaSubjecttoClassMappingResp: any;
    updatePvaSubjecttoClassMappingResp: any;
    getPvaSubjecttoClassMappingByIdResp: any;
    deletePvaSubjecttoClassMappingResp: any;

    //Management

    //Grade Entry
    getPvaStudentGradeEntryListResp: any;
    savePvaStudentGradeEntryListResp: any;

    // Green Report Card grade config
    getGreenReportCardGradeConfigResp: any;
    getGreenReportCardGradeConfigByIdResp: any;
    saveGreenReportCardGradeConfigResp: any;
    deleteGreenReportCardGradeConfigResp: any;

    // Green Report Card Category
    getGreenReportCardCategoryListResp: any;
    getGreenReportCardCategoryByIdResp: any;
    saveGreenReportCardCategoryItemResp: any;
    updateGreenReportCardCategoryItemResp: any;
    deleteGreenReportCardCategoryItemResp: any;

    // Green Report Card Mangement 
    getCategorySelectionListResp: any;
    saveCategorySelectionResp: any;
    getCategorySelectionByIdResp: any;
    updateCategorySelectionResp: any;
    deleteCategorySelectionResp: any;

    //Green Grade Entry
    getAllGreenReportGradeEntryStntsListResp:any,
    getGreenReportGradeEntryStntByIdResp:any,
    saveGreenReportGradeResp:any,

    // --->>> DISCIPLE <<<---

    // Domains
    getDisciplineSettingsDomainsResp:any;
    getDisciplineSettingsDomainItemByIdResp:any;
    saveDisciplineSettingsDomainItemByIdResp:any;
    updateDisciplineSettingsDomainItemByIdResp:any;
    delDisciplineSettingsDomainItemByIdResp:any;
    
    // Sub Domains
    getDisciplineSettingsSubDomainsResp:any;
    getDisciplineSettingsSubDomainItemByIdResp:any;
    saveDisciplineSettingsSubDomainItemByIdResp:any;
    updateDisciplineSettingsSubDomainItemByIdResp:any;
    delDisciplineSettingsSybDomainItemByIdResp:any;

    //Grade Config
    getDisciplineGradeConfigListResp: any;
    saveDisciplineGradeConfigListResp: any;
    delDisciplineGradeConfigListResp: any;


    //Error
    pvaReportsErrorAct: any;
}
