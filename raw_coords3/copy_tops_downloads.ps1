$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$src = 'C:\Users\yurek\Downloads'
$out = 'c:\Users\yurek\OneDrive\Desktop\tubhyam\tubhyamoffical\public\images\products'

if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out | Out-Null }

$map = @(
  @{ src='ChatGPT Image Sep 22, 2026, 06_30_51 PM.png'; dst='tops-001-a.jpg' },
  @{ src='ChatGPT Image Sep 22, 2026, 06_31_10 PM.png'; dst='tops-002-a.jpg' },
  @{ src='ChatGPT Image Sep 21, 2026, 06_02_41 PM.png'; dst='tops-002-b.jpg' },
  @{ src='ChatGPT Image Sep 22, 2026, 06_31_14 PM.png'; dst='tops-003-a.jpg' },
  @{ src='ChatGPT Image Sep 22, 2026, 06_32_20 PM.png'; dst='tops-004-a.jpg' },
  @{ src='ChatGPT Image Sep 22, 2026, 06_35_49 PM.png'; dst='tops-005-a.jpg' },
  @{ src='ChatGPT Image Sep 22, 2026, 06_38_07 PM.png'; dst='tops-006-a.jpg' }
)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)

foreach ($m in $map) {
  $sp = Join-Path $src $m.src
  $dp = Join-Path $out $m.dst
  if (-not (Test-Path -LiteralPath $sp)) { Write-Output "MISSING $($m.src)"; continue }
  $img = [System.Drawing.Image]::FromFile($sp)
  $w = $img.Width; $h = $img.Height
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($img, 0, 0, $w, $h)
  $bmp.Save($dp, $codec, $ep)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  Write-Output ("OK {0}  {1}x{2}  {3} KB" -f $m.dst, $w, $h, [math]::Round((Get-Item -LiteralPath $dp).Length/1KB))
}
Write-Output 'DONE'
