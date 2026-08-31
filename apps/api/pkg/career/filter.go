package career

import (
	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type NodeFilter struct {
	NodeType *models.NodeType
	Tag      *string
	ParentID *uuid.UUID
}

func filterNodes(nodes []*models.CareerNode, filter NodeFilter) []*models.CareerNode {
	var res []*models.CareerNode
	for _, node := range nodes {
		if filter.NodeType != nil && node.NodeType != *filter.NodeType {
			continue
		}
		if filter.ParentID != nil && (node.ParentID == nil || *node.ParentID != *filter.ParentID) {
			continue
		}
		if filter.Tag != nil && !containsTag(node.Tags, *filter.Tag) {
			continue
		}
		res = append(res, node)
	}
	return res
}

func containsTag(tags []string, target string) bool {
	for _, t := range tags {
		if t == target {
			return true
		}
	}
	return false
}
