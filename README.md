# Abdullah Waqar — Cinematic Portfolio

A cinematic, animated single-page portfolio inspired by the supplied reference video.

## Included
- Large editorial hero typography
- Scroll reveal animations
- Infinite skills marquee
- Animated project cards
- Experience timeline
- Responsive mobile layout
- GitHub + LinkedIn + email + resume links
- **Persistent animated WhatsApp button on every section**
- **300 supplied portrait frames** in `assets/frames/`
- Scroll-controlled human frame animation: scrolling changes the displayed frame
- WhatsApp number from the supplied resume: +92 326 8591728
- Resume included in `public/`

## Run
No build step is required.

1. Open the folder in VS Code.
2. Use VS Code Live Server, or run any static server.
3. Open `index.html`.

For deployment, this can be hosted directly on Vercel, Netlify, GitHub Pages, or any static hosting provider.

## Main files
- `index.html`
- `style.css`
- `script.js`
- `public/Abdullah-Waqar-Resume.docx`


### Frame-matched visual theme
The supplied portrait frames use a pale ice-blue/grey studio background, warm orange clothing, white/cream highlights and dark navy details. The portfolio UI now follows that same palette instead of the previous neon/dark palette. The 300 supplied frames remain inside `assets/frames/` for the scroll-controlled hero.


## Full-page frame behavior
The 300 supplied portrait frames are **not restricted to the introduction**.

They are mapped to the visitor's **entire document scroll progress**:
- Top of page = frame 1
- Scrolling through About = continuing frames
- Work/projects = continuing frames
- Skills = continuing frames
- Experience = continuing frames
- Contact/bottom = frame 300

The portrait canvas is fixed behind the whole portfolio, so the human continues moving as the visitor scrolls through every section.


## Responsive dual-frame system

This portfolio now contains **two frame sequences**:

### Desktop
Uses the newly supplied landscape frames:
- 239 frames
- 1280×720
- `assets/frames/desktop/`
- Used automatically on screens wider than 767px
- Designed for desktop so the face and full composition remain visible

### Mobile
Uses the original portrait frames:
- 300 frames
- 720×1280
- `assets/frames/mobile/`
- Used automatically at 767px and below
- Better suited to phone portrait screens

The full-page scroll position controls whichever sequence is active. If the visitor changes screen size/orientation, the engine switches sequences automatically.

### GitHub/Vercel optimization
The frame JPGs were converted to WebP at quality 72 to substantially reduce repository/deployment size while keeping the visual quality suitable for a portfolio.
