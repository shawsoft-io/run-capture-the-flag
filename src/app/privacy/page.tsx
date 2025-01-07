import ReactMarkdown from "react-markdown"

export default function Page() {
  

const privacyPolicy = `

Shawsoft is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our app and services.

By using Capture The Flag Run, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our services.

---

## **1. Information We Collect**

We collect the following information to provide and improve our services:

### a) Strava Data
- Your **profile information** (e.g., name, profile picture).
- Your **activity data**, including date, distance, and pace for relevant runs.
- Your **location data**, specifically city names associated with your activities.

### b) Account Information
- Your Strava user ID and authentication tokens.

### c) App Usage Data
- Information about how you interact with the app, such as leaderboard participation and city captures.

---

## **2. How We Use Your Information**

We use your information to:
- Facilitate the "Capture the Flag" competition by tracking activities and ranking participants.
- Display leaderboards and update city ownership status.
- Notify users about competition updates and status changes.
- Improve our app’s functionality and user experience.

---

## **3. How We Share Your Information**

We do not sell your personal data to third parties. Your information is shared only in the following circumstances:

### a) With Other Users
- Your name, profile picture, and activity data are visible on leaderboards and in the competition context.

### b) With Service Providers
- We may share your data with trusted third-party providers to operate the app (e.g., hosting, analytics).

### c) As Required by Law
- We may disclose your data if required to comply with legal obligations or protect the rights and safety of our users.

---

## **4. Data Security**

We take reasonable measures to protect your data from unauthorized access, disclosure, or misuse. These measures include:
- Encrypting sensitive data in transit and at rest.
- Storing authentication tokens securely.
- Regularly reviewing security practices.

---

## **5. Your Rights and Choices**

You have the following rights regarding your data:

### a) Revoke Access
You can disconnect your Strava account at any time through the app settings.

### b) Data Deletion
You can request the deletion of your account and associated data by contacting us at [support email].

### c) Update Preferences
You can adjust privacy preferences through your Strava account or app settings.

---

## **6. Cookies and Analytics**

Our app may use cookies and analytics tools to improve functionality and monitor usage patterns. These tools collect non-identifiable data, such as device type and interaction data, to help us enhance our services.

---

## **7. Data Retention**

We retain your information only as long as necessary to provide the app’s services or as required by law. When you disconnect your Strava account, your data is permanently deleted from our systems.

---

## **8. Changes to This Privacy Policy**

We may update this Privacy Policy from time to time. Changes will be communicated through the app or via email. Continued use of the app constitutes acceptance of the updated policy.

---

## **9. Contact Us**

If you have any questions or concerns about this Privacy Policy, please contact us at:

**Email:** support@shawsoft.io 

---

By using Capture The Flag Run, you acknowledge that you have read and understood this Privacy Policy.
`

  return (
    <>
    

    <div className="absolute w-full h-40 bg-hotpink z-10"></div>
<div className="flex min-h-full flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-hotpink mt-40 z-20">

<div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src="/run-3d.png"
            className="mx-auto h-[260px] sm:h-18 w-auto"
          />

        </div>
    <div className="flex flex-col items-center justify-center  h-full py-20 gap-y-5">
      
      <div className="max-w-7xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2">Privacy policy</h1>
        <h2 className="text-lg text-gray-500 text-center mb-4">Last updated January 5, 2025</h2>
        <div className="flex flex-col space-y-4 text-sm">
        
        <ReactMarkdown>{privacyPolicy}</ReactMarkdown>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

