/** Replace a poster or add a video path here when the next films are supplied.
 * Video slots are optional: sections keep their photograph until a file is set.
 * All paths are relative so this prototype can also be served from a subfolder.
 */
export const media = {
  hero: {video: 'assets/comfort-by-nature.mp4', poster: 'assets/hero-poster.jpg'},
  services: [
    {id: 'hotels', title: 'Hotels & hospitality', label: 'Hotels', image: 'assets/hotel-film.jpg', video: null,
      alt: 'Fresh white bed linen and pillows in a guest room',
      headline: 'A better night.\nA lasting impression.',
      text: 'From the first touch of a crisp sheet to a perfectly folded towel, the little details make a stay. We care for your linen so you can care for your guests.',
      details: ['Bed linen & pillowcases', 'Bath towels & robes', 'Linen hire & regular collection']},
    {id: 'dining', title: 'Restaurants & dining', label: 'Dining', image: 'assets/dining-film.jpg', video: null,
      alt: 'A beautifully set restaurant table with white linen',
      headline: 'Set the table.\nSet the standard.',
      text: 'Give every service a considered finishing touch. Beautifully presented table linen, carefully laundered and ready for your next sitting.',
      details: ['Tablecloths & napkins', 'Careful finishing', 'Collection & delivery']},
    {id: 'stays', title: 'Holiday stays & B&Bs', label: 'Holiday stays', image: 'assets/towels.webp', video: null,
      alt: 'Clean folded white towels ready for guests',
      headline: 'Every arrival.\nA fresh beginning.',
      text: 'Make changeover days feel a little lighter. A dependable linen partner for holiday properties and B&Bs, with fresh essentials for every new guest.',
      details: ['Bedding & bathroom linen', 'Dedicated linen stock', 'A service around your property']},
    {id: 'garments', title: 'Garment care', label: 'Garment care', image: 'assets/garment.webp', video: null,
      alt: 'Professionally cared-for garments on hangers',
      headline: 'Care you can see.\nQuality you can feel.',
      text: 'A thoughtful approach to the pieces you wear. Professional laundering and finishing, with attention to the fabric and the details that matter.',
      details: ['Professional laundering', 'Careful garment finishing', 'Discuss your requirements with us']}
  ],
  care: {water: {image: 'assets/coast-poster.jpg', video: null}, energy: {image: 'assets/story-laundry.webp', video: null}, linen: {image: 'assets/laundry.webp', video: null}},
  story: {image: 'assets/story-galle.webp', video: null}
};
