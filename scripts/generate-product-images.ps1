Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = "Stop"

$root = (Resolve-Path -LiteralPath ".").Path
$outDir = Join-Path $root "public\assets"

function New-Brush([int]$r, [int]$g, [int]$b, [int]$a = 255) {
  return New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($a, $r, $g, $b))
}

function New-PenColor([int]$r, [int]$g, [int]$b, [int]$w = 3, [int]$a = 255) {
  return New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb($a, $r, $g, $b)), $w
}

function Fill-RoundRect($g, $brush, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $p.AddArc($x, $y, $d, $d, 180, 90)
  $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $p.CloseFigure()
  $g.FillPath($brush, $p)
  $p.Dispose()
}

function Draw-Shadow($g, [float]$x, [float]$y, [float]$w, [float]$h) {
  for ($i = 12; $i -ge 1; $i--) {
    $b = New-Brush 18 29 34 ([int](70 / $i))
    $g.FillEllipse($b, $x - $i * 4, $y - $i, $w + $i * 8, $h + $i * 2)
    $b.Dispose()
  }
}

function New-Image($name, [scriptblock]$draw) {
  $w = 1200
  $h = 800
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush `
    ([System.Drawing.Rectangle]::new(0, 0, $w, $h)), `
    ([System.Drawing.Color]::FromArgb(252, 252, 249)), `
    ([System.Drawing.Color]::FromArgb(232, 241, 238)), `
    35
  $g.FillRectangle($bg, 0, 0, $w, $h)

  $surface = New-Brush 255 255 251 135
  $g.FillEllipse($surface, 120, 595, 960, 155)
  $surface.Dispose()

  & $draw $g

  $path = Join-Path $outDir $name
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bg.Dispose()
  $g.Dispose()
  $bmp.Dispose()
}

function Draw-Bag($g, [int]$x, [int]$y, [int]$w, [int]$h, [int[]]$c, [int[]]$dark) {
  Draw-Shadow $g ($x + 15) ($y + $h - 24) ($w - 25) 55
  $body = New-Brush $c[0] $c[1] $c[2]
  Fill-RoundRect $g $body $x $y $w $h 20
  $body.Dispose()

  $side = New-Brush $dark[0] $dark[1] $dark[2] 78
  $g.FillPolygon($side, @(
    [System.Drawing.Point]::new($x + $w, $y + 26),
    [System.Drawing.Point]::new($x + $w + 38, $y + 64),
    [System.Drawing.Point]::new($x + $w + 38, $y + $h - 28),
    [System.Drawing.Point]::new($x + $w, $y + $h)
  ))
  $side.Dispose()

  $top = New-Brush 255 255 255 55
  $g.FillRectangle($top, $x + 8, $y + 10, $w - 16, 45)
  $top.Dispose()

  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(185, $dark[0], $dark[1], $dark[2])), 8
  $g.DrawArc($pen, $x + $w * 0.24, $y - 35, $w * 0.52, 88, 200, 140)
  $pen.Dispose()
}

function Draw-Pouch($g, [int]$x, [int]$y, [int]$w, [int]$h, [int[]]$c, [int[]]$accent) {
  Draw-Shadow $g $x ($y + $h - 18) $w 50
  $body = New-Brush $c[0] $c[1] $c[2]
  Fill-RoundRect $g $body $x $y $w $h 30
  $body.Dispose()

  $top = New-Brush 255 255 255 70
  $g.FillRectangle($top, $x + 12, $y + 18, $w - 24, 25)
  $top.Dispose()

  $acc = New-Brush $accent[0] $accent[1] $accent[2]
  Fill-RoundRect $g $acc ($x + 34) ($y + $h * 0.56) ($w - 68) 20 10
  $acc.Dispose()

  $line = New-Brush 250 245 234 230
  Fill-RoundRect $g $line ($x + 45) ($y + $h * 0.69) ($w - 90) 17 8
  $line.Dispose()
}

function Draw-Box($g, [int]$x, [int]$y, [int]$w, [int]$h, [int[]]$c, [int[]]$lid) {
  Draw-Shadow $g ($x - 5) ($y + $h - 12) ($w + 20) 54
  $body = New-Brush $c[0] $c[1] $c[2]
  Fill-RoundRect $g $body $x $y $w $h 16
  $body.Dispose()

  $top = New-Brush $lid[0] $lid[1] $lid[2]
  $g.FillPolygon($top, @(
    [System.Drawing.Point]::new($x, $y),
    [System.Drawing.Point]::new($x + 55, $y - 48),
    [System.Drawing.Point]::new($x + $w + 45, $y - 42),
    [System.Drawing.Point]::new($x + $w, $y)
  ))
  $top.Dispose()

  $hl = New-Brush 255 255 255 70
  Fill-RoundRect $g $hl ($x + 45) ($y + 70) ($w - 90) 28 14
  $hl.Dispose()
}

New-Image "product-paper-bags-real.png" {
  param($g)
  Draw-Bag $g 150 330 175 260 @(139, 95, 54) @(82, 52, 34)
  Draw-Bag $g 255 270 235 365 @(202, 154, 82) @(120, 80, 45)
  Draw-Bag $g 505 225 260 410 @(248, 246, 236) @(158, 148, 126)
  Draw-Bag $g 740 290 210 325 @(32, 49, 57) @(20, 30, 36)
}

New-Image "product-mailer-bags-real.png" {
  param($g)
  Draw-Box $g 205 260 320 240 @(244, 243, 237) @(222, 222, 210)
  Draw-Box $g 470 215 310 265 @(35, 53, 62) @(62, 83, 96)
  Draw-Box $g 660 310 310 245 @(232, 190, 143) @(205, 157, 96)
  $seal = New-Brush 50 145 112
  Fill-RoundRect $g $seal 250 375 250 26 13
  Fill-RoundRect $g $seal 703 430 210 22 11
  $seal.Dispose()
}

New-Image "product-food-coffee-bags-real.png" {
  param($g)
  Draw-Pouch $g 210 250 240 390 @(36, 50, 56) @(210, 161, 88)
  Draw-Pouch $g 430 205 285 435 @(199, 151, 82) @(250, 244, 230)
  Draw-Pouch $g 700 285 235 340 @(247, 242, 226) @(45, 143, 107)
  $coffee = New-Brush 115 73 42
  for ($i = 0; $i -lt 38; $i++) {
    $g.FillEllipse($coffee, (Get-Random -Minimum 150 -Maximum 1020), (Get-Random -Minimum 635 -Maximum 710), 24, 14)
  }
  $coffee.Dispose()
}

New-Image "product-stand-up-pouches-real.png" {
  param($g)
  Draw-Pouch $g 170 285 220 330 @(244, 241, 230) @(55, 148, 113)
  Draw-Pouch $g 370 235 250 395 @(35, 54, 63) @(238, 234, 224)
  Draw-Pouch $g 610 275 230 345 @(215, 176, 126) @(250, 242, 229)
  Draw-Pouch $g 805 310 180 285 @(79, 132, 108) @(245, 239, 229)
}

New-Image "product-packaging-boxes-real.png" {
  param($g)
  Draw-Box $g 210 355 315 230 @(207, 157, 91) @(176, 123, 61)
  Draw-Box $g 485 285 305 295 @(244, 242, 233) @(220, 217, 203)
  Draw-Box $g 700 330 280 240 @(34, 52, 60) @(63, 85, 98)
  $tray = New-Brush 230 226 214
  Fill-RoundRect $g $tray 285 245 310 90 22
  $tray.Dispose()
}

New-Image "product-brand-kit-real.png" {
  param($g)
  Draw-Box $g 220 365 260 185 @(207, 157, 91) @(176, 123, 61)
  $card = New-Brush 248 246 238
  Fill-RoundRect $g $card 520 205 280 175 18
  Fill-RoundRect $g $card 620 430 230 150 18
  $card.Dispose()
  $tag = New-Brush 37 55 63
  Fill-RoundRect $g $tag 410 210 120 190 16
  $tag.Dispose()
  $green = New-Brush 50 145 110
  Fill-RoundRect $g $green 790 300 190 70 35
  $green.Dispose()
  $roll = New-Brush 235 231 216
  $g.FillEllipse($roll, 760, 445, 185, 95)
  $roll.Dispose()
  $rollInner = New-Brush 250 248 239
  $g.FillEllipse($rollInner, 815, 468, 70, 38)
  $rollInner.Dispose()
}

$testImage = Join-Path $outDir "_test-image.png"
if (Test-Path -LiteralPath $testImage) {
  Remove-Item -LiteralPath $testImage -Force
}
