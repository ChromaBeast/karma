package resume

import (
	"fmt"
	"strings"

	"karma/apps/api/pkg/models"
)

func CalculateATSScore(jd *models.JobDescription, selections []models.ResumeBulletSelection) float64 {
	if jd == nil || len(jd.ParsedRequirements.RequiredSkills) == 0 {
		return 85.0
	}

	combinedText := ""
	for _, sel := range selections {
		combinedText += " " + strings.ToLower(sel.FinalText)
	}

	matches := 0
	for _, skill := range jd.ParsedRequirements.RequiredSkills {
		if strings.Contains(combinedText, strings.ToLower(skill)) {
			matches++
		}
	}

	rawScore := (float64(matches) / float64(len(jd.ParsedRequirements.RequiredSkills))) * 100.0
	if rawScore > 100.0 {
		rawScore = 100.0
	}
	return rawScore
}

func RenderATSHtml(user models.User, selections []models.ResumeBulletSelection) string {
	var sb strings.Builder
	sb.WriteString("<!DOCTYPE html><html><head><meta charset='UTF-8'><style>")
	sb.WriteString("body{font-family:Arial,Helvetica,sans-serif;line-height:1.4;margin:40px;color:#111;}")
	sb.WriteString("h1{font-size:24px;margin-bottom:4px;text-transform:uppercase;}")
	sb.WriteString("h2{font-size:14px;border-bottom:1px solid #333;margin-top:16px;padding-bottom:2px;text-transform:uppercase;}")
	sb.WriteString("ul{padding-left:20px;margin-top:6px;}")
	sb.WriteString("li{margin-bottom:4px;font-size:12px;}")
	sb.WriteString("</style></head><body>")

	sb.WriteString(fmt.Sprintf("<h1>%s</h1>", user.Name))
	sb.WriteString(fmt.Sprintf("<p>%s</p>", user.Email))

	sections := []string{"Experience", "Projects", "Skills", "Education"}
	for _, sec := range sections {
		var secBullets []models.ResumeBulletSelection
		for _, s := range selections {
			if s.Section == sec {
				secBullets = append(secBullets, s)
			}
		}

		if len(secBullets) > 0 {
			sb.WriteString(fmt.Sprintf("<h2>%s</h2><ul>", sec))
			for _, b := range secBullets {
				sb.WriteString(fmt.Sprintf("<li>%s</li>", b.FinalText))
			}
			sb.WriteString("</ul>")
		}
	}

	sb.WriteString("</body></html>")
	return sb.String()
}

func ExtractPlainTextSelfCheck(html string) string {
	replacer := strings.NewReplacer(
		"<p>", "\n", "</p>", "\n",
		"<h1>", "\n", "</h1>", "\n",
		"<h2>", "\n\n=== ", "</h2>", " ===\n",
		"<li>", "• ", "</li>", "\n",
		"<ul>", "\n", "</ul>", "\n",
		"<!DOCTYPE html><html><head><meta charset='UTF-8'><style>body{font-family:Arial,Helvetica,sans-serif;line-height:1.4;margin:40px;color:#111;}h1{font-size:24px;margin-bottom:4px;text-transform:uppercase;}h2{font-size:14px;border-bottom:1px solid #333;margin-top:16px;padding-bottom:2px;text-transform:uppercase;}ul{padding-left:20px;margin-top:6px;}li{margin-bottom:4px;font-size:12px;}</style></head><body>", "",
		"</body></html>", "",
	)
	text := replacer.Replace(html)
	return strings.TrimSpace(text)
}
