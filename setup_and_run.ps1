$TOOLS_DIR   = "D:\tools"
$JDK_ZIP     = "$TOOLS_DIR\jdk17.zip"
$JDK_DIR     = "$TOOLS_DIR\jdk17"
$MAVEN_ZIP   = "$TOOLS_DIR\maven.zip"
$MAVEN_DIR   = "$TOOLS_DIR\maven"
$PROJECT_DIR = "D:\AIBP_K22"

$ProgressPreference = 'SilentlyContinue'
New-Item -ItemType Directory -Force -Path $TOOLS_DIR | Out-Null

Write-Host "=== SETUP JDK + MAVEN + RUN DAO PROJECT ===" -ForegroundColor Cyan

# --- STEP 1: JDK ---
if (-not (Test-Path "$JDK_DIR\bin\javac.exe")) {
    if (-not (Test-Path $JDK_ZIP)) {
        Write-Host "Downloading JDK 17 (~180MB)..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.11%2B9/OpenJDK17U-jdk_x64_windows_hotspot_17.0.11_9.zip" -OutFile $JDK_ZIP -UseBasicParsing
        Write-Host "JDK download done" -ForegroundColor Green
    }
    Write-Host "Extracting JDK..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $JDK_DIR | Out-Null
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead($JDK_ZIP)
    foreach ($entry in $zip.Entries) {
        $rel = $entry.FullName -replace '^[^/]+/', ''
        if ($rel -eq '') { continue }
        $dest = Join-Path $JDK_DIR $rel
        if ($entry.Name -eq '') {
            New-Item -ItemType Directory -Force -Path $dest | Out-Null
        } else {
            $dir = Split-Path $dest -Parent
            New-Item -ItemType Directory -Force -Path $dir | Out-Null
            [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $dest, $true)
        }
    }
    $zip.Dispose()
    Write-Host "JDK extracted to $JDK_DIR" -ForegroundColor Green
} else {
    Write-Host "JDK already exists at $JDK_DIR" -ForegroundColor Green
}

# --- STEP 2: Maven ---
if (-not (Test-Path "$MAVEN_DIR\bin\mvn.cmd")) {
    if (-not (Test-Path $MAVEN_ZIP)) {
        Write-Host "Downloading Maven 3.9.6 (~10MB)..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -OutFile $MAVEN_ZIP -UseBasicParsing
        Write-Host "Maven download done" -ForegroundColor Green
    }
    Write-Host "Extracting Maven..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $MAVEN_DIR | Out-Null
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip2 = [System.IO.Compression.ZipFile]::OpenRead($MAVEN_ZIP)
    foreach ($entry in $zip2.Entries) {
        $rel = $entry.FullName -replace '^[^/]+/', ''
        if ($rel -eq '') { continue }
        $dest = Join-Path $MAVEN_DIR $rel
        if ($entry.Name -eq '') {
            New-Item -ItemType Directory -Force -Path $dest | Out-Null
        } else {
            $dir = Split-Path $dest -Parent
            New-Item -ItemType Directory -Force -Path $dir | Out-Null
            [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $dest, $true)
        }
    }
    $zip2.Dispose()
    Write-Host "Maven extracted to $MAVEN_DIR" -ForegroundColor Green
} else {
    Write-Host "Maven already exists at $MAVEN_DIR" -ForegroundColor Green
}

# --- STEP 3: Set PATH ---
$env:JAVA_HOME = $JDK_DIR
$env:PATH = "$JDK_DIR\bin;$MAVEN_DIR\bin;" + $env:PATH

Write-Host ""
Write-Host "=== Versions ===" -ForegroundColor Cyan
& "$JDK_DIR\bin\java.exe" -version 2>&1
& "$MAVEN_DIR\bin\mvn.cmd" -version 2>&1 | Select-Object -First 1

# --- STEP 4: Run Tests ---
Write-Host ""
Write-Host "=== Running Unit Tests ===" -ForegroundColor Cyan
Set-Location $PROJECT_DIR
& "$MAVEN_DIR\bin\mvn.cmd" test
if ($LASTEXITCODE -eq 0) {
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
} else {
    Write-Host "Some tests failed. See log above." -ForegroundColor Red
}

# --- STEP 5: Run App ---
Write-Host ""
Write-Host "=== Running Application (Mock DAO) ===" -ForegroundColor Cyan
& "$MAVEN_DIR\bin\mvn.cmd" exec:java "-Dexec.mainClass=Main"

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host "To run again later:" -ForegroundColor Yellow
Write-Host '  $env:JAVA_HOME = "D:\tools\jdk17"'
Write-Host '  $env:PATH = "D:\tools\jdk17\bin;D:\tools\maven\bin;" + $env:PATH'
Write-Host "  cd D:\AIBP_K22"
Write-Host "  mvn test"
Write-Host "  mvn exec:java"
