package career

import (
	"strings"
)

var CanonicalVocabulary = map[string]string{
	"go":                  "golang",
	"golang":              "golang",
	"ts":                  "typescript",
	"typescript":          "typescript",
	"js":                  "javascript",
	"javascript":          "javascript",
	"py":                  "python",
	"python":              "python",
	"react":               "react",
	"nextjs":              "next.js",
	"next.js":             "next.js",
	"postgres":            "postgresql",
	"postgresql":          "postgresql",
	"pgvector":            "pgvector",
	"redis":               "redis",
	"k8s":                 "kubernetes",
	"kubernetes":          "kubernetes",
	"docker":              "docker",
	"aws":                 "aws",
	"gcp":                 "gcp",
	"azure":               "azure",
	"graphql":             "graphql",
	"grpc":                "grpc",
	"ci/cd":               "ci_cd",
	"cicd":                "ci_cd",
	"distributed_systems": "distributed_systems",
	"system_design":       "system_design",
	"microservices":       "microservices",
	"flutter":             "flutter",
	"tailwindcss":         "tailwind_css",
	"tailwind":            "tailwind_css",
}

func NormalizeTag(rawTag string) string {
	cleaned := strings.ToLower(strings.TrimSpace(rawTag))
	cleaned = strings.ReplaceAll(cleaned, "-", "_")

	if canonical, exists := CanonicalVocabulary[cleaned]; exists {
		return canonical
	}
	return cleaned
}

func NormalizeTags(rawTags []string) []string {
	seen := make(map[string]bool)
	var normalized []string

	for _, tag := range rawTags {
		norm := NormalizeTag(tag)
		if norm != "" && !seen[norm] {
			seen[norm] = true
			normalized = append(normalized, norm)
		}
	}
	return normalized
}
