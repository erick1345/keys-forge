# Setup automatico do Keys Forge numa maquina nova.
# Rode DENTRO da pasta keys-forge (depois de clonar este repo de infra):
#   powershell -ExecutionPolicy Bypass -File .\setup.ps1

$ErrorActionPreference = 'Stop'

$repos = @(
  @{ dir = 'backend';  url = 'https://github.com/erick1345/-Back-end-keys.git';  branch = 'dev' },
  @{ dir = 'frontend'; url = 'https://github.com/erick1345/front-end.keys.git';  branch = 'dev' },
  @{ dir = 'mobile';   url = 'https://github.com/erick1345/keys-forge-mobile.git'; branch = 'master' }
)

Write-Host "== Clonando repositorios ==" -ForegroundColor Cyan
foreach ($r in $repos) {
  if (Test-Path $r.dir) {
    Write-Host "  $($r.dir): ja existe, pulando clone" -ForegroundColor Yellow
  } else {
    Write-Host "  clonando $($r.dir) ($($r.branch))..."
    git clone -b $r.branch $r.url $r.dir
  }
}

Write-Host "`n== Instalando dependencias (npm install) ==" -ForegroundColor Cyan
foreach ($r in $repos) {
  Write-Host "  $($r.dir)..."
  Push-Location $r.dir
  npm install
  Pop-Location
}

Write-Host "`n== .env ==" -ForegroundColor Cyan
if (Test-Path '.env') {
  Write-Host "  .env ja existe, mantendo" -ForegroundColor Yellow
} elseif (Test-Path '.env.example') {
  Copy-Item '.env.example' '.env'
  Write-Host "  criei .env a partir do .env.example -> ABRA e preencha as senhas" -ForegroundColor Green
}

Write-Host "`nPronto! Faltou so: criar/importar o banco (init.sql) e rodar:" -ForegroundColor Green
Write-Host "  cd backend  ; npm run dev     (API  http://localhost:3001)"
Write-Host "  cd frontend ; npm run dev     (Site http://localhost:5173)"
Write-Host "Veja o SETUP.md para os detalhes (banco e modo Docker)."
