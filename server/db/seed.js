import { db } from './index.js';

export async function seedDemoDataForUser(userId) {
  // 1. Create realistic fields
  const field1 = await db.createField({
    user_id: userId,
    name: 'Block B - Roma Tomatoes',
    crop_type: 'Tomato (Solanum lycopersicum)',
    acreage: 12.5,
    soil_type: 'Loamy Clay',
    status: 'Warning',
    risk_level: 'High',
    location: 'North Quadrant - Sector 2',
    health_score: 68.0
  });

  const field2 = await db.createField({
    user_id: userId,
    name: 'Field Plot 2 - Sweet Corn',
    crop_type: 'Sweet Corn (Zea mays)',
    acreage: 24.0,
    soil_type: 'Silty Clay Loam',
    status: 'Warning',
    risk_level: 'Medium',
    location: 'East Terrace Plot',
    health_score: 76.0
  });

  const field3 = await db.createField({
    user_id: userId,
    name: 'Field Plot 3 - Alphonso Mango Orchard',
    crop_type: 'Mango (Mangifera indica)',
    acreage: 35.0,
    soil_type: 'Sandy Loam',
    status: 'Healthy',
    risk_level: 'Low',
    location: 'South Hillside Orchard',
    health_score: 92.0
  });

  const field4 = await db.createField({
    user_id: userId,
    name: 'Field Plot 4 - Organic Bell Peppers',
    crop_type: 'Bell Pepper (Capsicum annuum)',
    acreage: 8.5,
    soil_type: 'Rich Humus Loam',
    status: 'Healthy',
    risk_level: 'Low',
    location: 'Greenhouse Zone 1',
    health_score: 89.0
  });

  const field5 = await db.createField({
    user_id: userId,
    name: 'Field Plot 5 - Winter Wheat',
    crop_type: 'Winter Wheat (Triticum aestivum)',
    acreage: 50.0,
    soil_type: 'Clay Loam',
    status: 'Under Treatment',
    risk_level: 'Medium',
    location: 'West Basin Flatlands',
    health_score: 74.0
  });

  // 2. Create Realistic Advisories & AI Analyses
  // Advisory 1 - Primary Hackathon Demo (Tomato Early Blight)
  const adv1 = await db.createAdvisory({
    field_id: field1.id,
    user_id: userId,
    title: 'Tomato Lower Leaf Lesions & Chlorosis - Early Blight Assessment',
    status: 'In Progress'
  });

  const msg1_farmer = await db.createMessage({
    advisory_id: adv1.id,
    sender_type: 'farmer',
    content: 'My tomato plants in Block B have dark brown concentric ring spots on lower leaves with yellowing edges. Humidity has been 85% for three days and soil nitrogen is low.',
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=600&q=80'
  });

  await db.createAiAnalysis({
    advisory_id: adv1.id,
    message_id: msg1_farmer.id,
    category: 'Pathology',
    diagnosis: 'Early Blight (Alternaria solani)',
    confidence_score: 0.94,
    severity: 'High',
    priority: 'High',
    risk_level: 'High',
    summary: 'Tomato leaves display characteristic concentric target ring spots with chlorotic yellow halos. Sustained 85% relative humidity and nitrogen stress have accelerated fungal spore germination.',
    organic_remedy: 'Prune infected lower foliage immediately to promote airflow. Spray Bacillus subtilis bio-fungicide or cold-pressed Neem seed oil emulsion (5ml/L water) every 5-7 days.',
    chemical_remedy: 'Apply Copper Oxychloride 50% WP @ 2.5g/L water or Azoxystrobin 23% SC @ 1ml/L. Alternate chemical classes to prevent resistance.',
    recommended_action: 'Prune infected lower leaves, transition immediately from overhead sprinkler to drip irrigation, and apply protective copper spray before upcoming rain.'
  });

  await db.createMessage({
    advisory_id: adv1.id,
    sender_type: 'ai',
    content: 'Diagnostic complete: Early Blight (Alternaria solani) detected with 94% confidence. This is a High Priority condition requiring immediate field intervention within 24-48 hours. See treatment plan details below.'
  });

  // Advisory 2 - Sweet Corn Aphid & Nitrogen Stress
  const adv2 = await db.createAdvisory({
    field_id: field2.id,
    user_id: userId,
    title: 'Corn Tassel Aphid Cluster & Yellowing V-Pattern Leaf Deficit',
    status: 'Open'
  });

  const msg2 = await db.createMessage({
    advisory_id: adv2.id,
    sender_type: 'farmer',
    content: 'Corn leaves showing V-shaped yellowing starting from tip along the midrib, and sticky honeydew seen on young whorls.',
    image_url: null
  });

  await db.createAiAnalysis({
    advisory_id: adv2.id,
    message_id: msg2.id,
    category: 'Nutrient Deficiency',
    diagnosis: 'Severe Nitrogen (N) Deficiency & Secondary Aphid Infestation',
    confidence_score: 0.91,
    severity: 'Medium',
    priority: 'Medium',
    risk_level: 'Medium',
    summary: 'V-shaped chlorosis along the leaf midrib is a textbook symptom of mobile nitrogen deficiency during vegetative growth. Sticky residue indicates early aphid feeding.',
    organic_remedy: 'Side-dress with composted vermicompost and fish amino fertilizer. Release predatory Chrysoperla carnea (green lacewings) for biological aphid predation.',
    chemical_remedy: 'Apply side-dressed Urea (46-0-0) fertigation @ 30kg/ha. Foliar spray of Thiamethoxam 25% WG @ 0.3g/L for acute aphid suppression.',
    recommended_action: 'Inject split-dose nitrogen via drip system and introduce bio-control agents within 3 days.'
  });

  // Advisory 3 - Winter Wheat Stripe Rust
  const adv3 = await db.createAdvisory({
    field_id: field5.id,
    user_id: userId,
    title: 'Yellow Stripe Rust Alert - Flatland Basin',
    status: 'In Progress'
  });

  const msg3 = await db.createMessage({
    advisory_id: adv3.id,
    sender_type: 'farmer',
    content: 'Noticed parallel yellow stripe pustules forming along wheat leaf veins after cool morning fog.',
    image_url: null
  });

  await db.createAiAnalysis({
    advisory_id: adv3.id,
    message_id: msg3.id,
    category: 'Pathology',
    diagnosis: 'Stripe Rust / Yellow Rust (Puccinia striiformis)',
    confidence_score: 0.89,
    severity: 'High',
    priority: 'Critical',
    risk_level: 'High',
    summary: 'High airborne spore dispersion risk. Cool temperatures (10-15°C) and morning moisture are optimal for rapid Stripe Rust outbreak across wheat canopy.',
    organic_remedy: 'Foliar spray of Trichoderma harzianum bio-agent formulation and sulfur-based dust application.',
    chemical_remedy: 'Foliar systemic fungicide spray: Propiconazole 25% EC @ 1ml/L or Tebuconazole 25.9% EC @ 1.25ml/L water.',
    recommended_action: 'Deploy tractor sprayer with Propiconazole within 24 hours to protect flag leaves and prevent up to 40% grain yield reduction.'
  });

  // 3. Create AI Farm Insights
  await db.createInsight({
    user_id: userId,
    title: 'Fungal Infection Risk Elevated by 35% in Tomato Blocks',
    description: 'High micro-climate humidity (85%) combined with dense leaf canopy has increased fungal sporulation risk across Block B. Preventative protection recommended.',
    insight_type: 'Pathology & Microclimate',
    severity: 'High',
    recommended_action: 'Increase airflow by pruning bottom 20cm foliage and conduct preventative copper oxychloride or bio-fungicide spray before evening humidity rises.'
  });

  await db.createInsight({
    user_id: userId,
    title: 'Nitrogen Split-Dose Deficit in Sweet Corn Plots',
    description: 'Soil nutrient mapping indicates rapid nitrogen drawdown during knee-high vegetative stage. Delayed fertigation may reduce cob kernel count.',
    insight_type: 'Nutrient & Soil Health',
    severity: 'Medium',
    recommended_action: 'Schedule drip fertigation with Calcium Nitrate or Urea (25 kg/ha) within 48 hours to sustain ear development.'
  });

  await db.createInsight({
    user_id: userId,
    title: 'Drip Irrigation Efficiency Optimization Potential: +18%',
    description: 'Evapotranspiration models show 22% moisture loss during midday watering. Shifting pump schedule to 05:30 - 08:00 AM will preserve rootzone moisture.',
    insight_type: 'Irrigation & Water Conservation',
    severity: 'Low',
    recommended_action: 'Adjust automated irrigation timer to start at 05:30 AM and reduce total run duration by 15%.'
  });

  await db.createInsight({
    user_id: userId,
    title: 'Pest Boundary Sighting: Beneficial Predator Population High',
    description: 'Organic Bell Pepper block shows robust predatory ladybug and lacewing counts, keeping aphid pressure below the economic threshold.',
    insight_type: 'Integrated Pest Management',
    severity: 'Low',
    recommended_action: 'Withhold broad-spectrum synthetic pesticides to protect beneficial predator biodiversity.'
  });

  return { fields: 5, advisories: 3, insights: 4 };
}
