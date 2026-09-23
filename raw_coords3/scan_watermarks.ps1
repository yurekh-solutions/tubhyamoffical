$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$dir = 'c:\Users\yurek\OneDrive\Desktop\tubhyam\tubhyamoffical\public\images\products'
$outDir = 'c:\Users\yurek\OneDrive\Desktop\tubhyam\tubhyamoffical\raw_coords3'

function Make-Sheet {
  param($files, $outPath, $title)
  if ($files.Count -eq 0) { Write-Output "EMPTY $title"; return }
  $cellW = 290; $cellH = 388; $labelH = 18; $cols = 5
  $rows = [math]::Ceiling($files.Count / $cols)
  $bmp = New-Object System.Drawing.Bitmap(($cols * $cellW), ($rows * ($cellH + $labelH)))
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = 'HighQualityBicubic'
  $font = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Bold)
  for ($i = 0; $i -lt $files.Count; $i++) {
    $col = $i % $cols
    $row = [math]::Floor($i / $cols)
    $x = $col * $cellW
    $y = $row * ($cellH + $labelH)
    $img = [System.Drawing.Image]::FromFile($files[$i].FullName)
    $scale = [math]::Min($cellW / $img.Width, $cellH / $img.Height)
    $w = [int]($img.Width * $scale)
    $h = [int]($img.Height * $scale)
    $g.DrawImage($img, [int]($x + ($cellW - $w) / 2), [int]($y + ($cellH - $h) / 2), $w, $h)
    $g.DrawString($files[$i].Name, $font, [System.Drawing.Brushes]::Black, ($x + 4), ($y + $cellH + 1))
    $img.Dispose()
  }
  $g.Dispose()
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output ("SAVED {0} ({1} files)" -f $outPath, $files.Count)
}

$dr = Get-ChildItem -LiteralPath $dir -Filter 'dr-*.jpg' | Sort-Object Name
Make-Sheet $dr (Join-Path $outDir 'scan_dr.png') 'dr'

$cord = Get-ChildItem -LiteralPath $dir -Filter 'cord-set-*.jpg' | Sort-Object Name
Make-Sheet $cord (Join-Path $outDir 'scan_cord.png') 'cord'

$misc = @()
$misc += Get-ChildItem -LiteralPath $dir -Filter 'fp-04*.jpg' | Sort-Object Name
$misc += Get-ChildItem -LiteralPath $dir -Filter 'jn-01*.jpg' | Sort-Object Name
Make-Sheet $misc (Join-Path $outDir 'scan_misc.png') 'misc'

Write-Output 'DONE'
