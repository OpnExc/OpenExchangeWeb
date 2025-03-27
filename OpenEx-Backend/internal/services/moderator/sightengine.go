package moderator

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
)

// SightEngineResponse represents the response from SightEngine API
type SightEngineResponse struct {
	Status  string `json:"status"`
	Request struct {
		ID     string  `json:"id"`
		Time   float64 `json:"time"`
		Media  string  `json:"media"`
		Events struct {
			Error string `json:"error"`
		} `json:"events"`
	} `json:"request"`
	Nudity struct {
		Raw       float64 `json:"raw"`
		Partial   float64 `json:"partial"`
		SafeScore float64 `json:"safe"`
	} `json:"nudity"`
	Weapon    float64 `json:"weapon"`
	Alcohol   float64 `json:"alcohol"`
	Drugs     float64 `json:"drugs"`
	Offensive float64 `json:"offensive"`
	Violence  float64 `json:"violence"`
}

// SightEngine is a client for the SightEngine content moderation API
type SightEngine struct {
	APIUser string
	APIKey  string
}

// NewSightEngine creates a new SightEngine client
func NewSightEngine() *SightEngine {
	return &SightEngine{
		APIUser: os.Getenv("SIGHTENGINE_API_USER"),
		APIKey:  os.Getenv("SIGHTENGINE_API_KEY"),
	}
}

// ModerateImageURL checks an image URL for inappropriate content
func (s *SightEngine) ModerateImageURL(imageURL string) (bool, float64, string, error) {
	// Create form data
	formData := url.Values{}
	formData.Set("api_user", s.APIUser)
	formData.Set("api_secret", s.APIKey)
	formData.Set("url", imageURL)
	formData.Set("models", "nudity,weapon,alcohol,drugs,offensive,violence")

	// Create and execute request
	client := &http.Client{}
	req, err := http.NewRequest("POST", "https://api.sightengine.com/1.0/check.json",
		strings.NewReader(formData.Encode()))
	if err != nil {
		return false, 0, "Error creating request", err
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return false, 0, "Error making request", err
	}
	defer resp.Body.Close()

	// Parse response
	var result SightEngineResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, 0, "Error parsing response", err
	}

	// Check if there was an API error
	if result.Request.Events.Error != "" {
		return false, 0, fmt.Sprintf("API error: %s", result.Request.Events.Error), nil
	}

	// Calculate overall safety score - lower score means more inappropriate content
	safety := 1.0 - max(
		result.Nudity.Raw,
		result.Nudity.Partial,
		result.Weapon,
		result.Alcohol,
		result.Drugs,
		result.Offensive,
		result.Violence,
	)

	// Determine if image is safe - threshold of 0.7 (70% safe)
	isSafe := safety >= 0.7

	// Generate reason for rejection if not safe
	var reason string
	if !isSafe {
		if result.Nudity.Raw > 0.3 || result.Nudity.Partial > 0.3 {
			reason = "Adult content detected"
		} else if result.Violence > 0.3 {
			reason = "Violent content detected"
		} else if result.Weapon > 0.3 {
			reason = "Weapon detected"
		} else if result.Alcohol > 0.3 {
			reason = "Alcohol content detected"
		} else if result.Drugs > 0.3 {
			reason = "Drug-related content detected"
		} else if result.Offensive > 0.3 {
			reason = "Offensive content detected"
		} else {
			reason = "Inappropriate content detected"
		}
	}

	return isSafe, safety, reason, nil
}

// Helper function for finding maximum value
func max(values ...float64) float64 {
	if len(values) == 0 {
		return 0
	}

	maxVal := values[0]
	for _, v := range values[1:] {
		if v > maxVal {
			maxVal = v
		}
	}
	return maxVal
}
