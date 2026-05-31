$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $altAccentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(171, 186, 201))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 111, 88), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)

    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18)
    $graphics.DrawString("Platform Margin Leak Report", $eyebrowFont, $accentBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, 92, 142)
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, 92, 214)

    $y = 320
    foreach ($bullet in $Bullets) {
        $graphics.FillEllipse($altAccentBrush, 114, $y + 12, 10, 10)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, 138, $y + 2)
        $y += 82
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", $bodyFont, $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof-v2.png") `
    -Title "Overview proof" `
    -Subtitle "Board-ready waste, savings, overlap, reporting, and investment posture in one executive platform-margin surface." `
    -Bullets @(
        "Cloud spend, vendor overlap, identity overhead, and reporting trust stay visible together.",
        "Annual leak estimates roll up into one board-facing score before the savings memo drifts.",
        "Every lane stays tied to an operator-safe remediation packet."
    )

New-ProofImage -Path (Join-Path $screenshots "02-margin-lane-proof-v2.png") `
    -Title "Margin lane" `
    -Subtitle "Each lane keeps owner, cost focus, status, and next action visible." `
    -Bullets @(
        "Cloud, vendor, identity, and reporting lanes stay separated cleanly.",
        "Current posture remains readable at a glance.",
        "Next actions stay executive-safe and audit-readable."
    )

New-ProofImage -Path (Join-Path $screenshots "03-savings-benchmarks-proof-v2.png") `
    -Title "Savings benchmarks" `
    -Subtitle "Benchmarks tie severity, leak family, owner, and board impact into one scoring view." `
    -Bullets @(
        "High-severity margin leaks surface first.",
        "Leaders can tie waste back to cloud, vendor, identity, and reporting posture quickly.",
        "The scorecard is grounded in real platform-margin and executive-intelligence primitives."
    )

New-ProofImage -Path (Join-Path $screenshots "04-investment-brief-proof-v2.png") `
    -Title "Investment brief" `
    -Subtitle "Packets tie score, benchmark, blocker, owner, and board-story timing together." `
    -Bullets @(
        "Leak estimate, top blockers, and next investment call stay visible.",
        "Red and yellow posture remains easy to scan.",
        "The system is shaped for board-ready margin, diligence, and replacement proof."
    )
