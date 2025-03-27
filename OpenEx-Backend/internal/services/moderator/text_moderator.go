package moderator

import (
	"strings"
)

// List of problematic keywords to check for
var inappropriateKeywords = []string{
	"sex", "porn", "xxx", "adult", "nude", "naked",
	"gambling", "casino", "bet", "betting",
	"viagra", "cialis", "drug", "cocaine", "heroin", "weed",
	"kill", "murder", "terrorist", "bomb", "suicide",
	"obscene", "offensive",
	// Add more keywords as needed
}

// ModerateText checks if text contains inappropriate content
func ModerateText(title, description string) (bool, float64, string) {
	combinedText := strings.ToLower(title + " " + description)

	// Check each inappropriate keyword
	for _, keyword := range inappropriateKeywords {
		if strings.Contains(combinedText, keyword) {
			return false, 0.9, "Contains inappropriate keyword: " + keyword
		}
	}

	// If we get here, the text seems safe
	return true, 1.0, ""
}
