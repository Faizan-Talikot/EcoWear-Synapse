Write-Host "Testing Barcode API Endpoints..." -ForegroundColor Green

Write-Host "`n1. Testing Cotton Shirt (012345678910):" -ForegroundColor Yellow
$cotton = Invoke-RestMethod -Uri "https://ecowear-synapse-backend.onrender.com/api/barcode-data/012345678910"
Write-Host "Fabric: $($cotton.fabric) | Score: $($cotton.sustainability_score)"

Write-Host "`n2. Testing Denim Jeans (694561200208):" -ForegroundColor Yellow  
$denim = Invoke-RestMethod -Uri "https://ecowear-synapse-backend.onrender.com/api/barcode-data/694561200208"
Write-Host "Fabric: $($denim.fabric) | Score: $($denim.sustainability_score)"

Write-Host "`n3. Testing Hemp Cloth (711921187121):" -ForegroundColor Yellow
$hemp = Invoke-RestMethod -Uri "https://ecowear-synapse-backend.onrender.com/api/barcode-data/711921187121"  
Write-Host "Fabric: $($hemp.fabric) | Score: $($hemp.sustainability_score)"

Write-Host "`nAll barcode tests completed!" -ForegroundColor Cyan