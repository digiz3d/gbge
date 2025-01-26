package main

import (
	"log"
	"os"

	"gioui.org/app"
	"gioui.org/op"
	"gioui.org/unit"
	"gioui.org/widget/material"
	"github.com/digiz3d/gbge/components"
)

const windowWidth = 800
const windowHeight = 600

func main() {
	log.Print("Starting !\n")

	go func() {
		window := new(app.Window)

		window.Option(app.Title("My window"),
			app.MinSize(unit.Dp(windowWidth), unit.Dp(windowHeight)),
			app.MaxSize(unit.Dp(windowWidth), unit.Dp(windowHeight)),
		)

		err := run(window)
		if err != nil {
			log.Fatal(err)
		}
		os.Exit(0)
	}()
	app.Main()
}

func run(window *app.Window) error {
	theme := material.NewTheme()
	var ops op.Ops
	for {
		switch e := window.Event().(type) {
		case app.DestroyEvent:
			return e.Err
		case app.FrameEvent:
			gtx := app.NewContext(&ops, e)
			components.MainWindow(gtx, theme)
			e.Frame(gtx.Ops)
		}
	}
}
