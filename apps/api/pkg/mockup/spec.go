package mockup

import (
	"fmt"
	"strings"
)

type DeviceFrameType string

const (
	FrameBrowser WindowType = "browser"
	FramePhone   WindowType = "phone"
	FrameLaptop  WindowType = "laptop"
)

type WindowType string

func GenerateDeviceFrameSVG(frame WindowType, imageURL string, title string) string {
	var sb strings.Builder

	switch frame {
	case "browser":
		sb.WriteString("<svg width='800' height='500' viewBox='0 0 800 500' fill='none' xmlns='http://www.w3.org/2000/svg'>")
		sb.WriteString("<rect width='800' height='500' rx='12' fill='#1e1e2e'/>")
		sb.WriteString("<rect y='0' width='800' height='40' rx='12' fill='#282a36'/>")
		sb.WriteString("<circle cx='24' cy='20' r='6' fill='#ff5555'/>")
		sb.WriteString("<circle cx='44' cy='20' r='6' fill='#f1fa8c'/>")
		sb.WriteString("<circle cx='64' cy='20' r='6' fill='#50fa7b'/>")
		sb.WriteString(fmt.Sprintf("<text x='400' y='24' fill='#f8f8f2' font-family='sans-serif' font-size='12' text-anchor='middle'>%s</text>", title))
		sb.WriteString(fmt.Sprintf("<image href='%s' x='0' y='40' width='800' height='460' preserveAspectRatio='xMidYMid slice'/>", imageURL))
		sb.WriteString("</svg>")
	case "phone":
		sb.WriteString("<svg width='375' height='700' viewBox='0 0 375 700' fill='none' xmlns='http://www.w3.org/2000/svg'>")
		sb.WriteString("<rect width='375' height='700' rx='36' fill='#09090b' stroke='#27272a' stroke-width='6'/>")
		sb.WriteString("<rect x='130' y='12' width='115' height='24' rx='12' fill='#000000'/>")
		sb.WriteString(fmt.Sprintf("<image href='%s' x='6' y='6' width='363' height='688' rx='30' preserveAspectRatio='xMidYMid slice'/>", imageURL))
		sb.WriteString("</svg>")
	default:
		sb.WriteString("<svg width='800' height='450' viewBox='0 0 800 450' fill='none' xmlns='http://www.w3.org/2000/svg'>")
		sb.WriteString("<rect width='800' height='450' rx='16' fill='#18181b'/>")
		sb.WriteString(fmt.Sprintf("<image href='%s' x='10' y='10' width='780' height='430' rx='8' preserveAspectRatio='xMidYMid slice'/>", imageURL))
		sb.WriteString("</svg>")
	}

	return sb.String()
}
