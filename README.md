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
├── public/                      # Static files
│   ├── images/                  # Image assets
│   │   └── medical-pattern.svg  # Background pattern for UI
│   ├── index.html               # HTML entry point
│   ├── manifest.json            # Web app manifest
│   └── robots.txt               # SEO configuration
│
├── src/                         # Source code
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Common UI elements
│   │   │   └── LoadingSpinner.js # Loading indicator
│   │   ├── forms/               # Form components
│   │   │   ├── PatientDemographicsForm.js # Patient basic info
│   │   │   ├── MedicalHistoryForm.js     # Medical history
│   │   │   ├── ClinicalParametersForm.js # Clinical parameters
│   │   │   ├── LabResultsForm.js         # Lab results
│   │   │   ├── LifestyleRiskFactorsForm.js # Lifestyle factors
│   │   │   ├── TreatmentPlanForm.js      # Treatment plans
│   │   │   ├── SAQLIQuestionnaireForm.js # SAQLI questionnaire
│   │   │   └── saqli/                    # SAQLI sub-components
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   └── AppLayout.js     # Main app layout wrapper
│   │   │
│   │   └── views/               # View components
│   │       ├── MedicalHistoryView.js     # Medical history display
│   │       ├── PatientDemographicsView.js # Demographics display
│   │       ├── ClinicalParametersView.js  # Clinical data display
│   │       ├── LabResultsView.js          # Lab results display
│   │       ├── LifestyleRiskFactorsView.js # Risk factors display
│   │       ├── TreatmentPlanView.js       # Treatment plan display
│   │       └── SAQLIQuestionnaireView.js  # SAQLI questionnaire display
│   │
│   ├── context/                 # React context providers
│   │   ├── AuthContext.js       # Authentication context
│   │   └── ThemeContext.js      # Theme context
│   │
│   ├── convex/                  # Convex backend
│   │   ├── _generated/          # Auto-generated Convex files
│   │   ├── auth.ts              # Authentication functions
│   │   ├── auth_actions.ts      # Authentication action functions
│   │   ├── doctors.ts           # Doctor CRUD operations
│   │   ├── patients.ts          # Patient CRUD operations
│   │   ├── reports.ts           # Report generation functions
│   │   ├── schema.ts            # Database schema
│   │   ├── types.ts             # TypeScript type definitions
│   │   └── users.ts             # User operations
│   │
│   ├── pages/                   # Application pages
│   │   ├── auth/                # Authentication pages
│   │   │   ├── Login.js         # Login page
│   │   │   └── RegisterMainHead.js # Admin registration
│   │   │
│   │   ├── dashboard/           # Dashboard pages
│   │   │   ├── DoctorDashboard.js   # Doctor dashboard
│   │   │   └── MainHeadDashboard.js # Admin dashboard
│   │   │
│   │   ├── doctors/             # Doctor management pages
│   │   │   └── DoctorManagement.js  # Manage doctors
│   │   │
│   │   ├── landing/             # Public site pages
│   │   │   └── LandingPage.js   # Landing page
│   │   │
│   │   ├── patients/            # Patient management pages
│   │   │   ├── PatientsList.js  # List of patients
│   │   │   ├── PatientForm.js   # Add/edit patient form
│   │   │   └── PatientView.js   # View patient details
│   │   │
│   │   └── NotFound.js          # 404 page
│   │
│   ├── utils/                   # Utility functions
│   │   ├── export.js            # Data export utilities
│   │   ├── format.js            # Text formatting
│   │   └── validation.js        # Form validation
│   │
│   ├── App.js                   # Main application component
│   ├── App.css                  # Global styles
│   ├── index.js                 # Application entry point
│   ├── ConvexProvider.js        # Convex connection provider
│   └── theme.js                 # MUI theme configuration
│
├── .gitignore                   # Git ignore file
├── convex.json                  # Convex configuration
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
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
