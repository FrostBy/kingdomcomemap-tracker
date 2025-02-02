# TamperMonkey Extension to Track Visited Markers on the [Map](https://kingdomcomemap.github.io/)
### This extension is designed for the map of `Kingdom Come: Deliverance` but can be easily adapted to any Leaflet map, as the marker handling logic is universal.

This is a stream-of-consciousness level version, so feel free to submit pull requests for refactoring and code improvements.

## 🐞 Known Issues

- **Checkboxes in the sidebar are not fully synchronized.**
  This doesn't affect the overall functionality, and fixing it was left for later (because, honestly, I didn’t feel like dealing with it).

## License

This project is licensed under a [custom license](./LICENSE).

- You are free to use, modify, and distribute the code as long as proper attribution is provided.
- **Commercial use is strictly prohibited without explicit written permission from the author.**
- For commercial licensing inquiries, please contact: frost.by@gmail.com.

## ☕ Support Me

If you find this project useful, consider supporting me on [Buy Me a Coffee](https://buymeacoffee.com/vladromanovsky).

---

## For Devs

1. Allow Tampermonkey's access to local file URIs [tampermonkey/faq](https://tampermonkey.net/faq.php?ext=dhdg#Q204)
2. install deps with `npm i` or `npm ci`.
3. `npm run dev` to start your development.

Now you will see 2 files in `./dist/`

-   `dist/index.dev.user.js`: **You should install this userscript in your browser.** It's a simple loader that load `dist/index.debug.js` on matched web page.
-   `dist/index.debug.js`: This is the development build with `eval-source-map`. It will be automatically loaded by `dist/index.dev.user.js` via `@require file://.../dist/index.debug.js` metadata, **Don't add it to your userscript manager.**

4. edit [src/index.ts](./src/index.ts), you can even import css or less files. You can use scss if you like.
5. go wo <https://www.example.com/> and open console, you'll see it's working.

livereload is default enabled, use [this Chrome extension](https://chrome.google.com/webstore/detail/jnihajbhpnppcggbcgedagnkighmdlei)

### NOTICE

Everytime you change your metadata config,
you'll have to restart webpack server and install newly generated `dist/index.dev.user.js` UserScript in your browser again.

### UserScript way

like original UserScript way, you will need to add them to your [user script metadata's require section](./config/metadata.cjs) , and exclude them in [config/webpack.config.base.cjs](./config/webpack.config.base.cjs)

### Webpack way

just install packages with npm and import them in your code, webpack will take care them.

## Build

```bash
npm run build
```

`dist/index.prod.user.js` is the final script. you can manually copy it to greasyfork for deploy.
