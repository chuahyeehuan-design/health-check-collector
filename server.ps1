param(
  [int]$Port = 8080
)

$Root = [System.IO.Path]::GetFullPath((Split-Path -Parent $MyInvocation.MyCommand.Path))
$MimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".webmanifest" = "application/manifest+json; charset=utf-8"
  ".svg" = "image/svg+xml"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
}

$Listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
$Listener.Start()
Write-Host "Health Check Collector is running at http://localhost:$Port"

while ($true) {
  $Client = $Listener.AcceptTcpClient()
  try {
    $Client.ReceiveTimeout = 3000
    $Client.SendTimeout = 3000
    $Stream = $Client.GetStream()
    $Reader = [System.IO.StreamReader]::new($Stream)
    $RequestLine = $Reader.ReadLine()

    if ([string]::IsNullOrWhiteSpace($RequestLine)) {
      $Client.Close()
      continue
    }

    while ($true) {
      $Header = $Reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($Header)) { break }
    }

    $Parts = $RequestLine.Split(" ")
    $UrlPath = [System.Uri]::UnescapeDataString($Parts[1].Split("?")[0])
    if ($UrlPath -eq "/") { $UrlPath = "/index.html" }

    $RelativePath = $UrlPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
    $FullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $RelativePath))

    if (-not $FullPath.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $FullPath -PathType Leaf)) {
      $Body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      $HeaderText = "HTTP/1.1 404 Not Found`r`nContent-Length: $($Body.Length)`r`nConnection: close`r`n`r`n"
      $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($HeaderText)
      $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
      $Stream.Write($Body, 0, $Body.Length)
      continue
    }

    $Extension = [System.IO.Path]::GetExtension($FullPath).ToLowerInvariant()
    $MimeType = $MimeTypes[$Extension]
    if ([string]::IsNullOrWhiteSpace($MimeType)) { $MimeType = "application/octet-stream" }

    $Bytes = [System.IO.File]::ReadAllBytes($FullPath)
    $HeaderText = "HTTP/1.1 200 OK`r`nContent-Type: $MimeType`r`nContent-Length: $($Bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
    $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($HeaderText)
    $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
    $Stream.Write($Bytes, 0, $Bytes.Length)
  } catch {
    # Keep the server alive for the next request.
  } finally {
    $Client.Close()
  }
}
