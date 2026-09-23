[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'

try {
  $r = Invoke-WebRequest -Uri 'https://www.google.com' -UseBasicParsing -TimeoutSec 15 -UserAgent $ua
  Write-Output "GOOGLE OK $($r.StatusCode)"
} catch {
  Write-Output "GOOGLE FAIL :: $($_.Exception.Message)"
}

try {
  $h = @{ 'Referer' = 'https://a202603021911129992001565.wgstores.com/'; 'Accept' = 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' }
  $r = Invoke-WebRequest -Uri 'https://xcimg.szwego.com/img/f9633f25/20260604/i1780552815644_6048_0_0.jpg' -UseBasicParsing -TimeoutSec 15 -UserAgent $ua -Headers $h
  Write-Output "XIMG OK $($r.StatusCode) len=$($r.RawContentLength)"
} catch {
  Write-Output "XIMG FAIL :: $($_.Exception.Message)"
}

try {
  $h = @{ 'Referer' = 'https://a202603021911129992001565.wgstores.com/'; 'Accept' = 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' }
  $r = Invoke-WebRequest -Uri 'https://a202603021911129992001565.wgstores.com/weshop/goods/_dnzshfZCUR0eZh-Vziky7Z67nTHY2dwikAdxZgA/_dlWshOh37PXIAdtZLYfZhHx2-m0Iu5jmkA_1clQ' -UseBasicParsing -TimeoutSec 20 -UserAgent $ua -Headers $h
  Write-Output "WGSTORE OK $($r.StatusCode) len=$($r.RawContentLength)"
} catch {
  Write-Output "WGSTORE FAIL :: $($_.Exception.Message)"
}
