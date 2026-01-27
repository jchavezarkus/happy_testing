<#
.SYNOPSIS
Automates installing nvm-windows and Node.js 18.19 on Windows and runs project setup commands.

USAGE (run as Administrator):
  Open PowerShell as Administrator and run:
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    .\scripts\update-node-windows.ps1

NOTE: This script will attempt to download the nvm-windows installer and run it. After installation you may need to reopen your terminal for `nvm` to be available.
#>

function Ensure-RunningAsAdmin {
  $current = [Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()
  if (-not $current.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "This script must be run as Administrator. Relaunching as Administrator..." -ForegroundColor Yellow
    Start-Process -FilePath pwsh -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs -Wait
    Exit $LASTEXITCODE
  }
}

function Download-Installer($url, $out) {
  Write-Host "Downloading installer from $url to $out ..."
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -ErrorAction Stop
    return $true
  }
  catch {
    Write-Host "Failed to download installer: $_" -ForegroundColor Red
    return $false
  }
}

function Install-NVMWindows {
  # Try to get the latest release .exe from GitHub
  try {
    $release = Invoke-RestMethod -Uri 'https://api.github.com/repos/coreybutler/nvm-windows/releases/latest' -UseBasicParsing
    $exeAsset = $release.assets | Where-Object { $_.name -match '\.exe$' } | Select-Object -First 1
    if (-not $exeAsset) { throw 'No exe asset found in latest release' }
    $url = $exeAsset.browser_download_url
  }
  catch {
    Write-Host "Could not fetch latest nvm-windows release from GitHub: $_" -ForegroundColor Red
    return $false
  }

  $installer = Join-Path $env:TEMP 'nvm-setup.exe'
  if (-not (Download-Installer $url $installer)) { return $false }

  Write-Host "Running nvm-windows installer (may prompt UAC) ..."
  try {
    Start-Process -FilePath $installer -ArgumentList '/S' -Verb RunAs -Wait
  }
  catch {
    Write-Host "Installer run failed or requires user interaction. Please run $installer manually as Administrator." -ForegroundColor Yellow
    return $false
  }

  Write-Host "nvm-windows installer finished. You may need to close and reopen your terminal for changes to take effect." -ForegroundColor Green
  return $true
}

# Begin
Ensure-RunningAsAdmin

# Check for existing nvm
$nvmCmd = Get-Command nvm -ErrorAction SilentlyContinue
if (-not $nvmCmd) {
  Write-Host "nvm not found on PATH. Attempting to install nvm-windows..." -ForegroundColor Cyan
  $ok = Install-NVMWindows
  if (-not $ok) {
    Write-Host "Automatic installation failed. Please install nvm-windows manually from https://github.com/coreybutler/nvm-windows/releases and re-run this script." -ForegroundColor Red
    Exit 1
  }
  # Refresh environment (some installers require new shell). Try to pick up nvm immediately; if it fails, instruct user.
  $nvmCmd = Get-Command nvm -ErrorAction SilentlyContinue
  if (-not $nvmCmd) {
    Write-Host "nvm still not available in this session. Please close this PowerShell, open a NEW Administrator PowerShell, and re-run this script." -ForegroundColor Yellow
    Pause
    Exit 0
  }
}
else {
  Write-Host "nvm found: $($nvmCmd.Path)" -ForegroundColor Green
}

# Install and use Node 18.19.0
$nodeVersion = '18.19.0'
try {
  Write-Host "Installing Node $nodeVersion with nvm..."
  nvm install $nodeVersion
  nvm use $nodeVersion
}
catch {
  Write-Host "Failed to install/use Node via nvm: $_" -ForegroundColor Red
  Exit 1
}

Write-Host "Node version: $(node -v)" -ForegroundColor Green
Write-Host "npm version: $(npm -v)" -ForegroundColor Green

# Reinstall project deps and Playwright browsers
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

try {
  if ((Test-Path 'package-lock.json') -or (Test-Path 'pnpm-lock.yaml')) {
    Write-Host "Cleaning node_modules and installing via npm ci..."
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules
    npm ci
  }
  else {
    Write-Host "Installing dependencies via npm install..."
    npm install
  }
}
catch {
  Write-Host "npm install/ci failed: $_" -ForegroundColor Red
  Exit 1
}

try {
  Write-Host "Installing Playwright browsers (this may take a while)..."
  npx playwright install --with-deps
}
catch {
  Write-Host "Playwright install failed: $_" -ForegroundColor Red
  Exit 1
}

Write-Host "All done. Verify by running: node -v ; npm -v ; npx playwright test --version" -ForegroundColor Green
