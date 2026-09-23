Add-Type -AssemblyName System.Drawing

$srcDir = 'C:\Users\yurek\.qoder\vibe_images'
$outDir = 'C:\Users\yurek\OneDrive\Desktop\tubhyam\tubhyamoffical\public\images\products'
$previewPng = 'C:\Users\yurek\OneDrive\Desktop\tubhyam\tubhyamoffical\raw_coords3\preview_tops_faceless.png'

function CropTopSide([string]$inPath, [string]$outPath, [double]$topPct, [double]$aspect) {
  $img = [System.Drawing.Image]::FromFile($inPath)
  $w = $img.Width; $h = $img.Height
  $cut = [int]($h * $topPct)
  $newH = $h - $cut
  $newW = [int][math]::Round($newH * $aspect)
  if ($newW -gt $w) { $newW = $w }
  $x0 = [int](($w - $newW) / 2)
  $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $srcRect = New-Object System.Drawing.Rectangle($x0, $cut, $newW, $newH)
  $dstRect = New-Object System.Drawing.Rectangle(0, 0, $newW, $newH)
  $g.DrawImage($img, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 92L)
  $bmp.Save($outPath, $enc, $ep)
  $bmp.Dispose(); $img.Dispose()
  Write-Host ("{0} -> {1}x{2}" -f (Split-Path $outPath -Leaf), $newW, $newH)
}

function Montage([string[]]$paths, [string]$outPath, [int]$cols = 4, [int]$cellW = 300) {
  $imgs = @()
  foreach ($p in $paths) { $imgs += [System.Drawing.Image]::FromFile($p) }
  $cellH = [int]($cellW * 4 / 3)
  $rows = [int][math]::Ceiling($imgs.Count / $cols)
  $bmp = New-Object System.Drawing.Bitmap(($cellW * $cols), ($cellH * $rows))
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  for ($i = 0; $i -lt $imgs.Count; $i++) {
    $cx = ($i % $cols) * $cellW
    $cy = [int][math]::Floor($i / $cols) * $cellH
    $r = New-Object System.Drawing.Rectangle($cx, $cy, $cellW, $cellH)
    $g.DrawImage($imgs[$i], $r)
    $imgs[$i].Dispose()
  }
  $g.Dispose()
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$files = Get-ChildItem $srcDir -Filter 'tops-*.png' | Sort-Object Name
foreach ($f in $files) {
  $base = ($f.BaseName -split '_')[0]
  $suffix = $base.Substring($base.Length - 1)
  if ($suffix -eq 'd') { $topPct = 0.365 } else { $topPct = 0.27 }
  $out = Join-Path $outDir ($base + '.jpg')
  CropTopSide $f.FullName $out $topPct 0.75
}

$outs = Get-ChildItem $outDir -Filter 'tops-*.jpg' | Sort-Object Name | ForEach-Object { $_.FullName }
Montage $outs $previewPng
Write-Host ("Montage: {0} images -> {1}" -f $outs.Count, $previewPng)
