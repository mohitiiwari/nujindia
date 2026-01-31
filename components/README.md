# NUJ India – Component Structure

The main page `index.html` is organized into logical **components** (sections). Each block is marked with a comment like `<!-- COMPONENT: Name -->` so you can locate and edit it easily.

## Component list (in order)

| Component        | Location in index.html | Description                    |
|-----------------|------------------------|--------------------------------|
| Top Bar         | After `<body>`         | Social icons + Publications/Subscribe |
| Affiliation Strip | After top bar        | IFJ affiliation line          |
| Header          | Main header            | Logo + mobile menu toggle      |
| Navigation      | `.organization-strip` | Desktop nav links              |
| Mobile Menu     | Overlay                | Full-screen mobile nav         |
| Hero            | `.hero`                | Hero text + CTA buttons        |
| News & Photo Slider | `.news-slider`     | Photo carousel + latest news   |
| Leadership      | `.leadership`          | Leadership cards                |
| Features        | `.features`            | “What We Stand For” cards      |
| News & Highlights | `.news-highlights`   | Local news + In Focus slideshow |
| Zones           | `.zones`               | East/West/South/North/Center    |
| Content         | `.content-section`     | Press releases, letters, enquiry form |
| Media Gallery   | `.media-gallery-section` | Video + photo galleries     |
| Lightbox        | `#lightbox`            | Photo lightbox                 |
| Footer          | `footer`               | Contact, links, newsletter    |

## Styling

- **styles.css** – Global and component styles; responsive breakpoints at 1200px, 968px, 768px, 640px, 480px.
- Components use shared CSS variables in `:root` (e.g. `--primary`, `--accent`).

## Scripts

- **script.js** – Mobile menu, hero scroll, content carousel, enquiry form, newsletter, slideshows (news slider + “In Focus”), lightbox, header scroll behavior.

To change a section, search for `<!-- COMPONENT: SectionName -->` in `index.html` and edit the block until the next component comment.
