package components

import (
	"image"
	"image/color"

	"gioui.org/layout"
	"gioui.org/op"
	"gioui.org/unit"
	"gioui.org/widget/material"
)

var (
	background = color.NRGBA{R: 0xC0, G: 0xC0, B: 0xC0, A: 0xFF}
	white      = color.NRGBA{R: 0xFF, G: 0xFF, B: 0xFF, A: 0xFF}
	red        = color.NRGBA{R: 0xC0, G: 0x40, B: 0x40, A: 0xFF}
	green      = color.NRGBA{R: 0x40, G: 0xC0, B: 0x40, A: 0xFF}
	blue       = color.NRGBA{R: 0x40, G: 0x40, B: 0xC0, A: 0xFF}
	black      = color.NRGBA{R: 0x00, G: 0x00, B: 0x00, A: 0xFF}
)

func MainWindow(gtx layout.Context, th *material.Theme) layout.Dimensions {
	return twoColumns(gtx, func(gtx layout.Context) layout.Dimensions {
		return coloredWidget(gtx, th, "Left", red)
	}, func(gtx layout.Context) layout.Dimensions {
		return TileEditor(gtx, th)
	})
}

func twoColumns(gtx layout.Context, left, right layout.Widget) layout.Dimensions {
	leftsize := gtx.Constraints.Min.X / 2
	rightsize := gtx.Constraints.Min.X - leftsize

	{
		gtx := gtx
		gtx.Constraints = layout.Exact(image.Pt(leftsize, gtx.Constraints.Max.Y))
		left(gtx)
	}

	{
		gtx := gtx
		gtx.Constraints = layout.Exact(image.Pt(rightsize, gtx.Constraints.Max.Y))
		trans := op.Offset(image.Pt(leftsize, 0)).Push(gtx.Ops)
		right(gtx)
		trans.Pop()
	}

	return layout.Dimensions{Size: gtx.Constraints.Max}
}

func coloredWidget(gtx layout.Context, th *material.Theme, text string, backgroundColor color.NRGBA) layout.Dimensions {
	addPadding(gtx, func(gtx layout.Context) layout.Dimensions {
		return drawRectangle(gtx, gtx.Constraints.Max, backgroundColor)
	})
	return CenteredText(gtx, th, text)
}

func addPadding(gtx layout.Context, widget func(gtx layout.Context) layout.Dimensions) layout.Dimensions {
	return layout.UniformInset(unit.Dp(20)).Layout(gtx, func(gtx layout.Context) layout.Dimensions {
		return widget(gtx)
	})
}
