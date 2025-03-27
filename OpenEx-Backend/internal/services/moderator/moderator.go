package moderator

import (
	"log"
)

var (
	sightEngine *SightEngine
)

// Initialize sets up the content moderation services
func Initialize() {
	sightEngine = NewSightEngine()
	log.Println("Content moderation services initialized")
}

// EvaluateContent evaluates both text and image content
func EvaluateContent(title, description, imageURL string) (bool, float64, string) {
	// First check text content
	textApproved, textConfidence, textReason := ModerateText(title, description)
	if !textApproved {
		return false, textConfidence, textReason
	}

	// If no image provided, just return text moderation result
	if imageURL == "" {
		return true, textConfidence, ""
	}

	// Check image content
	imageApproved, imageConfidence, imageReason, err := sightEngine.ModerateImageURL(imageURL)
	if err != nil {
		log.Printf("Image moderation error: %v", err)
		// If image moderation fails, approve based on text alone
		return true, textConfidence, ""
	}

	// If image is not approved, reject content
	if !imageApproved {
		return false, imageConfidence, imageReason
	}

	// Both text and image are clean
	return true, (textConfidence + imageConfidence) / 2, ""
}
