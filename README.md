# Healthcare Information System

A secure web application that simplifies healthcare management with features for patient records, doctor administration, and medical documentation.

![Healthcare Information System](https://via.placeholder.com/800x400?text=Healthcare+Information+System)

## Overview

This Healthcare Information System provides a comprehensive platform for managing patient care, doctor administration, and medical records with secure role-based access. The system is designed to streamline healthcare operations and improve efficiency in medical facilities.

## Features

- **Role-Based Access Control**: Separate interfaces for administrators and doctors
- **Patient Management**: Track patient records, history, and appointments
- **Doctor Administration**: Manage doctor profiles and patient assignments
- **Medical Reports**: Generate and store detailed medical reports
- **Secure Authentication**: Token-based security with proper expiration handling
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React.js, Material-UI
- **Backend**: Convex Database & API
- **Authentication**: Custom token-based authentication
- **State Management**: React Context API

## Installation

1. Clone the repository:

```bash
git clone https://github.com/JatinThakur2/healthcare-system.git
cd healthcare-system
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file and add your Convex API key:

```
REACT_APP_CONVEX_URL=your_convex_url
CONVEX_DEPLOY_KEY=your_key
CONVEX_DEPLOYMENT=your_key
```

4. Start the development server:

```bash
npm start
```

## Usage

### Admin Access

1. Register a main administrator account
2. Log in with administrator credentials
3. Manage doctors, patients, and system settings

### Doctor Access

1. Administrator creates doctor accounts
2. Doctors log in with provided credentials
3. Access and manage assigned patients

## Project Structure

```
healthcare-system/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication related components
│   │   ├── forms/          # Form components and validations
│   │   ├── layout/         # Layout components
│   │   └── common/         # Common UI elements
│   ├── pages/              # Application pages
│   │   ├── auth/           # Login and registration pages
│   │   ├── dashboard/      # Dashboard views for different user roles
│   │   ├── patients/       # Patient management pages
│   │   ├── doctors/        # Doctor management pages
│   │   └── reports/        # Report generation pages
│   ├── context/            # React context providers
│   │   ├── AuthContext.js  # Authentication context
│   │   └── ThemeContext.js # Theme context
│   ├── convex/             # Convex backend
│   │   ├── schema.ts       # Database schema
│   │   ├── auth.ts         # Authentication functions
│   │   ├── patients.ts     # Patient CRUD operations
│   │   ├── doctors.ts      # Doctor CRUD operations
│   │   └── reports.ts      # Report generation functions
│   ├── utils/              # Utility functions
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   └── theme.js            # MUI theme configuration
├── public/                 # Public assets
└── package.json            # Project dependencies
```

## Screenshots

![Login Screen](https://via.placeholder.com/400x200?text=Login+Screen)
![Dashboard](https://via.placeholder.com/400x200?text=Dashboard)
![Patient Management](https://via.placeholder.com/400x200?text=Patient+Management)

## Future Enhancements

- Patient Complete test report
- Patient report details
- Integrated billing system
- Medical inventory management
- Mobile application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Jatin Thakur - [Portfolio](https://jatin-thakur.vercel.app/) - jatinthakur3333@gmail.com

Project Link: [https://github.com/JatinThakur2/healthcare-system](https://github.com/JatinThakur2/healthcare-system)

---

Developed with ❤️ in Mandi, Himachal Pradesh, India
