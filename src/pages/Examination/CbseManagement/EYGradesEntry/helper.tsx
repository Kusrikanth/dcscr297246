import { useLocation } from "react-router-dom";

export const getPayload = (name: string, formValues: any, tableData: any, isEy: boolean, isIgcse: boolean) => {
  const { academicYearId, curriculumId, classId, termId, sectionId , branchId } = formValues || {};

  let academicPerformanceDtos: any[] = [];
  let creativeExpressionDtos: any[] = [];
  let softSportSkillsDtos: any[] = [];
  let entryLearnerDtos: any[] = [];
  let cambridgeLearnerDto: any[] = [];
  let secondLanguageDtos: any[] = [];

  tableData.forEach((student: any) => {
    const studentData = {
      id: student.id,
      instituteId: student.instituteId,
      studentId: student.studentId,
      studentCode: student.studentCode,
      studentName: student.studentName,
      approval: student.approval || null,
      totalWorkingDays: student.totalWorkingDays,
      totalAttendedDays: student.totalAttendedDays,
    };

    switch (name) {
      case "learningSubject":
        academicPerformanceDtos.push({
          ...studentData,
          listeningId: student.listeningId,
          speakingId: student.speakingId,
          readingId: student.readingId,
          writingId: student.writingId,
          mathematicsId: student.mathematicsId,
          understandingWorldId: student.understandingWorldId,
          personalSocialEmotionalId: student.personalSocialEmotionalId,
          physicalDvptId: student.physicalDvptId,
        });
        break;

      case "creativeExprissions":
        creativeExpressionDtos.push({
          ...studentData,
          artAndDesignId: student.artAndDesignId,
          musicId: student.musicId,
          danceId: student.danceId,
          dramaId: student.dramaId,
          valuesAndLifeSkillsId: student.valuesAndLifeSkillsId,
          // craftModelAndMakingId: student.craftModelAndMakingId,
          yogaFormsId: student.yogaFormsId,
          celebrationId: student.celebrationId,
          oracyId: student.oracyId,
        });
        break;

      case "softSportSkills":
        softSportSkillsDtos.push({
          ...studentData,
          basketballId: student.basketballId,
          footballId: student.footballId,
          rifleShootingId: student.rifleShootingId,
          lawnTennisId: student.lawnTennisId,
          cricketId: student.cricketId,
          taekwondoId: student.taekwondoId,
          volleyballId: student.volleyballId,
          skatingId: student.skatingId,
          pePracticalId: student.pePracticalId,
          swimmingId: student.swimmingId,
          punctualityId: student.punctualityId,
          communicationId: student.communicationId,
          adaptabilityId: student.adaptabilityId,
          cheerfulId: student.cheerfulId,
          assignmentId: student.assignmentId,
          peTheoryId: student.peTheoryId,
          fieldGameId: student.fieldGameId,
          athleticsId: student.athleticsId,
        });
        break;
      case "cambridgeLearnerAttribute":
    const learnerObj = {
      ...studentData,
      workingInfoId: student.workingInfoId,
      responsibleId: student.responsibleId,
      reflectiveId: student.reflectiveId,
      innovativeId: student.innovativeId,
      engageId: student.engageId,
    };

    if (isEy) {
      entryLearnerDtos.push(learnerObj);
    } else if (isIgcse) {
      cambridgeLearnerDto.push(learnerObj);
    }
    break;
      case "secondLanguage":
        secondLanguageDtos.push({
          ...studentData,
          listeningId: student.listeningId,
          speakingId: student.speakingId,
          readingId: student.readingId,
          writingId: student.writingId,
        });
        break;

      default:
        break;

    }
  })

  const payload = {
    branchId,
    academicYearId,
    curriculumId,
    classId,
    termId,
    sectionId,
    gradeType:
      name === "learningSubject"
        ? "ACADEMIC_PERFORMANCE"
        : name === "creativeExprissions"
          ? "CREATIVE_EXPRESSION"
        : name === "softSportSkills"
          ? "SOFT_SPORT_SKILLS"
        : name === "softSportSkills"
          ? "SOFT_SPORT_SKILLS"
          : name === "cambridgeLearnerAttribute"
            ? (isIgcse ? "CAMBRIDGE_ENTRY_LEARNER" : "ENTRY_LEARNER")
            : name === "secondLanguage"
              ? "SECOND_LANGUAGE"
              : "",
    academicPerformanceDtos: academicPerformanceDtos.length ? academicPerformanceDtos : undefined,
    creativeExpressionDtos: creativeExpressionDtos.length ? creativeExpressionDtos : undefined,
    // sportSkillsDtos: sportSkillsDtos.length ? sportSkillsDtos : undefined,
    softSportSkillsDtos: softSportSkillsDtos.length ? softSportSkillsDtos : undefined,
    ...(isEy && { entryLearnerDtos: entryLearnerDtos.length ? entryLearnerDtos : undefined }),
  ...(isIgcse && { cambridgeLearnerDto: cambridgeLearnerDto.length ? cambridgeLearnerDto : undefined }),
    secondLanguageDtos: secondLanguageDtos.length ? secondLanguageDtos : undefined,
  };
  return payload
  
}

export const getIgcseSkillEntryPayload = (skillEntryId: any, tableData: any, formValues: any) => {
  const { academicYearId, curriculumId, classId, termId, sectionId, branchId } = formValues || {};

  return {
    branchId,
    academicYearId,
    curriculumId,
    classId,
    termId,
    sectionId,
    skillEntryId,
    students: (tableData || []).map((student: any) => {
      const attributeKeys = Object.keys(student).filter(
        (key) => key.startsWith("attributeId") && !isNaN(Number(key.replace("attributeId", "")))
      );

      const attributes = attributeKeys
        .map((key) => {
          const keyNum = Number(key.replace("attributeId", ""));
          const raw = student[key];

          const skillSetGradeId =
            raw === undefined || raw === null || raw === "" ? null : Number(raw);

          if (skillSetGradeId === null) return null;

          const existing = (student.attributes || []).find(
            (a: any) => Number(a.id) === keyNum || Number(a.attributeId) === keyNum
          );

          return {
            attributeId: existing?.attributeId != null ? Number(existing.attributeId) : keyNum,
            ...(existing?.id != null ? { id: Number(existing.id) } : {}),
            skillSetGradeId,
          };
        })
        .filter(Boolean);

      return {
        studentId: Number(student.studentId),
        attributes,
      };
    }),
  };
};


export const ignoredKeys = ["searchString", "academicYearId"];