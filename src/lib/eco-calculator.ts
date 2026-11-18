import { EcoCalculationInput, EcoCalculationResult } from "./types";

export const EMISSION_FACTORS = {
  // kg CO2 per unit
  electricityKwh: 0.52, // Uzbekistan grid factor
  waterM3: 0.298, // Water pumping & sanitation
  transportKm: {
    petrol_car: 0.192,
    diesel_car: 0.171,
    hybrid: 0.105,
    ev: 0.053,
    bus: 0.068,
    metro: 0.028,
    bicycle: 0.0,
  },
  wasteKg: 1.8, // Landfill methane & decomposition equivalent
  treeAbsorptionPerYear: 21.77, // kg CO2 sequestered per mature tree per year
};

export const TARIFFS_UZS = {
  electricityPerKwh: 450, // Base tariff in Uzbekistan
  waterPerM3: 3100, // Drinking water with sewage
  transportPerKm: {
    petrol_car: 1100,
    diesel_car: 1050,
    hybrid: 650,
    ev: 180,
    bus: 120,
    metro: 100,
    bicycle: 0,
  },
  wastePerKg: 200,
};

export function calculateEcoImpact(input: EcoCalculationInput): EcoCalculationResult {
  const electricityCo2 = input.electricityKwh * EMISSION_FACTORS.electricityKwh;
  const waterCo2 = input.waterM3 * EMISSION_FACTORS.waterM3;
  const transportFactor =
    EMISSION_FACTORS.transportKm[input.transportType] ||
    EMISSION_FACTORS.transportKm.petrol_car;
  const transportCo2 = input.transportKm * transportFactor;
  const wasteCo2 = input.wasteKg * EMISSION_FACTORS.wasteKg;

  const totalCo2Kg = Math.round((electricityCo2 + waterCo2 + transportCo2 + wasteCo2) * 10) / 10;

  // Annual trees required = (Monthly CO2 * 12) / 21.77
  const treeOffsetNeeded = Math.max(1, Math.ceil((totalCo2Kg * 12) / EMISSION_FACTORS.treeAbsorptionPerYear));

  // Costs
  const electricityCost = input.electricityKwh * TARIFFS_UZS.electricityPerKwh;
  const waterCost = input.waterM3 * TARIFFS_UZS.waterPerM3;
  const transportCostRate =
    TARIFFS_UZS.transportPerKm[input.transportType] ||
    TARIFFS_UZS.transportPerKm.petrol_car;
  const transportCost = input.transportKm * transportCostRate;
  const wasteCost = input.wasteKg * TARIFFS_UZS.wastePerKg;

  const monthlyCostUzs = Math.round(electricityCost + waterCost + transportCost + wasteCost);

  // Potential monthly savings with 30% optimization
  const potentialSavingsUzs = Math.round(monthlyCostUzs * 0.28);

  // Eco Score calculation (0 to 100): benchmark is 300 kg CO2 / month
  let ecoScore = 100 - Math.min(80, Math.round((totalCo2Kg / 350) * 60));
  if (input.transportType === "bicycle" || input.transportType === "metro") {
    ecoScore = Math.min(100, ecoScore + 10);
  }
  if (input.wasteKg <= 10) {
    ecoScore = Math.min(100, ecoScore + 5);
  }

  // Actionable recommendations based on biggest emissions
  const recommendations: EcoCalculationResult["recommendations"] = [];

  if (electricityCo2 > 70) {
    recommendations.push({
      category: "energy",
      titleUz: "Quyosh suv isitgichi yoki kichik inverter o'rnating",
      titleRu: "Установите солнечный водонагреватель или микроинвертор",
      titleEn: "Install rooftop solar water heating or microinverter",
      impactUz: "Elektr sarfini 35% ga va CO₂ ni oyiga ~40 kg ga kamaytiradi",
      impactRu: "Снизит энергопотребление на 35% и выбросы на ~40 кг CO₂/мес",
      impactEn: "Reduces power usage by 35% and cuts ~40 kg CO₂/month",
      difficulty: "O'rta",
    });
    recommendations.push({
      category: "energy",
      titleUz: "Barcha xonalarda LED va sensorli yoritishga o'ting",
      titleRu: "Перейдите на LED-освещение с датчиками движения",
      titleEn: "Transition to high-efficiency LED with motion sensors",
      impactUz: "Yoritish xarajatlarini 80% gacha tejaydi",
      impactRu: "Экономия до 80% расходов на освещение",
      impactEn: "Saves up to 80% on household lighting load",
      difficulty: "Oson",
    });
  }

  if (waterCo2 > 3) {
    recommendations.push({
      category: "water",
      titleUz: "Kranlarga aerator moslamalari o'rnating",
      titleRu: "Установите водосберегающие аэраторы на смесители",
      titleEn: "Equip faucets with pressure aerators",
      impactUz: "Suv oqimini 45% tejaydi, bosim saqlanib qoladi",
      impactRu: "Экономит 45% воды без потери напора",
      impactEn: "Saves 45% water flow while maintaining high rinsing pressure",
      difficulty: "Oson",
    });
  }

  if (input.transportType === "petrol_car" || input.transportType === "diesel_car") {
    recommendations.push({
      category: "transport",
      titleUz: "Haftada 2 kun jamoat transporti yoki velosipeddan foydalaning",
      titleRu: "2 дня в неделю на метро, автобусе или велосипеде",
      titleEn: "Use public transit or cycling 2 days per week",
      impactUz: "Yoqilg'i xarajatlarini oyiga ~300,000 so'mga va CO₂ ni 60 kg ga qisqartiradi",
      impactRu: "Сэкономит ~300 000 сум и сократит выбросы на 60 кг CO₂",
      impactEn: "Saves ~300,000 UZS and abates 60 kg of CO₂ monthly",
      difficulty: "Oson",
    });
  }

  if (input.wasteKg > 15) {
    recommendations.push({
      category: "waste",
      titleUz: "Organik va quruq chiqindilarni alohida saralang",
      titleRu: "Разделяйте органические и сухие отходы",
      titleEn: "Sort organic scraps from dry recyclable packaging",
      impactUz: "Poligonlarga tushadigan chiqindi hajmini 65% ga kamaytiradi",
      impactRu: "Снижает объем мусора на свалках на 65%",
      impactEn: "Diverts up to 65% of household waste from landfills",
      difficulty: "O'rta",
    });
  }

  return {
    totalCo2Kg,
    electricityCo2: Math.round(electricityCo2 * 10) / 10,
    waterCo2: Math.round(waterCo2 * 10) / 10,
    transportCo2: Math.round(transportCo2 * 10) / 10,
    wasteCo2: Math.round(wasteCo2 * 10) / 10,
    treeOffsetNeeded,
    monthlyCostUzs,
    potentialSavingsUzs,
    ecoScore,
    recommendations,
  };
}
