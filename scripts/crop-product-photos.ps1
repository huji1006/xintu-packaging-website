Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = "Stop"

$root = (Resolve-Path -LiteralPath ".").Path
$sourceDir = Join-Path $root "tmp\photo-source"
$assetDir = Join-Path $root "public\assets"

$items = @(
  @{ In = "product-paper-bags-photo.jpg"; Out = "product-paper-bags-photo.jpg" },
  @{ In = "product-mailer-bags-photo.jpg"; Out = "product-mailer-bags-photo.jpg" },
  @{ In = "product-food-coffee-bags-photo.jpg"; Out = "product-food-coffee-bags-photo.jpg" },
  @{ In = "product-stand-up-pouches-photo.jpg"; Out = "product-stand-up-pouches-photo.jpg" },
  @{ In = "product-mailer-bags-photo.jpg"; Out = "product-packaging-boxes-photo.jpg" },
  @{ In = "product-paper-bags-photo.jpg"; Out = "product-brand-kit-photo.jpg" }
)

foreach ($item in $items) {
  $inputPath = Join-Path $sourceDir $item.In
  $outputPath = Join-Path $assetDir $item.Out

  $image = [System.Drawing.Image]::FromFile($inputPath)
  $targetWidth = 1200
  $targetHeight = 800
  $sourceRatio = $image.Width / $image.Height
  $targetRatio = $targetWidth / $targetHeight

  if ($sourceRatio -gt $targetRatio) {
    $cropHeight = $image.Height
    $cropWidth = [int]($image.Height * $targetRatio)
    $cropX = [int](($image.Width - $cropWidth) / 2)
    $cropY = 0
  } else {
    $cropWidth = $image.Width
    $cropHeight = [int]($image.Width / $targetRatio)
    $cropX = 0
    $cropY = [int](($image.Height - $cropHeight) / 2)
  }

  $bitmap = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage(
    $image,
    [System.Drawing.Rectangle]::new(0, 0, $targetWidth, $targetHeight),
    [System.Drawing.Rectangle]::new($cropX, $cropY, $cropWidth, $cropHeight),
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

  $graphics.Dispose()
  $bitmap.Dispose()
  $image.Dispose()
}
