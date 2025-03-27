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
      "request": { /* request details */ },
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