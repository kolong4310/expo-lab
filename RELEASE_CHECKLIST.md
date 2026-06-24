# Tiny Growth Release Checklist

## Build Checks

- [ ] Preview build completed successfully.
- [ ] Preview APK installed on a real Android device.
- [ ] App launches normally after installation.
- [ ] App relaunch keeps existing local SQLite data.
- [ ] Production build has not been run until final review is complete.

## Core Flow Checks

- [ ] Today tab opens correctly.
- [ ] First launch shows LanguageSelect when no language is saved.
- [ ] Selected language is persisted and LanguageSelect does not reappear on relaunch.
- [ ] Write screen opens from Today.
- [ ] A new log can be saved.
- [ ] Growth feedback modal appears after saving a new log.
- [ ] Edit feedback modal appears after updating an existing log.
- [ ] Growth feedback modal copy is checked in ko/en/ja/zh.
- [ ] Growth feedback modal animation and layout work on a small Android screen.
- [ ] Growth feedback modal does not appear after a save failure.
- [ ] Saved log appears in Today.
- [ ] Archive tab opens correctly.
- [ ] Archive shows saved records by date.
- [ ] Archive record opens Detail.
- [ ] Detail edit flow opens Write.
- [ ] Detail delete flow removes the record.
- [ ] Search tab opens correctly.
- [ ] Search finds records by text or tag.
- [ ] Search result opens Detail.
- [ ] Settings tab opens correctly.
- [ ] Settings language change updates app text immediately.
- [ ] Settings language change persists after app relaunch.
- [ ] Major screens preserve readable contrast in the light pastel theme.
- [ ] Text, cards, inputs, chips, and buttons remain legible in normal, focused, selected, pressed, disabled, and error states where applicable.
- [ ] Layouts do not clip or overlap on a small Android screen.
- [ ] Store screenshot candidates preserve the Tiny Growth light pastel tone.
- [ ] Report tab opens correctly.
- [ ] Report statistics update after create, edit, and delete.
- [ ] Empty states look natural for Today, Archive, Search, Report, and Settings.

## Localization Follow-up

- [x] Add a settings screen flow for changing the selected language after onboarding.

## Android Store Settings

- [ ] App name confirmed: Tiny Growth.
- [ ] Package name confirmed: com.kolong4310.growday.
- [ ] Version confirmed in app.json.
- [ ] Baseline android.versionCode confirmed in app.json.
- [ ] Production profile confirmed to use `autoIncrement: true` in eas.json.
- [ ] Highest versionCode already uploaded to Play Console is checked before the production build.
- [ ] Final production AAB versionCode is confirmed to be greater than every versionCode already uploaded to Play Console.
- [ ] App icon checked on device.
- [ ] Adaptive icon checked on device.
- [ ] Splash screen checked on device.
- [ ] Orientation confirmed as portrait.
- [ ] Permissions reviewed and no unnecessary permissions added.

## Play Console Preparation

- [ ] Store listing short description prepared.
- [ ] Store listing long description prepared.
- [ ] Screenshot captions prepared.
- [x] Privacy policy draft prepared.
- [x] Privacy policy public URL created.
- [ ] Privacy policy URL opens from a private/incognito browser window.
- [ ] Privacy policy URL entered in Play Console.
- [ ] Play Console app name entered as Tiny Growth.
- [ ] If Play Console already has Grow Day, update it manually to Tiny Growth.
- [ ] Privacy Policy Notion page title and body updated to Tiny Growth.
- [x] Play Console Data safety answers prepared as a draft.
- [ ] Data storage explanation prepared: records are stored locally on-device using SQLite.
- [ ] Confirmed no login/account system.
- [ ] Confirmed no external server database for user records.
- [ ] Confirmed no backup/sync feature currently provided.

Privacy Policy URL:

```text
https://app.notion.com/p/3813fa1a756d8053bfaed38be72f1a2e?source=copy_link
```

## Credentials and Release Safety

- [ ] EAS credentials reviewed.
- [ ] Keystore and credentials are not deleted.
- [ ] Keystore and credentials are not committed to the repository.
- [ ] Production build profile reviewed.
- [ ] Production build should use AAB.
- [ ] Final production build command is run only after checklist completion.

## Final Commands

Preview build:

```bash
npm run build:android:preview
```

Production build:

```bash
npm run build:android:production
```
