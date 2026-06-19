const baseMedicineCombinations = [
  {
    id: 1,
    medicines: ["Paracetamol", "Ibuprofen"],
    type: "safe",
    severity: "low",
    notes: "Commonly used together for fever and pain management."
  },
  {
    id: 2,
    medicines: ["Paracetamol", "Amoxicillin"],
    type: "safe",
    severity: "low",
    notes: "Frequently prescribed together for infections with fever."
  },
  {
    id: 3,
    medicines: ["Ibuprofen", "Warfarin"],
    type: "dangerous",
    severity: "high",
    notes: "Increased risk of bleeding and stomach ulceration."
  },
  {
    id: 4,
    medicines: ["Aspirin", "Warfarin"],
    type: "dangerous",
    severity: "critical",
    notes: "Major bleeding risk due to dual anticoagulant effect."
  },
  {
    id: 5,
    medicines: ["Disprin", "Warfarin"],
    type: "dangerous",
    severity: "critical",
    notes: "High bleeding risk when combined."
  },
  {
    id: 6,
    medicines: ["Brufen", "Ponstan"],
    type: "dangerous",
    severity: "high",
    notes: "Both are NSAIDs and may cause gastric bleeding."
  },
  {
    id: 7,
    medicines: ["Ibuprofen", "Diclofenac"],
    type: "dangerous",
    severity: "high",
    notes: "Combining NSAIDs increases stomach and kidney risk."
  },
  {
    id: 8,
    medicines: ["Ibuprofen", "Naproxen"],
    type: "dangerous",
    severity: "high",
    notes: "Avoid combining multiple NSAIDs."
  },
  {
    id: 9,
    medicines: ["Augmentin", "Flagyl"],
    type: "safe",
    severity: "moderate",
    notes: "Used together in mixed bacterial infections."
  },
  {
    id: 10,
    medicines: ["Metronidazole", "Warfarin"],
    type: "dangerous",
    severity: "high",
    notes: "Metronidazole increases warfarin blood-thinning effect."
  },
  {
    id: 11,
    medicines: ["Azithromycin", "Warfarin"],
    type: "warning",
    severity: "moderate",
    notes: "May increase bleeding tendency."
  },
  {
    id: 12,
    medicines: ["Ciprofloxacin", "Warfarin"],
    type: "dangerous",
    severity: "high",
    notes: "Can significantly increase INR and bleeding risk."
  },
  {
    id: 13,
    medicines: ["Levofloxacin", "Warfarin"],
    type: "dangerous",
    severity: "high",
    notes: "Potential bleeding complications."
  },
  {
    id: 14,
    medicines: ["Rigix", "Benadryl Syrup"],
    type: "warning",
    severity: "moderate",
    notes: "May increase drowsiness and sedation."
  },
  {
    id: 15,
    medicines: ["Benadryl Syrup", "Corex Syrup"],
    type: "warning",
    severity: "moderate",
    notes: "Both may cause excessive drowsiness."
  },
  {
    id: 16,
    medicines: ["Ventolin Syrup", "Montelukast"],
    type: "safe",
    severity: "low",
    notes: "Common asthma treatment combination."
  },
  {
    id: 17,
    medicines: ["Glucophage", "Daonil"],
    type: "safe",
    severity: "moderate",
    notes: "Common diabetes treatment combination."
  },
  {
    id: 18,
    medicines: ["Metformin", "Insulin Glargine"],
    type: "safe",
    severity: "moderate",
    notes: "Frequently used together in diabetes control."
  },
  {
    id: 19,
    medicines: ["Glimepiride", "Insulin Glargine"],
    type: "warning",
    severity: "moderate",
    notes: "May increase risk of hypoglycemia."
  },
  {
    id: 20,
    medicines: ["Losec", "Nexum"],
    type: "duplicate",
    severity: "moderate",
    notes: "Both are proton pump inhibitors; duplicate therapy."
  },
  {
    id: 21,
    medicines: ["Omeprazole", "Pantoprazole"],
    type: "duplicate",
    severity: "moderate",
    notes: "Avoid using two PPIs together."
  },
  {
    id: 22,
    medicines: ["Concor", "Atenolol"],
    type: "dangerous",
    severity: "high",
    notes: "Both are beta blockers and may cause low heart rate."
  },
  {
    id: 23,
    medicines: ["Norvasc", "Concor"],
    type: "safe",
    severity: "moderate",
    notes: "Common blood pressure management combination."
  },
  {
    id: 24,
    medicines: ["Lasix", "Hydrochlorothiazide"],
    type: "warning",
    severity: "moderate",
    notes: "May cause dehydration and electrolyte imbalance."
  },
  {
    id: 25,
    medicines: ["Atorvastatin", "Azithromycin"],
    type: "warning",
    severity: "moderate",
    notes: "Risk of muscle toxicity may increase."
  },
  {
    id: 26,
    medicines: ["Simvastatin", "Clarithromycin"],
    type: "dangerous",
    severity: "high",
    notes: "Can cause severe muscle breakdown."
  },
  {
    id: 27,
    medicines: ["Tramadol", "Diazepam"],
    type: "dangerous",
    severity: "high",
    notes: "Can suppress breathing and increase sedation."
  },
  {
    id: 28,
    medicines: ["Morphine", "Alprazolam"],
    type: "dangerous",
    severity: "critical",
    notes: "Very high risk of respiratory depression."
  },
  {
    id: 29,
    medicines: ["Codeine", "Benadryl Syrup"],
    type: "warning",
    severity: "moderate",
    notes: "Increased drowsiness and breathing suppression risk."
  },
  {
    id: 30,
    medicines: ["Sertraline", "Tramadol"],
    type: "dangerous",
    severity: "high",
    notes: "Risk of serotonin syndrome."
  },
  {
    id: 31,
    medicines: ["Fluoxetine", "Tramadol"],
    type: "dangerous",
    severity: "high",
    notes: "Increased seizure and serotonin syndrome risk."
  },
  {
    id: 32,
    medicines: ["Ondansetron", "Azithromycin"],
    type: "warning",
    severity: "moderate",
    notes: "May affect heart rhythm (QT prolongation)."
  },
  {
    id: 33,
    medicines: ["Domperidone", "Azithromycin"],
    type: "dangerous",
    severity: "high",
    notes: "Can increase risk of abnormal heart rhythm."
  },
  {
    id: 34,
    medicines: ["ORS", "Loperamide"],
    type: "safe",
    severity: "low",
    notes: "Common diarrhea treatment combination."
  },
  {
    id: 35,
    medicines: ["Vitamin D3", "Calcium Carbonate"],
    type: "safe",
    severity: "low",
    notes: "Supports bone health and calcium absorption."
  },
  {
    id: 36,
    medicines: ["Iron Supplement", "Calcium Carbonate"],
    type: "warning",
    severity: "low",
    notes: "Calcium may reduce iron absorption."
  },
  {
    id: 37,
    medicines: ["Levothyroxine", "Iron Supplement"],
    type: "warning",
    severity: "moderate",
    notes: "Iron decreases levothyroxine absorption."
  },
  {
    id: 38,
    medicines: ["Levothyroxine", "Calcium Carbonate"],
    type: "warning",
    severity: "moderate",
    notes: "Calcium can reduce thyroid medicine absorption."
  },
  {
    id: 39,
    medicines: ["Paracetamol", "Tramadol"],
    type: "safe",
    severity: "moderate",
    notes: "Often prescribed together for pain management."
  },
  {
    id: 40,
    medicines: ["Paracetamol", "Codeine"],
    type: "safe",
    severity: "moderate",
    notes: "Common combination for moderate pain relief."
  },
  {
    id: 41,
    medicines: ["Amoxicillin", "Clindamycin"],
    type: "warning",
    severity: "moderate",
    notes: "Combination may increase GI side effects."
  },
  {
    id: 42,
    medicines: ["Doxycycline", "Iron Supplement"],
    type: "warning",
    severity: "moderate",
    notes: "Iron reduces doxycycline absorption."
  },
  {
    id: 43,
    medicines: ["Ciprofloxacin", "Calcium Carbonate"],
    type: "warning",
    severity: "moderate",
    notes: "Calcium reduces ciprofloxacin effectiveness."
  },
  {
    id: 44,
    medicines: ["Levofloxacin", "Iron Supplement"],
    type: "warning",
    severity: "moderate",
    notes: "Iron decreases antibiotic absorption."
  },
  {
    id: 45,
    medicines: ["Aspirin", "Clopidogrel"],
    type: "warning",
    severity: "high",
    notes: "Dual blood-thinning effect increases bleeding risk."
  },
  {
    id: 46,
    medicines: ["Clopidogrel", "Warfarin"],
    type: "dangerous",
    severity: "critical",
    notes: "Very high bleeding risk."
  },
  {
    id: 47,
    medicines: ["Heparin", "Warfarin"],
    type: "dangerous",
    severity: "critical",
    notes: "Requires strict monitoring due to bleeding risk."
  },
  {
    id: 48,
    medicines: ["Prednisone", "Ibuprofen"],
    type: "warning",
    severity: "moderate",
    notes: "Increased risk of stomach irritation and ulcers."
  },
  {
    id: 49,
    medicines: ["Prednisone", "Diclofenac"],
    type: "warning",
    severity: "moderate",
    notes: "Can increase gastrointestinal bleeding risk."
  },
  {
    id: 50,
    medicines: ["Loratadine", "Montelukast"],
    type: "safe",
    severity: "low",
    notes: "Common allergy and asthma combination."
  },
  {
    id: 51,
    medicines: ["Warfarin", "Cefixime"],
    type: "warning",
    severity: "moderate",
    notes: "Some antibiotics can alter Warfarin response; INR monitoring may be needed."
  },
  {
    id: 52,
    medicines: ["Warfarin", "Ceftriaxone Injection"],
    type: "warning",
    severity: "high",
    notes: "Ceftriaxone may increase anticoagulant effect in some patients."
  },
  {
    id: 53,
    medicines: ["Warfarin", "Erythromycin"],
    type: "dangerous",
    severity: "high",
    notes: "Erythromycin can increase Warfarin effect and bleeding risk."
  },
  {
    id: 54,
    medicines: ["Warfarin", "Clarithromycin"],
    type: "dangerous",
    severity: "high",
    notes: "Clarithromycin can increase bleeding risk with Warfarin."
  },
  {
    id: 55,
    medicines: ["Warfarin", "Klaricid"],
    type: "dangerous",
    severity: "high",
    notes: "Clarithromycin brands can increase bleeding risk with Warfarin."
  },
  {
    id: 56,
    medicines: ["Aspirin", "Ibuprofen"],
    type: "warning",
    severity: "high",
    notes: "Combining NSAIDs increases stomach bleeding risk and may reduce aspirin heart protection."
  },
  {
    id: 57,
    medicines: ["Disprin", "Brufen"],
    type: "warning",
    severity: "high",
    notes: "Both are NSAID-related medicines and may increase bleeding or gastric irritation."
  },
  {
    id: 58,
    medicines: ["Tramadol", "Alprazolam"],
    type: "dangerous",
    severity: "critical",
    notes: "Opioid-like pain medicine with benzodiazepines can cause dangerous sedation and breathing problems."
  },
  {
    id: 59,
    medicines: ["Morphine", "Diazepam"],
    type: "dangerous",
    severity: "critical",
    notes: "Strong opioid with benzodiazepine can suppress breathing."
  },
  {
    id: 60,
    medicines: ["Simvastatin", "Erythromycin"],
    type: "dangerous",
    severity: "high",
    notes: "Erythromycin can raise Simvastatin levels and increase muscle injury risk."
  },
  {
    id: 61,
    medicines: ["Atorvastatin", "Clarithromycin"],
    type: "warning",
    severity: "high",
    notes: "Clarithromycin may increase statin muscle toxicity risk."
  },
  {
    id: 62,
    medicines: ["Glucophage", "Mixtard Insulin"],
    type: "warning",
    severity: "moderate",
    notes: "Combination is common but blood sugar should be monitored for hypoglycemia."
  },
  {
    id: 63,
    medicines: ["Glucophage XR", "Mixtard Insulin"],
    type: "warning",
    severity: "moderate",
    notes: "Metformin with insulin can be effective but may require glucose monitoring."
  },
  {
    id: 64,
    medicines: ["Daonil", "Mixtard Insulin"],
    type: "warning",
    severity: "high",
    notes: "Sulfonylurea plus insulin may increase hypoglycemia risk."
  },
  {
    id: 65,
    medicines: ["Celebrex", "Warfarin"],
    type: "warning",
    severity: "high",
    notes: "Celecoxib with Warfarin may increase bleeding risk."
  },
  {
    id: 66,
    medicines: ["Voltral", "Warfarin"],
    type: "dangerous",
    severity: "high",
    notes: "Diclofenac with Warfarin increases bleeding and stomach ulcer risk."
  },
  {
    id: 67,
    medicines: ["Synflex", "Warfarin"],
    type: "dangerous",
    severity: "high",
    notes: "Naproxen with Warfarin increases bleeding risk."
  },
  {
    id: 68,
    medicines: ["Risek", "Controloc"],
    type: "duplicate",
    severity: "moderate",
    notes: "Both are proton pump inhibitors; duplicate therapy should be reviewed."
  },
  {
    id: 69,
    medicines: ["Zofran", "Azithromycin"],
    type: "warning",
    severity: "moderate",
    notes: "Both can affect heart rhythm in susceptible patients."
  },
  {
    id: 70,
    medicines: ["Motilium", "Erythromycin"],
    type: "dangerous",
    severity: "high",
    notes: "Domperidone with macrolides can increase abnormal heart rhythm risk."
  },
  {
    id: 71,
    medicines: ["Tritace", "Aldactone"],
    type: "warning",
    severity: "high",
    notes: "ACE inhibitor with spironolactone can increase potassium levels."
  },
  {
    id: 72,
    medicines: ["Coversyl", "Aldactone"],
    type: "warning",
    severity: "high",
    notes: "Perindopril with spironolactone may cause high potassium and kidney strain."
  },
  {
    id: 73,
    medicines: ["Zestril", "Aldactone"],
    type: "warning",
    severity: "high",
    notes: "Lisinopril with spironolactone requires potassium and kidney monitoring."
  },
  {
    id: 74,
    medicines: ["Cozaar", "Aldactone"],
    type: "warning",
    severity: "high",
    notes: "Losartan with spironolactone can raise potassium levels."
  },
  {
    id: 75,
    medicines: ["Xarelto", "Aspirin"],
    type: "dangerous",
    severity: "high",
    notes: "Rivaroxaban with aspirin increases bleeding risk."
  },
  {
    id: 76,
    medicines: ["Eliquis", "Disprin"],
    type: "dangerous",
    severity: "high",
    notes: "Apixaban with aspirin-containing medicines can increase bleeding risk."
  },
  {
    id: 77,
    medicines: ["Xarelto", "Brufen"],
    type: "dangerous",
    severity: "high",
    notes: "NSAIDs with oral anticoagulants increase bleeding and stomach ulcer risk."
  },
  {
    id: 78,
    medicines: ["Eliquis", "Voltral"],
    type: "dangerous",
    severity: "high",
    notes: "Diclofenac with apixaban may significantly increase bleeding risk."
  },
  {
    id: 79,
    medicines: ["Crestor", "Ezetrol"],
    type: "safe",
    severity: "low",
    notes: "Common cholesterol-lowering combination."
  },
  {
    id: 80,
    medicines: ["Crestor", "Clarithromycin"],
    type: "warning",
    severity: "moderate",
    notes: "Macrolides may increase statin side effects in some patients."
  },
  {
    id: 81,
    medicines: ["Diamicron MR", "Mixtard Insulin"],
    type: "warning",
    severity: "high",
    notes: "Sulfonylurea plus insulin can increase hypoglycemia risk."
  },
  {
    id: 82,
    medicines: ["Jardiance", "Forxiga"],
    type: "duplicate",
    severity: "moderate",
    notes: "Both are SGLT2 inhibitors; duplicate therapy should be reviewed."
  },
  {
    id: 83,
    medicines: ["Jardiance", "Glucophage"],
    type: "safe",
    severity: "low",
    notes: "Common type 2 diabetes combination when clinically appropriate."
  },
  {
    id: 84,
    medicines: ["Forxiga", "Glucophage XR"],
    type: "safe",
    severity: "low",
    notes: "Common diabetes combination with glucose and hydration monitoring."
  },
  {
    id: 85,
    medicines: ["Novorapid", "Humalog"],
    type: "duplicate",
    severity: "high",
    notes: "Both are rapid-acting insulins; duplicate therapy can cause hypoglycemia."
  },
  {
    id: 86,
    medicines: ["Novorapid", "Lantus"],
    type: "safe",
    severity: "moderate",
    notes: "Basal-bolus insulin regimens commonly combine rapid and long-acting insulin."
  },
  {
    id: 87,
    medicines: ["Humalog", "Lantus"],
    type: "safe",
    severity: "moderate",
    notes: "Rapid and long-acting insulin may be used together with glucose monitoring."
  },
  {
    id: 88,
    medicines: ["Zithromax", "Warfarin"],
    type: "warning",
    severity: "moderate",
    notes: "Azithromycin brands may increase bleeding tendency with warfarin."
  },
  {
    id: 89,
    medicines: ["Tavanic", "Warfarin"],
    type: "dangerous",
    severity: "high",
    notes: "Levofloxacin brands can increase INR and bleeding risk with warfarin."
  },
  {
    id: 90,
    medicines: ["Tavanic", "Iron Supplement"],
    type: "warning",
    severity: "moderate",
    notes: "Iron can reduce levofloxacin absorption."
  },
  {
    id: 91,
    medicines: ["Cefiget", "Warfarin"],
    type: "warning",
    severity: "moderate",
    notes: "Some cephalosporins may affect anticoagulant response."
  },
  {
    id: 92,
    medicines: ["Entamizole", "Warfarin"],
    type: "dangerous",
    severity: "high",
    notes: "Metronidazole-containing combinations can increase warfarin effect."
  },
  {
    id: 93,
    medicines: ["Maxolon", "Fluoxetine"],
    type: "warning",
    severity: "moderate",
    notes: "Combination may increase movement-related side effects or serotonin-related symptoms."
  },
  {
    id: 94,
    medicines: ["Symbicort Inhaler", "Ventolin Inhaler"],
    type: "safe",
    severity: "low",
    notes: "Maintenance and rescue inhalers are commonly used together in asthma care."
  },
  {
    id: 95,
    medicines: ["Seretide Inhaler", "Symbicort Inhaler"],
    type: "duplicate",
    severity: "moderate",
    notes: "Both are maintenance inhalers containing steroid and long-acting bronchodilator therapy."
  },
  {
    id: 96,
    medicines: ["Duolin Nebules", "Ventolin Inhaler"],
    type: "warning",
    severity: "moderate",
    notes: "Both provide beta-agonist bronchodilator effect and may increase tremor or fast heartbeat."
  },
  {
    id: 97,
    medicines: ["Avil", "Benadryl Syrup"],
    type: "warning",
    severity: "moderate",
    notes: "Multiple sedating antihistamines can cause excessive drowsiness."
  },
  {
    id: 98,
    medicines: ["Gabapentin", "Lyrica"],
    type: "duplicate",
    severity: "moderate",
    notes: "Both are gabapentinoids and may increase dizziness and sedation."
  },
  {
    id: 99,
    medicines: ["Lyrica", "Tramadol"],
    type: "warning",
    severity: "high",
    notes: "Combination can increase sedation and breathing-related risk."
  },
  {
    id: 100,
    medicines: ["Gabapentin", "Morphine"],
    type: "dangerous",
    severity: "high",
    notes: "Gabapentin with opioids may increase sedation and respiratory depression risk."
  },
  {
    id: 101,
    medicines: ["Tegretol", "Warfarin"],
    type: "warning",
    severity: "high",
    notes: "Carbamazepine can reduce warfarin effect and complicate INR control."
  },
  {
    id: 102,
    medicines: ["Eptoin", "Warfarin"],
    type: "warning",
    severity: "high",
    notes: "Phenytoin and warfarin can affect each other's levels and require monitoring."
  },
  {
    id: 103,
    medicines: ["Depakine", "Aspirin"],
    type: "warning",
    severity: "moderate",
    notes: "Aspirin may increase valproate effects and bleeding tendency."
  },
  {
    id: 104,
    medicines: ["Lexapro", "Tramadol"],
    type: "dangerous",
    severity: "high",
    notes: "Escitalopram with tramadol can increase serotonin syndrome and seizure risk."
  },
  {
    id: 105,
    medicines: ["Amitriptyline", "Tramadol"],
    type: "warning",
    severity: "high",
    notes: "Combination may increase seizure risk and serotonin-related side effects."
  },
  {
    id: 106,
    medicines: ["Terbinafine", "Warfarin"],
    type: "warning",
    severity: "moderate",
    notes: "Antifungal therapy may alter anticoagulant response in some patients."
  },
  {
    id: 107,
    medicines: ["Fucidin", "Mupirocin Ointment"],
    type: "duplicate",
    severity: "low",
    notes: "Both are topical antibiotics; duplicate topical therapy should be reviewed."
  },
  {
    id: 108,
    medicines: ["Canesten Cream", "Clotrimazole Cream"],
    type: "duplicate",
    severity: "low",
    notes: "Both contain clotrimazole antifungal therapy."
  },
  {
    id: 109,
    medicines: ["Folic Acid", "Iron Supplement"],
    type: "safe",
    severity: "low",
    notes: "Common supplement combination used in anemia and pregnancy support."
  },
  {
    id: 110,
    medicines: ["Zinc", "Ciprofloxacin"],
    type: "warning",
    severity: "moderate",
    notes: "Zinc can reduce ciprofloxacin absorption."
  },
  {
    id: 111,
    medicines: ["Hydralazine", "Atenolol"],
    type: "safe",
    severity: "moderate",
    notes: "Sometimes used together for blood pressure control with monitoring."
  },
  {
    id: 112,
    medicines: ["Isordil", "Cardnit"],
    type: "duplicate",
    severity: "high",
    notes: "Both are nitrate medicines; duplicate nitrate therapy can cause low blood pressure."
  }
];

const pakistanPopularCombinationPairs = [
  ["Loprin", "Warfarin", "dangerous", "critical", "Aspirin brands with warfarin can greatly increase bleeding risk."],
  ["Ascard", "Warfarin", "dangerous", "critical", "Aspirin brands with warfarin can greatly increase bleeding risk."],
  ["Disprin CV", "Warfarin", "dangerous", "critical", "Aspirin therapy with warfarin needs strict clinical monitoring due to bleeding risk."],
  ["Loprin", "Xarelto", "dangerous", "high", "Aspirin with rivaroxaban can increase bleeding risk."],
  ["Ascard", "Eliquis", "dangerous", "high", "Aspirin with apixaban can increase bleeding risk."],
  ["Plavix", "Warfarin", "dangerous", "critical", "Clopidogrel with warfarin can cause serious bleeding risk."],
  ["Clopilet", "Loprin", "warning", "high", "Dual antiplatelet therapy increases bleeding risk and should be intentional."],
  ["Plavix", "Loprin", "warning", "high", "Dual antiplatelet therapy increases bleeding risk and should be intentional."],
  ["Xarelto", "Brufen", "dangerous", "high", "NSAIDs with oral anticoagulants increase stomach and bleeding risk."],
  ["Eliquis", "Voltral", "dangerous", "high", "NSAIDs with oral anticoagulants increase stomach and bleeding risk."],
  ["Pradaxa", "Ponstan", "dangerous", "high", "NSAIDs with oral anticoagulants increase bleeding risk."],
  ["Marevan", "Flagyl", "dangerous", "high", "Metronidazole can increase warfarin effect and bleeding risk."],
  ["Marevan", "Zithromax", "warning", "moderate", "Azithromycin may alter anticoagulant response in some patients."],
  ["Marevan", "Klaricid", "dangerous", "high", "Clarithromycin can increase warfarin effect and bleeding risk."],
  ["Marevan", "Ciproxin", "dangerous", "high", "Ciprofloxacin may increase warfarin effect and bleeding risk."],
  ["Marevan", "Tavanic", "dangerous", "high", "Levofloxacin can increase INR and bleeding risk with warfarin."],
  ["Tritace", "Aldactone", "warning", "high", "ACE inhibitors with spironolactone can raise potassium and affect kidneys."],
  ["Zestril", "Aldactone", "warning", "high", "ACE inhibitors with spironolactone can raise potassium and affect kidneys."],
  ["Coversyl", "Aldactone", "warning", "high", "ACE inhibitors with spironolactone can raise potassium and affect kidneys."],
  ["Cozaar", "Aldactone", "warning", "high", "ARBs with spironolactone can raise potassium and affect kidneys."],
  ["Eziday", "Aldactone", "warning", "high", "Losartan with spironolactone can raise potassium and requires monitoring."],
  ["Diovan", "Aldactone", "warning", "high", "Valsartan with spironolactone can raise potassium and requires monitoring."],
  ["Micardis", "Aldactone", "warning", "high", "Telmisartan with spironolactone can raise potassium and requires monitoring."],
  ["Concor", "Corbis", "duplicate", "high", "Both are bisoprolol brands; duplicate beta blocker therapy can lower heart rate."],
  ["Concor", "Seloken", "dangerous", "high", "Combining beta blockers can cause low heart rate and low blood pressure."],
  ["Seloken", "Lopresor", "duplicate", "high", "Both are metoprolol brands; duplicate therapy can lower heart rate."],
  ["Tenormin", "Concor", "dangerous", "high", "Combining beta blockers can cause low heart rate and low blood pressure."],
  ["Inderal", "Ventolin", "warning", "moderate", "Non-selective beta blockers may reduce bronchodilator effect in asthma patients."],
  ["Inderal", "Asmalin", "warning", "moderate", "Non-selective beta blockers may reduce bronchodilator effect in asthma patients."],
  ["Lasix", "Diuza", "warning", "moderate", "Combining diuretics may increase dehydration and electrolyte imbalance risk."],
  ["Lasix", "Digoxin", "warning", "high", "Low potassium from diuretics can increase digoxin toxicity risk."],
  ["Diuza", "Digoxin", "warning", "high", "Low potassium from diuretics can increase digoxin toxicity risk."],
  ["Spiromide", "Lasix", "duplicate", "moderate", "Spiromide contains diuretic therapy; duplicate diuretic use should be reviewed."],
  ["Cardnit", "Sildenafil", "dangerous", "critical", "Nitrates with PDE-5 inhibitors can cause dangerous low blood pressure."],
  ["Angised", "Sildenafil", "dangerous", "critical", "Nitrates with PDE-5 inhibitors can cause dangerous low blood pressure."],
  ["Imdur", "Tadalafil", "dangerous", "critical", "Nitrates with PDE-5 inhibitors can cause dangerous low blood pressure."],
  ["Cardnit", "Imdur", "duplicate", "high", "Multiple nitrate medicines can cause low blood pressure and headache."],
  ["Lipiget", "Klaricid", "warning", "high", "Clarithromycin can increase atorvastatin muscle toxicity risk."],
  ["Atorva", "Klaricid", "warning", "high", "Clarithromycin can increase atorvastatin muscle toxicity risk."],
  ["Zocor", "Klaricid", "dangerous", "high", "Clarithromycin can increase simvastatin levels and muscle injury risk."],
  ["Crestor", "Ezetrol", "safe", "low", "Common cholesterol-lowering combination when prescribed."],
  ["Rovista", "Ezetrol", "safe", "low", "Common cholesterol-lowering combination when prescribed."],
  ["Fenoget", "Lipiget", "warning", "moderate", "Fibrate with statin may increase muscle side effect risk."],
  ["Lopid", "Zocor", "dangerous", "high", "Gemfibrozil with simvastatin can increase serious muscle injury risk."],
  ["Brufen", "Ponstan", "dangerous", "high", "Combining NSAIDs increases stomach bleeding and kidney risk."],
  ["Brufen", "Voltral", "dangerous", "high", "Combining NSAIDs increases stomach bleeding and kidney risk."],
  ["Ibugesic", "Dicloran", "dangerous", "high", "Combining NSAIDs increases stomach bleeding and kidney risk."],
  ["Arinac", "Ponstan", "dangerous", "high", "Arinac contains ibuprofen; combining with another NSAID increases risk."],
  ["Synflex", "Voltral", "dangerous", "high", "Combining NSAIDs increases stomach bleeding and kidney risk."],
  ["Celebrex", "Warfarin", "warning", "high", "Celecoxib with warfarin can increase bleeding risk."],
  ["Mobic", "Xarelto", "dangerous", "high", "NSAIDs with anticoagulants increase bleeding risk."],
  ["Toradol", "Brufen", "dangerous", "high", "Ketorolac should not be combined with other NSAIDs."],
  ["Tramal", "Xanax", "dangerous", "critical", "Tramadol with benzodiazepines can cause dangerous sedation and breathing problems."],
  ["Tramal", "Lexotanil", "dangerous", "critical", "Tramadol with benzodiazepines can cause dangerous sedation and breathing problems."],
  ["Tramal", "Rivotril", "dangerous", "critical", "Tramadol with benzodiazepines can cause dangerous sedation and breathing problems."],
  ["Tramal", "Zoloft", "dangerous", "high", "Tramadol with SSRIs can increase serotonin syndrome and seizure risk."],
  ["Tramal", "Lexapro", "dangerous", "high", "Tramadol with SSRIs can increase serotonin syndrome and seizure risk."],
  ["Tramal", "Prozac", "dangerous", "high", "Tramadol with SSRIs can increase serotonin syndrome and seizure risk."],
  ["Ultracet", "Panadol", "warning", "high", "Ultracet contains paracetamol; adding paracetamol can increase overdose risk."],
  ["Nuberol Forte", "Panadol", "warning", "high", "Nuberol Forte contains paracetamol; adding paracetamol can increase overdose risk."],
  ["Neogab", "Lyrica", "duplicate", "moderate", "Both are gabapentinoids and may increase dizziness and sedation."],
  ["Lyrica", "Tramal", "warning", "high", "Pregabalin with opioid-like pain medicine can increase sedation and breathing risk."],
  ["Betnovate", "Dermovate", "duplicate", "moderate", "Multiple topical steroids can increase skin thinning and irritation risk."],
  ["Quadriderm", "Betnovate", "duplicate", "moderate", "Quadriderm contains a steroid; duplicate topical steroid use should be reviewed."],
  ["Canesten", "Clotrim", "duplicate", "low", "Both are clotrimazole products; duplicate topical therapy should be reviewed."],
  ["Fucidin", "Fusibact", "duplicate", "low", "Both are fusidic acid products; duplicate topical antibiotic therapy should be reviewed."],
  ["Bactroban", "Mupiron", "duplicate", "low", "Both are mupirocin products; duplicate topical antibiotic therapy should be reviewed."],
  ["Silverex", "Septran", "warning", "moderate", "Both involve sulfonamide-related therapy; sulfa allergy history should be checked."],
  ["Tobradex", "Tobrex", "duplicate", "moderate", "Both contain tobramycin eye antibiotic therapy; duplicate use should be reviewed."],
  ["Corex", "Xanax", "dangerous", "critical", "Sedating cough syrups with benzodiazepines can cause dangerous drowsiness and breathing problems."],
  ["Corex", "Lexotanil", "dangerous", "critical", "Sedating cough syrups with benzodiazepines can cause dangerous drowsiness and breathing problems."],
  ["Benadryl", "Phenergan", "warning", "moderate", "Multiple sedating antihistamines can cause excessive drowsiness."],
  ["Avil", "Phenergan", "warning", "moderate", "Multiple sedating antihistamines can cause excessive drowsiness."],
  ["Hydryllin", "Benadryl", "warning", "moderate", "Multiple sedating cough or allergy medicines can increase drowsiness."],
  ["Ventolin", "Asmalin", "duplicate", "moderate", "Both are salbutamol products; duplicate bronchodilator use may increase tremor and fast heartbeat."],
  ["Ventolin", "Inderal", "warning", "moderate", "Non-selective beta blockers can reduce salbutamol effect in asthma patients."],
  ["Motilium", "Klaricid", "dangerous", "high", "Domperidone with clarithromycin can increase abnormal heart rhythm risk."],
  ["Motilium", "Zithromax", "warning", "moderate", "Combination may increase heart rhythm risk in susceptible patients."],
  ["Zofran", "Zithromax", "warning", "moderate", "Both can affect heart rhythm in susceptible patients."],
  ["Maxolon", "Prozac", "warning", "moderate", "Combination may increase movement-related side effects or serotonin symptoms."],
  ["Risek", "Nexum", "duplicate", "moderate", "Both are PPIs; duplicate acid-suppression therapy should be reviewed."],
  ["Nexum", "Controloc", "duplicate", "moderate", "Both are PPIs; duplicate acid-suppression therapy should be reviewed."],
  ["Gaviscon", "Eltroxin", "warning", "moderate", "Antacids can reduce levothyroxine absorption if taken together."],
  ["CAC 1000", "Eltroxin", "warning", "moderate", "Calcium can reduce levothyroxine absorption if taken together."],
  ["Fefol Vit", "Eltroxin", "warning", "moderate", "Iron can reduce levothyroxine absorption if taken together."],
  ["Ciproxin", "CAC 1000", "warning", "moderate", "Calcium can reduce ciprofloxacin absorption."],
  ["Tavanic", "Fefol Vit", "warning", "moderate", "Iron can reduce levofloxacin absorption."],
  ["Zincat", "Ciproxin", "warning", "moderate", "Zinc can reduce ciprofloxacin absorption."],
  ["Glucophage", "Mixtard", "warning", "moderate", "Metformin with insulin is common but blood sugar should be monitored."],
  ["Getryl", "Mixtard", "warning", "high", "Sulfonylurea with insulin can increase hypoglycemia risk."],
  ["Amaryl", "Mixtard", "warning", "high", "Sulfonylurea with insulin can increase hypoglycemia risk."],
  ["Diamicron MR", "Mixtard", "warning", "high", "Sulfonylurea with insulin can increase hypoglycemia risk."],
  ["Jardiance", "Forxiga", "duplicate", "moderate", "Both are SGLT2 inhibitors; duplicate therapy should be reviewed."],
  ["Januvia", "Galvus", "duplicate", "moderate", "Both are DPP-4 inhibitors; duplicate therapy should be reviewed."],
  ["Novorapid", "Humalog", "duplicate", "high", "Both are rapid-acting insulins; duplicate therapy can cause hypoglycemia."],
  ["Novorapid", "Lantus", "safe", "moderate", "Rapid and long-acting insulin may be used together with glucose monitoring."],
  ["Humalog", "Lantus", "safe", "moderate", "Rapid and long-acting insulin may be used together with glucose monitoring."]
];

const pakistanPopularCombinations = pakistanPopularCombinationPairs.map(
  ([medicineA, medicineB, type, severity, notes], index) => ({
    id: baseMedicineCombinations.length + index + 1,
    medicines: [medicineA, medicineB],
    type,
    severity,
    notes
  })
);

export const medicineCombinations = [...baseMedicineCombinations, ...pakistanPopularCombinations];

