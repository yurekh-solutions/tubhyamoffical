Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$outDir = Join-Path $root '..\public\images\products'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function CropTop([string]$inPath, [string]$outPath, [double]$pct) {
  $img = [System.Drawing.Image]::FromFile($inPath)
  $w = $img.Width; $h = $img.Height
  $cut = [int]($h * $pct)
  $newH = $h - $cut
  $bmp = New-Object System.Drawing.Bitmap($w, $newH)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $dst = New-Object System.Drawing.Rectangle(0, 0, $w, $newH)
  $srcR = New-Object System.Drawing.Rectangle(0, $cut, $w, $newH)
  $g.DrawImage($img, $dst, $srcR, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  # JPEG quality 92
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 92)
  $bmp.Save($outPath, $codec, $ep)
  Write-Output ("CROP {0} -> {1}  {2}x{3} -> {4}x{5}" -f (Split-Path $inPath -Leaf), (Split-Path $outPath -Leaf), $w, $h, $w, $newH)
  $bmp.Dispose(); $img.Dispose()
}

function Montage([string[]]$files, [string]$outPath, [int]$cols) {
  $cellW = 300; $cellH = 400
  $rows = [math]::Ceiling($files.Count / $cols)
  $bmp = New-Object System.Drawing.Bitmap(($cols * $cellW), ($rows * $cellH))
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $i = 0
  foreach ($f in $files) {
    $im = [System.Drawing.Image]::FromFile($f)
    $ratio = [math]::Min($cellW / $im.Width, $cellH / $im.Height)
    $nw = [int]($im.Width * $ratio); $nh = [int]($im.Height * $ratio)
    $x = ($i % $cols) * $cellW + [int](($cellW - $nw) / 2)
    $y = [math]::Floor($i / $cols) * $cellH + [int](($cellH - $nh) / 2)
    $g.DrawImage($im, $x, $y, $nw, $nh)
    $im.Dispose()
    $i++
  }
  $g.Dispose()
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "MONTAGE $outPath"
}

# Product A: cord-set-002 (gold-buckle editorial) - crop top 20%
$aJobs = @(
  @('14', 'cord-set-002-wine',    0.20),
  @('15', 'cord-set-002-navy',    0.20),
  @('16', 'cord-set-002-white',   0.20),
  @('17', 'cord-set-002-lemon',   0.20),
  @('18', 'cord-set-002-fuchsia', 0.20),
  @('19', 'cord-set-002-red',     0.20),
  @('20', 'cord-set-002-pink',    0.20),
  @('21', 'cord-set-002-mint',    0.20),
  @('22', 'cord-set-002-black',   0.20)
)
$aOut = @()
foreach ($j in $aJobs) {
  $inF = Join-Path $root ($j[0] + '.jpg')
  $outF = Join-Path $outDir ($j[1] + '.jpg')
  CropTop $inF $outF ([double]$j[2])
  $aOut += $outF
}

# Product B: cord-set-003 (peplum mirror) - crop top 21%
$bJobs = @(
  @('01', 'cord-set-003-olive',     0.21),
  @('02', 'cord-set-003-teal',      0.21),
  @('05', 'cord-set-003-blush',     0.21),
  @('06', 'cord-set-003-wine',      0.21),
  @('07', 'cord-set-003-black',     0.21),
  @('08', 'cord-set-003-chocolate', 0.21),
  @('09', 'cord-set-003-skyblue',   0.21)
)
$bOut = @()
foreach ($j in $bJobs) {
  $inF = Join-Path $root ($j[0] + '.jpg')
  $outF = Join-Path $outDir ($j[1] + '.jpg')
  CropTop $inF $outF ([double]$j[2])
  $bOut += $outF
}

Montage $aOut (Join-Path $root 'preview_A.png') 3
Montage $bOut (Join-Path $root 'preview_B.png') 4
Write-Output 'DONE'
