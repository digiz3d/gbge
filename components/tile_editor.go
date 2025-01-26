package components

import (
	"image"

	"gioui.org/layout"
	"gioui.org/op"
	"gioui.org/widget/material"
)

const (
	pixelRepresentationSize = 32
	lineWidth               = 1
	currentTilePixelsX      = 8
	currentTilePixelsY      = 8
)

func TileEditor(gtx layout.Context, th *material.Theme) layout.Dimensions {
	drawRectangle(gtx, gtx.Constraints.Max, background)
	return grid(gtx, th, currentTilePixelsX, currentTilePixelsY)
}

func grid(gtx layout.Context, _ *material.Theme, x int, y int) layout.Dimensions {
	totalTilesWidth := x*pixelRepresentationSize + (x-1)*lineWidth
	totalTilesHeight := y*pixelRepresentationSize + (y-1)*lineWidth

	availableWidth := gtx.Constraints.Max.X
	availableHeight := gtx.Constraints.Max.Y

	centerOffsetX := (availableWidth - totalTilesWidth) / 2
	centerOffsetY := (availableHeight - totalTilesHeight) / 2

	tr := op.Offset(image.Pt(lineWidth+centerOffsetX, lineWidth+centerOffsetY)).Push(gtx.Ops)

	rectangleOffset := op.Offset(image.Pt(-lineWidth, -lineWidth)).Push(gtx.Ops)
	drawRectangle(gtx, image.Pt(totalTilesWidth+lineWidth*2, totalTilesHeight+lineWidth*2), black)
	rectangleOffset.Pop()

	for i := 0; i < x; i++ {
		for j := 0; j < y; j++ {
			gtx := gtx
			gtx.Constraints = layout.Exact(image.Pt(pixelRepresentationSize, pixelRepresentationSize))
			trans := op.Offset(image.Pt(pixelRepresentationSize*i+lineWidth*i, pixelRepresentationSize*j+lineWidth*j)).Push(gtx.Ops)
			drawRectangle(gtx, gtx.Constraints.Max, white)
			trans.Pop()
		}

	}
	tr.Pop()
	return layout.Dimensions{Size: gtx.Constraints.Max}
}
