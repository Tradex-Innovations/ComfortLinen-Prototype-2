# ComfortLinen — corporate film prototype

A separate prototype inspired by JAT Holdings’ film-led hero, transparent corporate navigation, spacious typography and straightforward enquiry controls. Built in HTML, CSS and vanilla JavaScript. The existing `comfortlinen-experience` website and laundry management prototype are unchanged.

## Preview

Run `npm run dev` and open http://127.0.0.1:5180. No dependency installation is required. Run `npm run check` for source and asset validation; `npm run build` creates the standalone `dist/` folder.

## Media

The supplied `Comfort_by_Nature_Full_Film.mp4` is copied without alteration to `assets/comfort-by-nature.mp4`: 67 seconds, 1280 × 720, H.264, no audio track. The film fills a clear hero with one short headline, “Comfort, by nature.”, placed at the lower left. No paragraph or promotional call to action overlays the video. The logo, navigation and two small playback/viewer controls remain. The original film autoplays muted, with a pause control and a full-film viewer. Reduced-motion and data-saver preferences start with the poster instead.

`media.js` holds all section media paths. To add later videos, copy the supplied video into `assets/` and set the relevant `video` entry. The section keeps its photograph until a video is configured. Optional videos pause offscreen and respect reduced-motion preferences.

## Interactions

- Sticky navigation, mobile menu, section highlighting and native smooth scrolling.
- Service tabs with next/previous controls and keyboard arrow navigation.
- Sustainability accordion with corresponding imagery.
- Native film and enquiry dialogs with Escape and focus management.
- Enquiry form prepares an email draft for the visitor to review and send. No backend or message delivery is implied.
- Responsive layout, reduced-motion support, scroll reveals and restrained parallax.

Company copy, contact details, logo, co-founder portrait and existing photography are carried forward from the original ComfortLinen prototype. The name Mr. Gayanath Nanayakkara and Galle-to-UK story were supplied by the client. Reference: https://www.jatholdings.com/ and https://comfortlinen.co.uk/about-us/.

Copyright credit: Tradex Innovations.

## GitHub Pages

Prototype 2 has an independent GitHub Pages site: https://tradex-innovations.github.io/ComfortLinen-Prototype-2/ . The workflow validates and builds on pushes to main. In Settings → Pages, select GitHub Actions as the build source. All asset paths are relative and the original film is included unchanged.
