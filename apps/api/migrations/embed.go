package migrations

import "embed"

//go:embed *.up.sql
var MigrationFS embed.FS
