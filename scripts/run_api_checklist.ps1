# API Automated Verification Script for Karma Backend
$ErrorActionPreference = "Continue"
$BASE = "http://localhost:8080"
$passed = 0
$failed = 0

function Assert-Test($name, $condition, $details = "") {
    if ($condition) {
        Write-Host "  [PASS] $name" -ForegroundColor Green
        $global:passed++
    } else {
        Write-Host "  [FAIL] $name $details" -ForegroundColor Red
        $global:failed++
    }
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host " Karma Backend Automated Test Suite" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Health Probe
Write-Host "`n1. Health & Infrastructure" -ForegroundColor Yellow
try {
    $h = Invoke-RestMethod -Uri "$BASE/healthz" -Method Get
    Assert-Test "1.1 Health probe returns 200 and status ok" ($h.status -eq "ok" -and $h.service -eq "karma-api-gateway")
} catch {
    Assert-Test "1.1 Health probe returns 200 and status ok" $false $_.Exception.Message
}

# 2. Authentication with Bcrypt Password
Write-Host "`n2. Authentication & Bcrypt Password Hashing" -ForegroundColor Yellow
$testEmail = "architect_$(Get-Random)@karma.app"
$testPass = "SecureP@ssw0rd!2026"
$token = ""
$refresh = ""

try {
    $reg = Invoke-RestMethod -Uri "$BASE/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{
        email = $testEmail
        password = $testPass
        name = "Staff Architect"
    } | ConvertTo-Json)
    $token = $reg.access_token
    $refresh = $reg.refresh_token
    Assert-Test "2.1 Register new user with password" ($null -ne $token -and $null -ne $refresh)
    Assert-Test "2.2 Password hash not exposed in response" ($null -eq $reg.user.password_hash)
} catch {
    Assert-Test "2.1 Register new user with password" $false $_.Exception.Message
}

try {
    $login = Invoke-RestMethod -Uri "$BASE/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{
        email = $testEmail
        password = $testPass
    } | ConvertTo-Json)
    Assert-Test "2.3 Login with correct password" ($null -ne $login.access_token)
} catch {
    Assert-Test "2.3 Login with correct password" $false $_.Exception.Message
}

try {
    Invoke-RestMethod -Uri "$BASE/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{
        email = $testEmail
        password = "WRONG_PASSWORD_XYZ"
    } | ConvertTo-Json)
    Assert-Test "2.4 Wrong password rejected with 401" $false "Expected 401 but succeeded"
} catch {
    Assert-Test "2.4 Wrong password rejected with 401" ($_.ToString() -match "401" -or $_.Exception.Message -match "401")
}

# 3. Token Lifecycle
Write-Host "`n3. Token Lifecycle & Protection" -ForegroundColor Yellow
$headers = @{ Authorization = "Bearer $token" }

try {
    $me = Invoke-RestMethod -Uri "$BASE/v1/auth/me" -Method Get -Headers $headers
    Assert-Test "3.1 GET /v1/auth/me with valid token" ($me.email -eq $testEmail)
} catch {
    Assert-Test "3.1 GET /v1/auth/me with valid token" $false $_.Exception.Message
}

try {
    Invoke-RestMethod -Uri "$BASE/v1/auth/me" -Method Get
    Assert-Test "3.2 Unauthenticated GET /me returns 401" $false
} catch {
    Assert-Test "3.2 Unauthenticated GET /me returns 401" ($_.ToString() -match "401" -or $_.Exception.Message -match "401")
}

$newRefresh = ""
try {
    $refRes = Invoke-RestMethod -Uri "$BASE/v1/auth/refresh" -Method Post -ContentType "application/json" -Body (@{
        refresh_token = $refresh
    } | ConvertTo-Json)
    $newRefresh = $refRes.refresh_token
    Assert-Test "3.3 Refresh token rotation creates new tokens" ($null -ne $refRes.access_token -and $newRefresh -ne $refresh)
} catch {
    Assert-Test "3.3 Refresh token rotation creates new tokens" $false $_.Exception.Message
}

try {
    Invoke-RestMethod -Uri "$BASE/v1/auth/refresh" -Method Post -ContentType "application/json" -Body (@{
        refresh_token = $refresh
    } | ConvertTo-Json)
    Assert-Test "3.4 Reused refresh token rejected with 403" $false
} catch {
    Assert-Test "3.4 Reused refresh token rejected with 403" ($_.ToString() -match "403" -or $_.Exception.Message -match "403")
}

# 4. BYOK Vault
Write-Host "`n4. BYOK Vault (AES-256-GCM Envelope Encryption)" -ForegroundColor Yellow
try {
    $storeKey = Invoke-RestMethod -Uri "$BASE/v1/vault/keys" -Method Post -Headers $headers -ContentType "application/json" -Body (@{
        provider = "openai"
        api_key = "sk-test-openai-master-key-12345"
    } | ConvertTo-Json)
    Assert-Test "4.1 Store BYOK key" ($storeKey.provider -eq "openai")
} catch {
    Assert-Test "4.1 Store BYOK key" $false $_.Exception.Message
}

try {
    $keys = Invoke-RestMethod -Uri "$BASE/v1/vault/keys" -Method Get -Headers $headers
    $hasOpenAI = ($keys | Where-Object { $_.provider -eq "openai" })
    Assert-Test "4.2 List BYOK keys (masked)" ($null -ne $hasOpenAI)
} catch {
    Assert-Test "4.2 List BYOK keys (masked)" $false $_.Exception.Message
}

try {
    $delKey = Invoke-RestMethod -Uri "$BASE/v1/vault/keys/openai" -Method Delete -Headers $headers
    Assert-Test "4.3 Delete BYOK key" ($delKey.success -eq $true -or $null -eq $delKey)
} catch {
    Assert-Test "4.3 Delete BYOK key" $false $_.Exception.Message
}

# 5. Career Graph
Write-Host "`n5. Career Graph & Node Ingestion" -ForegroundColor Yellow
try {
    $event = Invoke-RestMethod -Uri "$BASE/v1/career-events" -Method Post -Headers $headers -ContentType "application/json" -Body (@{
        raw_text = "Designed and deployed distributed in-memory cache reducing query latency from 80ms to 2ms."
        capture_channel = "quick_add"
    } | ConvertTo-Json)
    Assert-Test "5.1 Ingest career event" ($null -ne $event.id)
} catch {
    Assert-Test "5.1 Ingest career event" $false $_.Exception.Message
}

$createdNodeId = ""
try {
    $node = Invoke-RestMethod -Uri "$BASE/v1/career-nodes" -Method Post -Headers $headers -ContentType "application/json" -Body (@{
        title = "Distributed Cache Architecture"
        category = "project"
        impact_summary = "Reduced latency by 97.5% using TTL cache"
        skills = @("Go", "Concurrency", "Redis")
        star_situation = "High database read load on peak traffic"
        star_task = "Implement sub-millisecond caching layer"
        star_action = "Wrote thread-safe generic cache with janitor goroutine"
        star_result = "Served 100k req/sec at <2ms latency"
    } | ConvertTo-Json)
    $createdNodeId = $node.id
    Assert-Test "5.2 Create career node" ($null -ne $node.id)
} catch {
    Assert-Test "5.2 Create career node" $false $_.Exception.Message
}

try {
    $nodes = Invoke-RestMethod -Uri "$BASE/v1/career-nodes" -Method Get -Headers $headers
    Assert-Test "5.3 List career nodes (cached)" ($nodes.Count -gt 0)
} catch {
    Assert-Test "5.3 List career nodes (cached)" $false $_.Exception.Message
}

# 6. ATS Resume Engine
Write-Host "`n6. ATS Resume Engine" -ForegroundColor Yellow
try {
    $resume = Invoke-RestMethod -Uri "$BASE/v1/resumes/generate" -Method Post -Headers $headers -ContentType "application/json" -Body (@{
        raw_jd = "Looking for Senior Go Backend Architect with experience in microservices and distributed systems."
        template_id = "ats_clean_v1"
    } | ConvertTo-Json)
    Assert-Test "6.1 Generate ATS Resume (Knapsack Budget)" ($null -ne $resume.id -and $resume.ats_score -ge 0)
} catch {
    Assert-Test "6.1 Generate ATS Resume (Knapsack Budget)" $false $_.Exception.Message
}

# 7. Career Acceleration Tools
Write-Host "`n7. Career Acceleration Tools" -ForegroundColor Yellow
try {
    $hl = Invoke-RestMethod -Uri "$BASE/v1/tools/linkedin/headline" -Method Post -Headers $headers -ContentType "application/json" -Body (@{
        role_title = "Staff Software Engineer"
        top_skills = "Go, Distributed Systems, PostgreSQL"
    } | ConvertTo-Json)
    Assert-Test "7.1 Generate LinkedIn Headline" ($null -ne $hl.asset -or $null -ne $hl.variants)
} catch {
    Assert-Test "7.1 Generate LinkedIn Headline" $false $_.Exception.Message
}

try {
    $post = Invoke-RestMethod -Uri "$BASE/v1/tools/linkedin/post" -Method Post -Headers $headers -ContentType "application/json" -Body (@{
        project_title = "Scalable caching architecture in Go"
        metrics_result = "Served 100k req/sec at <2ms latency"
    } | ConvertTo-Json)
    Assert-Test "7.2 Generate LinkedIn Post" ($null -ne $post.asset -or $null -ne $post.variants)
} catch {
    Assert-Test "7.2 Generate LinkedIn Post" $false $_.Exception.Message
}

try {
    $interview = Invoke-RestMethod -Uri "$BASE/v1/tools/interview/start" -Method Post -Headers $headers -ContentType "application/json" -Body (@{
        domain = "distributed_systems"
        role_title = "Staff Systems Engineer"
    } | ConvertTo-Json)
    Assert-Test "7.3 Start Interview Session" ($null -ne $interview.session -and $null -ne $interview.initial_question)
} catch {
    Assert-Test "7.3 Start Interview Session" $false $_.Exception.Message
}

try {
    $sg = Invoke-RestMethod -Uri "$BASE/v1/tools/skill-gap" -Method Post -Headers $headers -ContentType "application/json" -Body (@{
        job_description_id = $null
    } | ConvertTo-Json)
    Assert-Test "7.4 Analyze Skill Gap" ($null -ne $sg.id -or $null -ne $sg.gap_report)
} catch {
    Assert-Test "7.4 Analyze Skill Gap" $false $_.Exception.Message
}

# 8. Portfolio CMS & Proof Mockups
Write-Host "`n8. Portfolio CMS & Proof Mockups" -ForegroundColor Yellow
try {
    $port = Invoke-RestMethod -Uri "$BASE/v1/portfolios/" -Method Post -Headers $headers -ContentType "application/json" -Body (@{
        theme_id = "minimal_dark"
        subdomain = "architect-$((Get-Random) % 1000)"
        config = @{ bio = "Staff Systems Architect" }
    } | ConvertTo-Json)
    Assert-Test "8.1 Upsert Portfolio" ($null -ne $port.id -or $null -ne $port.subdomain)
} catch {
    Assert-Test "8.1 Upsert Portfolio" $false $_.Exception.Message
}

try {
    $mockup = Invoke-RestMethod -Uri "$BASE/v1/mockups/generate" -Method Post -Headers $headers -ContentType "application/json" -Body (@{
        asset_type = "device_frame"
        source_image_url = "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
        params = @{ tilt = "perspective_3d" }
    } | ConvertTo-Json)
    Assert-Test "8.2 Generate Proof Mockup" ($null -ne $mockup.id)
} catch {
    Assert-Test "8.2 Generate Proof Mockup" $false $_.Exception.Message
}

# Summary
Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host " Test Summary: $passed Passed, $failed Failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================" -ForegroundColor Cyan
