$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$installerPath = Join-Path $env:TEMP "OllamaSetup.exe"
$downloadUrl = "https://ollama.com/download/OllamaSetup.exe"
$ollamaExe = Join-Path $env:LOCALAPPDATA "Programs\Ollama\ollama.exe"
$model = "llama3.2:1b"

Write-Host "Checking Ollama installer..."
if (-not (Test-Path $installerPath)) {
  Write-Host "Downloading Ollama installer..."
  Invoke-WebRequest -UseBasicParsing -Uri $downloadUrl -OutFile $installerPath
}

Write-Host "Installing Ollama..."
$proc = Start-Process -FilePath $installerPath -ArgumentList "/VERYSILENT /NORESTART /SUPPRESSMSGBOXES" -PassThru
$proc.WaitForExit()

if ($proc.ExitCode -ne 0) {
  throw "Ollama installer exited with code $($proc.ExitCode)"
}

if (-not (Test-Path $ollamaExe)) {
  throw "Ollama executable not found after install: $ollamaExe"
}

Write-Host "Starting Ollama service..."
Start-Process -FilePath $ollamaExe | Out-Null
Start-Sleep -Seconds 5

Write-Host "Pulling local model $model ..."
& $ollamaExe pull $model

Write-Host "Testing local API..."
$payload = @{
  model = $model
  stream = $false
  messages = @(
    @{
      role = "user"
      content = "Reply with exactly: ok"
    }
  )
} | ConvertTo-Json -Depth 5

$result = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:11434/api/chat" -ContentType "application/json" -Body $payload
Write-Host "Ollama test reply:"
Write-Host $result.message.content
Write-Host ""
Write-Host "Ollama is ready for the Vugandakumva chatbot."
