# Grow Day Release Checklist

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
- [ ] Saved log appears in Today.
- [ ] Archive tab opens correctly.
- [ ] Archive shows saved records by date.
- [ ] Archive record opens Detail.
- [ ] Detail edit flow opens Write.
- [ ] Detail delete flow removes the record.
- [ ] Search tab opens correctly.
- [ ] Search finds records by text or tag.
- [ ] Search result opens Detail.
- [ ] Report tab opens correctly.
- [ ] Report statistics update after create, edit, and delete.
- [ ] Empty states look natural for Today, Archive, Search, and Report.

## Localization Follow-up

- [ ] Add a settings screen flow for changing the selected language after onboarding.

## Android Store Settings

- [ ] App name confirmed: Grow Day.
- [ ] Package name confirmed: com.kolong4310.growday.
- [ ] Version confirmed in app.json.
- [ ] android.versionCode confirmed in app.json.
- [ ] android.versionCode will be increased before each production release.
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
