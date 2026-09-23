$ErrorActionPreference = 'Continue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
$hdrs = @{ 'Referer' = 'https://a202603021911129992001565.wgstores.com/'; 'Accept' = 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' }
$dir = $PSScriptRoot
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$base = 'https://xcimg.szwego.com/img/f9633f25/20260604/'
$files = @(
 'i1780552815644_6048_0_0.jpg',
 'i1780552813670_8673_0_1.jpg',
 'i1780552812598_2529_0_2.jpg',
 'i1780552813984_1451_0_3.jpg',
 'i1780552812096_1942_0_4.jpg',
 'i1780552814256_5446_0_5.jpg',
 'i1780552813667_673_0_6.jpg',
 'i1780552814665_4693_0_7.jpg',
 'i1780552812095_8986_0_8.jpg',
 'i1780552814988_2538_0_9.jpg',
 'i1780552813129_6781_0_10.jpg',
 'i1780552815286_7845_0_11.jpg',
 'i1780552814669_995_0_12.jpg',
 'i1780552811473_6549_0_13.jpg',
 'i1780552811476_2773_0_14.jpg',
 'i1780552811474_5057_0_15.jpg',
 'i1780552813667_9025_0_16.jpg',
 'i1780552809201_7174_0_17.jpg',
 'i1780552812601_1228_0_18.jpg',
 'i1780552814253_3506_0_19.jpg',
 'i1780552815287_3857_0_20.jpg',
 'i1780552812096_5715_0_21.jpg',
 'i1780552814991_1494_0_22.jpg',
 'i1780552811475_9238_0_23.jpg'
)
$i = 0
foreach ($f in $files) {
  $name = '{0:d2}.jpg' -f $i
  $out = Join-Path $dir $name
  try {
    Invoke-WebRequest -Uri ($base + $f) -OutFile $out -UseBasicParsing -Headers $hdrs -UserAgent $ua -TimeoutSec 40
    Write-Output "OK $name"
  } catch {
    Write-Output "FAIL $name :: $($_.Exception.Message)"
  }
  $i++
}
Write-Output 'DONE'
