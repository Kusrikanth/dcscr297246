import {
  FavouriteIcon,
  Target01Icon,
  StarIcon,
  UserMultiple03Icon,
} from "@hugeicons-pro/core-stroke-standard";

import { rubricLevels } from "../DomainAssessment/helper";

export function getDomainIcon(domainName: string) {
  switch (domainName) {
    case "Physical Development":
      return FavouriteIcon;
    case "Cognitive Development":
      return Target01Icon;
    case "Language Development":
      return StarIcon;
    case "Social Development":
      return UserMultiple03Icon;
    case "Emotional Development":
      return FavouriteIcon;
    default:
      return StarIcon;
  }
}

export function getDomainDescription(domainName: string) {
  switch (domainName) {
    case "Physical Development":
      return "Outline the key abilities measured, such as gross motor skills, fine motor skills, and health awareness";
    case "Cognitive Development":
      return "Outline the key abilities measured, such as problem-solving, memory, and mathematical concepts";
    case "Language Development":
      return "Outline the key abilities measured, such as listening, speaking, reading, and writing skills";
    case "Social Development":
      return "Outline the key abilities measured, such as peer relationships, empathy, and cooperation";
    case "Emotional Development":
      return "Outline the key abilities measured, such as self-regulation, emotional expression, and resilience";
    default:
      return "Outline the key abilities measured, such as Awareness, Sensitivity, and Creativity";
  }
}

export function getDomainColor(domainName: string) {
  switch (domainName) {
    case "Physical Development":
      return "#dc3545";
    case "Cognitive Development":
      return "#6f42c1";
    case "Language Development":
      return "#198754";
    case "Social Development":
      return "#fd7e14";
    case "Emotional Development":
      return "#e83e8c";
    default:
      return "#6c757d";
  }
}

export { rubricLevels };
