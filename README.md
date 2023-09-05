# Wikip Admin Console

written by Chris Osborn (cosbor11)

## Summary

Fully functional dashboard equipped with extensive authentication, user management, and profile customization. The application has been built with an emphasis on security and reusability

## Overview

This application serves as a barebones dashboard equipped with authentication and user management features. Users can sign in through Google or with their email and password, making use of a sleek and user-friendly interface. Leveraging modern web technologies such as Next.js, React, Tailwind CSS, and Firebase, it provides comprehensive tools for managing user interactions and back-end database processes.

Users are stored in Firebase Authentication, and registration and reset codes are stored in a Firebase Firestore database. You can associate your application's users by Firebase UID or email, and in your system, it is suggested to store user details in a UserProfile entity. Styled with Tailwind CSS and following strict coding standards, this application ensures a responsive and efficient user experience.

## Features

### Authentication and User Management

#### Google Sign-In

Utilizes Firebase's built-in OAuth2 flow to handle Google sign-in. The Firebase client SDK simplifies the process of acquiring user consent and retrieving an authentication token, allowing users to authenticate with their Google credentials easily.

#### Email & Password Authentication

The code employs Firebase's `createUserWithEmailAndPassword` and `signInWithEmailAndPassword` methods to handle registration and sign-in. Passwords are securely handled within Firebase, ensuring that manual encryption isn't needed in the codebase.

#### Token-Based Authentication

Token-based authentication is implemented to verify users. The token is extracted from the request headers and verified using Firebase Admin's `verifyIdToken` method. Once verified, the UID is extracted, and the user's information is fetched, ensuring authenticated and authorized access.

#### Email Verification

During registration, a custom verification email is sent using configuable SMTP settings. This process confirms the authenticity of the email address, enhancing security.

#### User Profile Retrieval

The user's accessToken is used to fetch user details like email, profile picture, and other information from Firebase. It extracts relevant information and sends it as a response, allowing for personalized user experiences.

### Registration and Security

#### Registration Codes Handling

The application uses Firebase Firestore to store registration codes. When a user attempts to register, the code is checked against the user's email and code provided. If a match is found, registration continues; otherwise, an error is returned.

#### User Email Existence Check

Using Firebase Admin's `getUserByEmail` method, the code checks if an email already exists. If the email is found, a response indicating its existence is sent. If not, the email is deemed available for registration.

#### Password Reset Codes

For password recovery, the application sends a custom password reset email method to to the user's email. This abstraction includes generating a secure token and handling email delivery, simplifying the reset process for users.

#### Llama Pic Feature (Profile Picture)

One unique feature is the setting of a default profile picture if the user doesn't provide one during registration. A random llama image is chosen from a predefined set, adding a playful and fun aspect to profiles, ensuring that no profile is left with a blank image, and enhancing the overall user experience.

## Technologies Used

### Frontend
- **React**: Utilized for building the user interface components.
- **Next.js**: Framework that enables server-side rendering and generates static websites for React-based web applications.
- **Tailwind CSS**: Used for styling the application, allowing for fast development without writing custom CSS.

### Backend
- **Firebase**: 
  - **Authentication**: Provides authentication services, including Google Sign-In, email & password authentication, token-based authentication, and email verification.
  - **Firestore**: Used for storing registration codes, user emails, and handling password reset processes.

### Development
- **TypeScript**: Used across the codebase for static typing, enhancing code quality and maintainability.
- **Node.js**: Employs the Next.js framework and other server-side processes.
- **AWS**: Configuration for Amazon Web Services, specifically S3 bucket handling.
- **Vercel**: For deployment and hosting of the Next.js application.
- **Tailwind CSS IntelliSense**: VS Code extension to enable code completion for Tailwind CSS classes.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your system.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/cosbor11/wikiup-admin-web.git
   ```

2. Install and setup `awscli`: 

```bash
brew install awscli
#then
aws configure
```
3. Setup two private AWS bucket for access and grant your user read, write, and list access to them: 
     - {your-app-name}-web-assets

4. You will need to setup gmail SMTP by enabling 2-Step Verification and setting an applicationId.
5. Update `.env.local` with your settings
6. Run the development server:
    ```bash
    npm run dev
    ```
Or you can run the `Debug` configurtion in `launch.json`

7. See the Application in action:
 - Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Install Tailwind IDE CSS IntelliSense
 - run `npm install -D tailwindcss`
 - Install vscode extension: Tailwind CSS IntelliSense
Now you can do code completion for classes

### Running in Production mode
1. run `npm run install`
2. run `npm run start`

## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
