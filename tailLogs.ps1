$logPath = Join-Path $PSScriptRoot 'storage/logs/laravel.log'

# Seed with the current end of the log so we only print NEW entries.
if (-not (Test-Path $logPath)) {
    New-Item -ItemType File -Path $logPath -Force | Out-Null
}
$lastOffset = (Get-Item $logPath).Length

while ($true) {
    try {
        $currentLength = (Get-Item $logPath).Length

        if ($currentLength -lt $lastOffset) {
            # Log rotated/truncated; restart from the top.
            $lastOffset = 0
        }

        if ($currentLength -gt $lastOffset) {
            $stream = [System.IO.File]::Open($logPath, 'Open', 'Read', 'ReadWrite')
            try {
                $stream.Position = $lastOffset
                $reader = New-Object System.IO.StreamReader($stream)
                try {
                    $newText = $reader.ReadToEnd()
                } finally {
                    $reader.Dispose()
                }
            } finally {
                $stream.Dispose()
            }

            Write-Host $newText.TrimEnd("`r", "`n")
            $lastOffset = $currentLength
        }
    } catch {
        # Log may be briefly locked; retry on the next tick.
    }

    Start-Sleep -Milliseconds 500
}
