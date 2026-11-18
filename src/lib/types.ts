export type Language = "uz" | "ru" | "en";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  avatar?: string | null;
  level: number;
  xp: number;
  ecoScore: number;
}

export interface EcoCalculationInput {
  electricityKwh: number;
  waterM3: number;
  transportKm: number;
  transportType: "petrol_car" | "diesel_car" | "hybrid" | "ev" | "bus" | "metro" | "bicycle";
  wasteKg: number;
}

export interface EcoCalculationResult {
  totalCo2Kg: number;
  electricityCo2: number;
  waterCo2: number;
  transportCo2: number;
  wasteCo2: number;
  treeOffsetNeeded: number;
  monthlyCostUzs: number;
  potentialSavingsUzs: number;
  ecoScore: number;
  recommendations: {
    category: "energy" | "water" | "transport" | "waste";
    titleUz: string;
    titleRu: string;
    titleEn: string;
    impactUz: string;
    impactRu: string;
    impactEn: string;
    difficulty: "Oson" | "O'rta" | "Yuqori";
  }[];
}

export interface GreenBusinessIdea {
  id: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  categoryUz: string;
  categoryRu: string;
  categoryEn: string;
  problemUz: string;
  problemRu: string;
  problemEn: string;
  solutionUz: string;
  solutionRu: string;
  solutionEn: string;
  resourcesUz: string;
  resourcesRu: string;
  resourcesEn: string;
  investmentUzs: string;
  paybackPeriod: string;
  revenueModelUz: string;
  revenueModelRu: string;
  revenueModelEn: string;
  ecoBenefitUz: string;
  ecoBenefitRu: string;
  ecoBenefitEn: string;
  icon: string;
}
