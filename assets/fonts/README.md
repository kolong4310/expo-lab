Place a Korean-friendly pixel font here, for example:

- Galmuri11.ttf
- NeoDunggeunmo.ttf
- DungGeunMo.ttf

The current theme uses a safe `monospace` fallback so the app works without bundling a font file.
When a font file is added, load it with `expo-font` and point `RetroFonts.pixel` / `RetroFonts.title`
in `src/theme/theme.ts` to the registered family name.
