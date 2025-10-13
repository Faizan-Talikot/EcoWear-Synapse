# Simple barcode API test
Write-Host "Testing Barcode APIs..." -ForegroundColor Green

# Test Cotton Shirt
Write-Host "`n1. Testing Cotton Shirt (012345678910):" -ForegroundColor Yellow
$response1 = Invoke-RestMethod -Uri "https://ecowear-synapse-backend.onrender.com/api/barcode-data/012345678910" -Method GET -ErrorAction SilentlyContinue
if ($response1) {
    Write-Host "✓ SUCCESS - Fabric: $($response1.fabric), Score: $($response1.sustainability_score)" -ForegroundColor Green
} else {
    Write-Host "✗ FAILED" -ForegroundColor Red
}

# Test Denim Jeans
Write-Host "`n2. Testing Denim Jeans (694561200208):" -ForegroundColor Yellow
$response2 = Invoke-RestMethod -Uri "https://ecowear-synapse-backend.onrender.com/api/barcode-data/694561200208" -Method GET -ErrorAction SilentlyContinue
if ($response2) {
    Write-Host "✓ SUCCESS - Fabric: $($response2.fabric), Score: $($response2.sustainability_score)" -ForegroundColor Green
} else {
    Write-Host "✗ FAILED" -ForegroundColor Red
}

# Test Hemp Cloth
Write-Host "`n3. Testing Hemp Cloth (711921187121):" -ForegroundColor Yellow
$response3 = Invoke-RestMethod -Uri "https://ecowear-synapse-backend.onrender.com/api/barcode-data/711921187121" -Method GET -ErrorAction SilentlyContinue
if ($response3) {
    Write-Host "✓ SUCCESS - Fabric: $($response3.fabric), Score: $($response3.sustainability_score)" -ForegroundColor Green
} else {
    Write-Host "✗ FAILED" -ForegroundColor Red
}

Write-Host "`nTesting Complete!" -ForegroundColor Cyan