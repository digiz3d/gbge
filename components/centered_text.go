package components

import (
	"gioui.org/layout"
	"gioui.org/widget/material"
)

func CenteredText(gtx layout.Context, th *material.Theme, text string) layout.Dimensions {
	return layout.Center.Layout(gtx, material.H3(th, text).Layout)
}
