# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# My React App with Tailwind CSS

This project is a React application that utilizes Tailwind CSS for styling and includes routing for various pages related to a hostel management system.

## Project Structure

```
my-react-app
├── public
│   ├── index.html
├── src
│   ├── assets
│   ├── components
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   ├── pages
│   │   ├── BuySellRent.jsx
│   │   ├── ContactUs.jsx
│   │   ├── HostelSelection.jsx
│   │   ├── ItemListings.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Welcome.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── index.jsx
│   └── routes
│       └── index.jsx
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Features

- **Welcome Page**: A landing page that introduces the application and provides navigation options.
- **Login and Signup Pages**: Forms for user authentication and account creation.
- **Hostel Selection Page**: Allows users to select their hostel or view the default hostel.
- **Item Listings Page**: Displays items available for buying, selling, or renting.
- **Buy/Sell/Rent Page**: Provides details of selected items with options to buy, sell, or rent.
- **Contact Us Page**: A form for users to reach out for support or inquiries.
- **Reusable Components**: Navbar and Footer components are included on every page for consistent navigation and information.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd my-react-app
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

- Navigate through the application using the Navbar.
- Use the Login and Signup pages to manage user accounts.
- Explore the Item Listings and Buy/Sell/Rent pages for available items.
- Contact support through the Contact Us page.

## Technologies Used

- React
- Tailwind CSS
- Vite
- React Router

## License

This project is licensed under the MIT License.
