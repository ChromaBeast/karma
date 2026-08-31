package career

import (
	"crypto/sha256"
	"encoding/binary"
	"math"
	"regexp"
	"strconv"
	"strings"

	"karma/apps/api/pkg/models"
)

var (
	percentRegex = regexp.MustCompile(`(?i)(?:by\s+|up\s+to\s+|increased\s+|reduced\s+|improved\s+)?(\d+(?:\.\d+)?)\s*%`)
	dollarRegex  = regexp.MustCompile(`(?i)\$\s*(\d+(?:\.\d+)?)\s*([kmbKMB])?`)
	hoursRegex   = regexp.MustCompile(`(?i)(\d+(?:\.\d+)?)\s*(?:hrs?|hours?)\s*(?:per\s+week|saved|reduced)?`)
	scaleRegex   = regexp.MustCompile(`(?i)(\d+(?:\.\d+)?)\s*([kmbKMB])?\s*(?:users|dau|mau|requests|qps|rps|concurrent)`)
)

func ExtractMetrics(text string) models.CareerNodeMetrics {
	var metrics models.CareerNodeMetrics
	var rawList []string

	if m := percentRegex.FindStringSubmatch(text); len(m) > 1 {
		if val, err := strconv.ParseFloat(m[1], 64); err == nil {
			metrics.PercentageDelta = &val
			rawList = append(rawList, m[0])
		}
	}

	if m := dollarRegex.FindStringSubmatch(text); len(m) > 1 {
		if val, err := strconv.ParseFloat(m[1], 64); err == nil {
			multiplier := 1.0
			if len(m) > 2 {
				switch strings.ToLower(m[2]) {
				case "k":
					multiplier = 1000.0
				case "m":
					multiplier = 1000000.0
				case "b":
					multiplier = 1000000000.0
				}
			}
			fullUSD := val * multiplier
			metrics.DollarValueUSD = &fullUSD
			rawList = append(rawList, m[0])
		}
	}

	if m := hoursRegex.FindStringSubmatch(text); len(m) > 1 {
		if val, err := strconv.ParseFloat(m[1], 64); err == nil {
			metrics.TimeSavedHours = &val
			rawList = append(rawList, m[0])
		}
	}

	if m := scaleRegex.FindStringSubmatch(text); len(m) > 1 {
		if val, err := strconv.ParseFloat(m[1], 64); err == nil {
			mult := 1.0
			if len(m) > 2 {
				switch strings.ToLower(m[2]) {
				case "k":
					mult = 1000.0
				case "m":
					mult = 1000000.0
				case "b":
					mult = 1000000000.0
				}
			}
			scale := int64(val * mult)
			metrics.ScaleUsers = &scale
			rawList = append(rawList, m[0])
		}
	}

	metrics.RawMetrics = rawList
	return metrics
}

func StructureEventText(raw string) (situation, action, result string, tags []string) {
	sentences := strings.Split(raw, ".")
	if len(sentences) >= 3 {
		situation = strings.TrimSpace(sentences[0])
		action = strings.TrimSpace(sentences[1])
		result = strings.TrimSpace(strings.Join(sentences[2:], "."))
	} else if len(sentences) == 2 {
		situation = strings.TrimSpace(sentences[0])
		action = strings.TrimSpace(sentences[1])
		result = action
	} else {
		situation = "Context: General work deliverable"
		action = strings.TrimSpace(raw)
		result = action
	}

	words := strings.Fields(strings.ToLower(raw))
	for _, w := range words {
		cleaned := strings.Trim(w, ",.!?;:\"'()[]{}")
		if _, exists := CanonicalVocabulary[cleaned]; exists {
			tags = append(tags, cleaned)
		}
	}
	return situation, action, result, NormalizeTags(tags)
}

func GenerateVectorEmbedding(text string) []float32 {
	const dim = 1536
	vec := make([]float32, dim)
	hash := sha256.Sum256([]byte(text))

	var sumSq float64
	for i := 0; i < dim; i++ {
		byteIdx := (i * 4) % (len(hash) - 4)
		seed := binary.LittleEndian.Uint32(hash[byteIdx : byteIdx+4])
		val := float32(math.Sin(float64(seed + uint32(i))))
		vec[i] = val
		sumSq += float64(val * val)
	}

	norm := float32(math.Sqrt(sumSq))
	if norm > 0 {
		for i := 0; i < dim; i++ {
			vec[i] /= norm
		}
	}
	return vec
}
