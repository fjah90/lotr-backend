# Script de verificación de requerimientos
# Valida que todos los componentes del proyecto estén presentes

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  VERIFICACIÓN DE REQUERIMIENTOS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$errors = 0
$passed = 0

function Test-Requirement {
    param(
        [string]$Name,
        [scriptblock]$Test
    )
    
    Write-Host "Verificando: $Name..." -NoNewline
    try {
        $result = & $Test
        if ($result) {
            Write-Host " ✅ PASS" -ForegroundColor Green
            $script:passed++
        } else {
            Write-Host " ❌ FAIL" -ForegroundColor Red
            $script:errors++
        }
    } catch {
        Write-Host " ❌ ERROR: $_" -ForegroundColor Red
        $script:errors++
    }
}

Write-Host "1. FRAMEWORK & TECHNOLOGY STACK" -ForegroundColor Yellow
Write-Host "================================`n" -ForegroundColor Yellow

Test-Requirement "Node.js package.json existe" {
    Test-Path "package.json"
}

Test-Requirement "Hono.js en dependencies" {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $null -ne $pkg.dependencies.hono
}

Test-Requirement "TypeScript configurado" {
    Test-Path "tsconfig.json"
}

Test-Requirement "TypeScript en devDependencies" {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $null -ne $pkg.devDependencies.typescript
}

Write-Host "`n2. BASE DE DATOS" -ForegroundColor Yellow
Write-Host "================`n" -ForegroundColor Yellow

Test-Requirement "Docker Compose configurado" {
    Test-Path "docker-compose.yml"
}

Test-Requirement "Schema SQL existe" {
    Test-Path "src/db/schema.sql"
}

Test-Requirement "Configuración de database" {
    Test-Path "src/config/database.ts"
}

Test-Requirement "Driver PostgreSQL (pg)" {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $null -ne $pkg.dependencies.pg
}

Write-Host "`n3. API INTEGRATION" -ForegroundColor Yellow
Write-Host "==================`n" -ForegroundColor Yellow

Test-Requirement "OneAPI service existe" {
    Test-Path "src/services/oneapi.service.ts"
}

Test-Requirement "Tipos para API externa" {
    Test-Path "src/types/api.types.ts"
}

Write-Host "`n4. FUNCIONALIDADES - PROXY DE DATOS" -ForegroundColor Yellow
Write-Host "====================================`n" -ForegroundColor Yellow

Test-Requirement "Rutas de movies" {
    Test-Path "src/routes/movie.routes.ts"
}

Test-Requirement "Rutas de characters" {
    Test-Path "src/routes/character.routes.ts"
}

Write-Host "`n5. FUNCIONALIDADES - SISTEMA DE RESEÑAS" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow

Test-Requirement "Rutas de reviews" {
    Test-Path "src/routes/review.routes.ts"
}

Test-Requirement "Servicio de reviews" {
    Test-Path "src/services/review.service.ts"
}

Test-Requirement "Tipos de reviews" {
    Test-Path "src/types/review.types.ts"
}

Test-Requirement "Validadores de reviews" {
    Test-Path "src/validators/review.validator.ts"
}

Write-Host "`n6. TIPADO ESTRICTO" -ForegroundColor Yellow
Write-Host "==================`n" -ForegroundColor Yellow

Test-Requirement "Carpeta de tipos existe" {
    Test-Path "src/types"
}

Test-Requirement "Carpeta de validators existe" {
    Test-Path "src/validators"
}

Test-Requirement "Zod para validación" {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $null -ne $pkg.dependencies.zod
}

Write-Host "`n7. MANEJO DE ERRORES" -ForegroundColor Yellow
Write-Host "====================`n" -ForegroundColor Yellow

Test-Requirement "Error handler middleware" {
    Test-Path "src/middleware/error-handler.ts"
}

Test-Requirement "Validation middleware" {
    Test-Path "src/middleware/validator.ts"
}

Write-Host "`n8. PUNTOS EXTRA - DESPLIEGUE" -ForegroundColor Yellow
Write-Host "============================`n" -ForegroundColor Yellow

Test-Requirement "Dockerfile existe" {
    Test-Path "Dockerfile"
}

Test-Requirement "README con instrucciones" {
    Test-Path "README.md"
}

Test-Requirement ".env.example para variables" {
    Test-Path ".env.example"
}

Test-Requirement "Colección API (.http)" {
    Test-Path "api.http"
}

Test-Requirement "Configuración de env" {
    Test-Path "src/config/env.ts"
}

Write-Host "`n9. ESTRUCTURA DEL PROYECTO" -ForegroundColor Yellow
Write-Host "==========================`n" -ForegroundColor Yellow

Test-Requirement "Punto de entrada (index.ts)" {
    Test-Path "src/index.ts"
}

Test-Requirement "Carpeta config" {
    Test-Path "src/config"
}

Test-Requirement "Carpeta middleware" {
    Test-Path "src/middleware"
}

Test-Requirement "Carpeta routes" {
    Test-Path "src/routes"
}

Test-Requirement "Carpeta services" {
    Test-Path "src/services"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RESULTADOS DE LA VERIFICACIÓN" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$total = $passed + $errors
$percentage = [math]::Round(($passed / $total) * 100, 2)

Write-Host "Total de pruebas: $total" -ForegroundColor White
Write-Host "Exitosas: $passed" -ForegroundColor Green
Write-Host "Fallidas: $errors" -ForegroundColor $(if ($errors -eq 0) { "Green" } else { "Red" })
Write-Host "Porcentaje de éxito: $percentage%" -ForegroundColor $(if ($percentage -eq 100) { "Green" } else { "Yellow" })

if ($errors -eq 0) {
    Write-Host "`n✅ TODOS LOS REQUERIMIENTOS CUMPLIDOS!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠️  ALGUNOS REQUERIMIENTOS NO SE CUMPLEN" -ForegroundColor Yellow
    exit 1
}
