const allergyAliases = new Map([
  ["nsaid", "NSAID Allergy"],
  ["nsaidallergy", "NSAID Allergy"],
  ["aspirinallergy", "Aspirin Allergy"],
  ["paracetamolallergy", "Paracetamol Allergy"],
  ["penicillin", "Penicillin Allergy"],
  ["penicillinallergy", "Penicillin Allergy"],
  ["macrolideallergy", "Macrolide Allergy"],
  ["fluoroquinoloneallergy", "Fluoroquinolone Allergy"],
  ["tetracyclineallergy", "Tetracycline Allergy"],
  ["cephalosporinallergy", "Cephalosporin Allergy"],
  ["betalactamallergy", "Beta-lactam Allergy"],
  ["aminoglycosideallergy", "Aminoglycoside Allergy"],
  ["sulfaallergy", "Sulfa Allergy"],
  ["nitrateallergy", "Nitrate Allergy"],
  ["antihistamineallergy", "Antihistamine Allergy"]
]);

function key(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function normalizeAllergyTag(tag) {
  const normalizedKey = key(tag);
  return allergyAliases.get(normalizedKey) ?? String(tag ?? "").trim();
}

export function normalizeAllergyTags(tags = []) {
  return [...new Set(tags.map(normalizeAllergyTag).filter(Boolean))];
}

export function allergyMatches(reportedAllergies = [], medicineTags = []) {
  const normalizedReported = new Set(reportedAllergies.map(normalizeAllergyTag).map(key));
  return normalizeAllergyTags(medicineTags).find((tag) => normalizedReported.has(key(tag)));
}

export function inferMedicineCategory(medicine) {
  const haystack = `${medicine.name ?? ""} ${medicine.genericName ?? ""} ${medicine.notes ?? ""}`.toLowerCase();

  const checks = [
    ["Antibiotic", /amoxicillin|augmentin|azithro|zithromax|cipro|levo|tavanic|cef|clavulan|metronidazole|doxy|clinda|erythro|clarithro|linezolid|meropenem|vancomycin|gentamicin|amikacin|chloramphenicol|fusidic|fucidin|mupirocin|septran|trimethoprim|velosef|klaricid|polymyxin|bacitracin/],
    ["Pain and Fever", /paracetamol|acetaminophen|ibuprofen|aspirin|diclofenac|naproxen|mefenamic|tramadol|codeine|morphine|celecoxib|ponstan|brufen|voltral|synflex|calpol|arinac/],
    ["Allergy", /cetirizine|loratadine|fexofenadine|diphenhydramine|chlorpheniramine|promethazine|pheniramine|ebastine|rigix|telfast|zyrtec|piriton|phenergan|kestine|brozeet|avil/],
    ["Respiratory", /salbutamol|albuterol|montelukast|salmeterol|formoterol|fluticasone|budesonide|ipratropium|ambroxol|dextromethorphan|guaifenesin|pseudoephedrine|ventolin|seretide|symbicort|pulmicort|duolin|pulmonol|cough|asthma|wheezing/],
    ["Gastric", /omeprazole|esomeprazole|pantoprazole|ranitidine|domperidone|loperamide|ors|ondansetron|metoclopramide|lactulose|diosmectite|alginate|hyoscine|phloroglucinol|diloxanide|gaviscon|motilium|duphalac|smecta|imodium|zofran|buscopan|maxolon|spasfon|entamizole|gastric|acidity|diarrhea|nausea|constipation/],
    ["Diabetes", /metformin|glibenclamide|glimepiride|gliclazide|insulin|aspart|lispro|vildagliptin|sitagliptin|empagliflozin|dapagliflozin|glucophage|daonil|galvus|januvia|jardiance|forxiga|novorapid|humalog|lantus|mixtard|diabetes|blood sugar/],
    ["Heart and Blood Pressure", /warfarin|clopidogrel|heparin|rivaroxaban|apixaban|bisoprolol|amlodipine|furosemide|hydrochlorothiazide|spironolactone|losartan|atenolol|ramipril|perindopril|lisinopril|hydralazine|isosorbide|concor|cozaar|tritace|coversyl|zestril|aldactone|xarelto|eliquis|isordil|norvasc|lasix|blood pressure|heart|anticoagulant|blood clot/],
    ["Cholesterol", /atorvastatin|simvastatin|rosuvastatin|ezetimibe|statin|crestor|ezetrol|cholesterol/],
    ["Skin and Topical", /cream|gel|ointment|lotion|hydrocortisone|betamethasone|clotrimazole|terbinafine|sulfadiazine|calamine|canesten|topical|skin|burn/],
    ["Eye and ENT", /eye drops|nasal|xylometazoline|otrivin|artificial tears|carboxymethylcellulose|blocked nose/],
    ["Supplement", /vitamin|calcium|iron|ascorbic|cholecalciferol|ferrous|folic|zinc|neurobion|supplement|cac 1000/],
    ["Mental Health", /diazepam|alprazolam|sertraline|fluoxetine|escitalopram|amitriptyline|gabapentin|pregabalin|carbamazepine|phenytoin|valproate|anxiety|depression|panic|seizure|epilepsy|nerve pain/],
    ["Antiparasitic", /albendazole|mebendazole|ivermectin|malaria|malarial|coartem|hydroxychloroquine|worm|parasitic/]
  ];

  return checks.find(([, pattern]) => pattern.test(haystack))?.[0] ?? "General";
}

export function enhanceMedicine(medicine) {
  return {
    ...medicine,
    category: medicine.category ?? inferMedicineCategory(medicine),
    allergyTags: normalizeAllergyTags(medicine.allergyTags)
  };
}
