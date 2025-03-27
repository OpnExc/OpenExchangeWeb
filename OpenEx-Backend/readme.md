```cmd
cd OpenEx-Backend
go run cmd/api/main.go
```

# OpenEx API Documentation

This README explains the API routes in the OpenEx marketplace, a platform for exchanging and selling items within hostel communities.

## 🔄 Table of Contents
- Authentication Routes
- Hostel Routes
- Item Routes
- Transaction Request Routes
- Requested Item Routes
- User Routes
- Admin Routes
- Common Workflows

## 🔐 Authentication Routes

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| POST | `/signup` | `Signup` | Register a new user with name, email, password, contact details, and hostel ID |
| POST | `/login` | `Login` | Authenticate user and return JWT token |
| POST | `/google-auth` | `GoogleAuth` | Authenticate user with Google credentials |

## 🏠 Hostel Routes

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `/hostels` | `ListHostels` | List all available hostels |
| POST | `/admin/hostels` | `CreateHostel` | Create a new hostel (admin only) |

## 📦 Item Routes

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `/hostels/:id/items` | `ListItemsByHostel` | List all approved items for a specific hostel |
| POST | `/items` | `CreateItem` | Create a new item for sale or exchange |
| GET | `/items/:id` | `GetItem` | Get details of a specific item |
| GET | `/my-items` | `GetUserItems` | Get all items created by the authenticated user |

## 🤝 Transaction Request Routes

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| POST | `/requests` | `CreateRequest` | Create a new transaction request to buy or exchange an item |
| GET | `/requests` | `ListRequests` | List all transaction requests for the authenticated user |
| PATCH | `/requests/:id/approve` | `ApproveRequest` | Approve a transaction request (seller only) |

## 🔍 Requested Item Routes

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `/requested-items` | `ListRequestedItems` | List all open requested items |
| POST | `/requested-items` | `CreateRequestedItem` | Create a new item request (buyer looking for something) |
| POST | `/requested-items/fulfill` | `FulfillRequestedItem` | Fulfill a requested item (sellers offering the requested item) |
| GET | `/my-requested-items` | `GetMyRequestedItems` | List all requested items created by the authenticated user |
| PATCH | `/requested-items/:id/close` | `CloseRequestedItem` | Close a requested item (buyer only) |

## 👤 User Routes

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `/user` | `GetUserDetails` | Get authenticated user's details |
| PATCH | `/user` | `EditUserDetails` | Edit authenticated user's details |

## 👑 Admin Routes

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `/admin/items` | `ListPendingItems` | List all pending items awaiting approval |
| PATCH | `/admin/items/:id/approve` | `ApproveItem` | Approve a pending item |
| PATCH | `/admin/items/:id/reject` | `RejectItem` | Reject a pending item |
| POST | `/admin/hostels` | `CreateHostel` | Create a new hostel |

## 🔄 Common Workflows

### When a Buy/Exchange Request is Accepted by the Seller

When a seller approves a transaction request via `/requests/:id/approve`:

1. The request status changes from "pending" to "approved"
2. The API response includes contact details of both parties:
   ```json
   {
      "request": {  },
      "seller_contact": "seller's contact information",
      "buyer_contact": "buyer's contact information"
   }
   ```
3. The frontend should display these contact details to both users so they can arrange the transaction in person
4. **Privacy Note**: Contact details are only revealed after explicit approval by the seller

### When a Requested Item is Fulfilled

When a seller fulfills a requested item via `/requested-items/fulfill`:

1. A new item is automatically created in the system
2. A transaction request is automatically created with status "pending"
3. The requested item's status changes from "open" to "fulfilled"
4. The buyer gets notified that someone has fulfilled their request
5. The buyer must then approve the transaction request through the regular flow
6. Once approved, contact details are revealed to both parties

## 🔒 Security Notes

- Authentication is handled via JWT tokens
- Tokens must be included in the `Authorization` header for authenticated routes
- Contact details are only revealed after explicit approval of transactions
- All sensitive routes require authentication

## 🧩 Data Models

- **User**: Contains name, email, password (hashed), contact details, hostel info
- **Item**: Contains title, description, price, image, status, type (sell/exchange)
- **TransactionRequest**: Details about a transaction between buyer and seller
- **RequestedItem**: An item a buyer is looking for but isn't currently available
- **Hostel**: Contains hostel name and ID

## 📝 Additional Notes

- Items require admin approval before appearing in listings
- Users can request specific items they're looking for
- Transaction requests can be for buying or exchanging items
- Contact between users happens outside the platform after a request is approved

## 🛠️ Service Marketplace Routes

| Method | Endpoint | Function | Description |
|--------|----------|----------|-------------|
| GET | `/services` | `ListServices` | List all approved services offered by users |
| POST | `/services` | `CreateService` | Create a new service offering |
| GET | `/my-services` | `GetMyServices` | List all services created by the authenticated user |
| GET | `/service-requests` | `ListServiceRequests` | List all open service requests |
| POST | `/service-requests` | `CreateServiceRequest` | Create a new service request |
| GET | `/my-service-requests` | `GetMyServiceRequests` | List all service requests created by the authenticated user |
| PATCH | `/service-requests/:id/accept` | `AcceptServiceRequest` | Accept a service request as a provider |
| PATCH | `/service-requests/:id/complete` | `CompleteServiceRequest` | Mark a service request as completed (requester only) |
| PATCH | `/service-requests/:id/cancel` | `CancelServiceRequest` | Cancel an open service request (requester only) |
| GET | `/service-requests/taken` | `GetServiceRequestsITook` | List all service requests the user has accepted |
| GET | `/admin/services` | `ListPendingServices` | List all pending services (admin only) |
| PATCH | `/admin/services/:id/approve` | `ApproveService` | Approve a pending service (admin only) |
| PATCH | `/admin/services/:id/reject` | `RejectService` | Reject a pending service (admin only) |

## Common Service Workflows

### When a User Offers a Service

1. User creates a service offering via `/services`
2. Admin approves the service via `/admin/services/:id/approve`
3. Service becomes visible to all users in the marketplace

### When a User Requests a Service

1. User creates a service request via `/service-requests`
2. The request appears in the service request listings
3. Another user can accept the request via `/service-requests/:id/accept`
4. When accepted, contact details are revealed to both parties
5. Once the service is completed, the requester marks it complete via `/service-requests/:id/complete`

### Contact Information Sharing

- For service requests, contact information is shared when a provider accepts a request
- This allows requester and provider to communicate directly about the service
- The system response includes both parties' contact details

# Automatic Content Moderation System Documentation

## Overview

The OpenEx platform includes an automatic content moderation system that evaluates and approves/rejects pending items and services without requiring administrator intervention after a configurable waiting period.

## Architecture

The auto-moderation system consists of three main components:

1. **Auto-Approver Worker**: A background process that periodically checks for pending content
2. **Text Moderator**: Analyzes text content for inappropriate keywords and phrases
3. **Image Moderator**: Uses SightEngine API to detect inappropriate visual content

## How It Works

### Workflow

1. When users submit new items or services, they are placed in a "pending" status
2. Administrators can manually review and approve/reject these submissions
3. If no action is taken within a configurable time period (default: 24 hours):
   - The auto-approver worker identifies expired pending content
   - Content is analyzed using text and image moderation services
   - Based on analysis results, content is either auto-approved or auto-rejected
   - Actions are logged with confidence scores and rejection reasons

### Code Implementation

The system is implemented in the following files:

- auto_approver.go: Background worker that manages the auto-approval process
- moderator.go: Coordinates text and image analysis
- `internal/services/moderator/text_moderator.go`: Checks text for inappropriate content
- `internal/services/moderator/sightengine.go`: Analyzes images using the SightEngine API

#### Auto-Approver Worker

```go
// StartAutoApprover initializes the background worker
func StartAutoApprover() {
    // Initialize the moderation service
    moderator.Initialize()
    
    // Run hourly checks for pending content
    ticker := time.NewTicker(1 * time.Hour)
    go func() {
        for range ticker.C {
            processExpiredPendingItems()
            processExpiredPendingServices()
        }
    }()
}
```

#### Content Evaluation Process

```go
// processExpiredPendingItems checks items awaiting approval
func processExpiredPendingItems() {
    // Find items that have been pending too long
    cutoffTime := time.Now().Add(-GetWaitPeriod())
    database.DB.Where("status = ? AND created_at < ?", "pending", cutoffTime).Find(&items)
    
    // For each item, evaluate content and approve/reject
    for _, item := range items {
        approved, confidence, reason := moderator.EvaluateContent(
            item.Title,
            item.Description,
            item.Image
        )
        
        if approved {
            item.Status = "approved"
        } else {
            item.Status = "rejected"
        }
        
        database.DB.Save(&item)
    }
}
```

## Moderation Pipeline

### Text Moderation

Text moderation checks titles and descriptions against a list of inappropriate keywords:

```go
// ModerateText checks if text contains inappropriate content
func ModerateText(title, description string) (bool, float64, string) {
    combinedText := strings.ToLower(title + " " + description)
    
    // Check for inappropriate keywords
    for _, keyword := range inappropriateKeywords {
        if strings.Contains(combinedText, keyword) {
            return false, 0.9, "Contains inappropriate keyword: " + keyword
        }
    }
    
    return true, 1.0, ""
}
```

### Image Moderation

Image moderation uses the SightEngine API to analyze images for:
- Adult content
- Violence
- Weapons
- Alcohol
- Drugs
- Offensive content

```go
// ModerateImageURL checks an image for inappropriate content
func (s *SightEngine) ModerateImageURL(imageURL string) (bool, float64, string, error) {
    // Call SightEngine API to analyze the image
    // Returns approval decision, confidence score, and rejection reason
}
```

## Configuration

The auto-approval system can be configured through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `AUTO_APPROVE_WAIT_HOURS` | Hours to wait before auto-processing | 24 |
| `SIGHTENGINE_API_USER` | SightEngine API user for image analysis | Required |
| `SIGHTENGINE_API_KEY` | SightEngine API key for image analysis | Required |

Example `.env` configuration:
```
AUTO_APPROVE_WAIT_HOURS=48
SIGHTENGINE_API_USER=your_api_user
SIGHTENGINE_API_KEY=your_api_key
```

## Confidence Scores

The system uses confidence scores (0.0-1.0) to determine content safety:
- Higher scores indicate greater confidence in content safety
- Text analysis typically returns 1.0 (safe) or 0.9 (unsafe)
- Image analysis returns a scaled score based on detected issues
- Overall confidence is the average of text and image confidence
- Content is rejected if score falls below 0.7

## Logging

The system logs all auto-moderation actions:

```
Auto-approved item #42 (confidence: 0.95)
Auto-rejected item #43: Contains adult content (confidence: 0.25)
```

## Technical Considerations

1. **Fault Tolerance**: If image analysis fails, the system falls back to text-only moderation
2. **Performance**: The worker processes in the background on a schedule, not affecting user experience
3. **Accuracy**: While providing efficient automation, no ML system is perfect - there will be some false positives/negatives
4. **Customization**: The inappropriate keyword list can be expanded for specific needs

This automatic moderation system reduces the administrative burden while maintaining content quality standards across the OpenEx marketplace.