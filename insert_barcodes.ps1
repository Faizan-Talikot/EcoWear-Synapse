# Insert 3 new barcode entries into the database

# Cotton Shirt - 012345678910
$cottonJson = @'
{
  "fabric": "Cotton",
  "barcode_id": "012345678910",
  "sustainability_score": 50,
  "sustainability_details": "Cotton is natural and biodegradable but requires significant water and pesticide use in conventional farming.",
  "details": {
    "fabric_type_impact": "Cotton is a natural fiber but conventional cotton farming uses heavy pesticides and water resources.",
    "brand_sustainability_rating": "Brands using organic cotton with certifications like GOTS show better commitment to sustainability.",
    "carbon_footprint": "Cotton production has a moderate carbon footprint, mainly from farming and processing stages.",
    "water_usage": "Cotton is highly water-intensive, requiring about 2,700 liters per cotton t-shirt.",
    "certifications_labels": "Look for GOTS, OCS (Organic Content Standard), or Better Cotton Initiative labels.",
    "recycling_disposal": "Cotton is biodegradable and can be composted, making it environmentally friendly at end-of-life.",
    "alternative_suggestions": "Consider organic cotton, linen, or Tencel for more sustainable natural fiber options."
  }
}
'@

# Denim Jeans - 694561200208
$denimJson = @'
{
  "fabric": "Denim",
  "barcode_id": "694561200208",
  "sustainability_score": 35,
  "sustainability_details": "Denim production is water and chemical intensive, requiring significant resources for cotton growing and dyeing processes.",
  "details": {
    "fabric_type_impact": "Denim requires large amounts of water and chemicals for production, making it resource-intensive.",
    "brand_sustainability_rating": "Brands using recycled denim or water-efficient processes show commitment to sustainability.",
    "carbon_footprint": "Denim has a high carbon footprint due to intensive cotton farming and chemical processing.",
    "water_usage": "Denim production uses approximately 3,781 liters of water per pair of jeans.",
    "certifications_labels": "Look for certifications like Better Cotton Initiative, OEKO-TEX, or recycled content labels.",
    "recycling_disposal": "Denim can be recycled into insulation or new garments, but disposal should avoid landfills.",
    "alternative_suggestions": "Consider organic denim, recycled denim, or hemp-based alternatives for better sustainability."
  }
}
'@

# Hemp Cloth - 711921187121
$hempJson = @'
{
  "fabric": "Hemp",
  "barcode_id": "711921187121",
  "sustainability_score": 85,
  "sustainability_details": "Hemp is one of the most sustainable fabrics, requiring minimal water and no pesticides while improving soil health.",
  "details": {
    "fabric_type_impact": "Hemp requires minimal water and pesticides, actually improving soil health where it grows.",
    "brand_sustainability_rating": "Brands using hemp demonstrate strong commitment to environmental sustainability and innovation.",
    "carbon_footprint": "Hemp has a negative carbon footprint as it absorbs more CO2 than it produces during growth.",
    "water_usage": "Hemp uses 50% less water than cotton and can grow in various climates without irrigation.",
    "certifications_labels": "Look for organic hemp certifications or OEKO-TEX Standard 100 for chemical safety.",
    "recycling_disposal": "Hemp is fully biodegradable and can be composted safely, leaving no environmental impact.",
    "alternative_suggestions": "Hemp is already an excellent sustainable choice, similar alternatives include linen and organic cotton."
  }
}
'@

$baseUrl = "https://ecowear-synapse-backend.onrender.com/barcode-data"

Write-Host "Inserting Cotton Shirt barcode..." -ForegroundColor Green
try {
    $response1 = Invoke-WebRequest -Uri $baseUrl -Method POST -ContentType "application/json" -Body $cottonJson
    Write-Host "Cotton inserted: Status $($response1.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Cotton insertion failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Inserting Denim Jeans barcode..." -ForegroundColor Green
try {
    $response2 = Invoke-WebRequest -Uri $baseUrl -Method POST -ContentType "application/json" -Body $denimJson
    Write-Host "Denim inserted: Status $($response2.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Denim insertion failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Inserting Hemp Cloth barcode..." -ForegroundColor Green
try {
    $response3 = Invoke-WebRequest -Uri $baseUrl -Method POST -ContentType "application/json" -Body $hempJson
    Write-Host "Hemp inserted: Status $($response3.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Hemp insertion failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "All barcode insertions completed!" -ForegroundColor Yellow