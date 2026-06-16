# Grow Day Data Safety Draft

This document is a draft to help prepare Play Console Data safety answers. It is based on the current app structure: no login, no server database, and local SQLite storage on the user's device.

## Account Creation

Question: Does the app require users to create an account?

Recommended answer:

- No.

Notes:

- Grow Day does not require account sign-up or login.
- The app does not collect email addresses, phone numbers, or profile data for account creation.

## Data Collection

Question: Does the app collect user data?

Recommended answer based on the current app structure:

- No user data is collected by the developer.

Notes:

- Users can create records inside the app.
- Those records are stored locally on the user's device using SQLite.
- The app does not send those records to a developer-operated server.

## Data Sharing

Question: Does the app share user data with third parties?

Recommended answer:

- No.

Notes:

- Grow Day does not share user-created records with third parties.
- No external server transfer is currently implemented for user records.

## Data Sent to a Server

Question: Does the app send data to a server?

Recommended answer:

- No.

Notes:

- Work logs, goals, tags, mood values, and report-related records remain on the device.
- There is currently no backup, sync, or server database feature.

## Sensitive Data Categories

Current app structure review:

- Location: Not used.
- Contacts: Not used.
- Photos or videos: Not used.
- Audio files: Not used.
- Files and documents: Not used for app records.
- Calendar: Not used.
- Advertising ID: Not used.
- Health data: Not used.
- Financial information: Not used.
- Messages: Not used.

## User-Created Record Data

Users may enter:

- Work log titles
- Daily summaries
- Detailed notes
- Learned items
- Issues and solutions
- Memos
- Tags
- Mood status
- Goal records

Storage location:

- Local SQLite database on the user's device.

Server transfer:

- None in the current app structure.

## Data Deletion

Current app behavior:

- Users can delete individual work logs inside the app.
- Users can delete some goal items depending on the app flow.
- If the app is uninstalled, local data may be deleted by the operating system.

Data deletion request guidance:

- Because Grow Day does not operate a server account or server database for user records, there is no remote user data for the developer to delete.
- For Play Console or public policy text, explain that users can delete local records in the app or remove the app from the device.

## Current Recommended Data Safety Position

Based on the current implementation:

- Account required: No.
- Data collected by developer: No.
- Data shared with third parties: No.
- User records sent to server: No.
- Local storage: Yes, user-created records are stored on-device using SQLite.
- Backup/sync: No.
- Ads/advertising ID: No.

## Items to Recheck Before Submission

- Confirm no analytics SDK has been added.
- Confirm no crash reporting SDK has been added.
- Confirm no advertising SDK has been added.
- Confirm no cloud backup or sync feature has been added.
- Confirm permissions in app config remain minimal.
- Confirm the published privacy policy URL matches the current app behavior.
