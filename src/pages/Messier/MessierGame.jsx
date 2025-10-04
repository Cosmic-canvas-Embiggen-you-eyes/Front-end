// messierGameQuestions.js
export const GAME_QUESTIONS_MESSIER = [
  {
    id: 1,
    question:
      "This beautiful spiral galaxy is the closest major galaxy to the Milky Way. What is it?",
    coordinates: { lat: 41.269, lng: 10.684, zoom: 4 },
    answers: [
      { text: "Andromeda Galaxy (M31)", correct: true },
      { text: "Whirlpool Galaxy (M51)", correct: false },
      { text: "Triangulum Galaxy (M33)", correct: false },
      { text: "Sombrero Galaxy (M104)", correct: false },
    ],
    explanation:
      "The Andromeda Galaxy (M31) is approximately 2.5 million light-years away and is the nearest major galaxy to our Milky Way. It's visible to the naked eye from dark locations!",
  },
  {
    id: 2,
    question:
      "This globular cluster in Hercules is one of the brightest and most famous. Which one is it?",
    coordinates: { lat: 36.46, lng: 250.425, zoom: 4 },
    answers: [
      { text: "Great Globular Cluster (M13)", correct: true },
      { text: "M3 Globular Cluster", correct: false },
      { text: "M15 Globular Cluster", correct: false },
      { text: "Omega Centauri", correct: false },
    ],
    explanation:
      "M13, the Great Globular Cluster in Hercules, contains hundreds of thousands of stars packed into a sphere about 145 light-years across.",
  },
  {
    id: 3,
    question:
      "This nebula resembles a crab with its intricate filaments. What is it?",
    coordinates: { lat: 22.014, lng: 83.633, zoom: 4 },
    answers: [
      { text: "Crab Nebula (M1)", correct: true },
      { text: "Ring Nebula (M57)", correct: false },
      { text: "Dumbbell Nebula (M27)", correct: false },
      { text: "Orion Nebula (M42)", correct: false },
    ],
    explanation:
      "The Crab Nebula (M1) is the remnant of a supernova explosion observed by Chinese astronomers in 1054 AD. At its center is a rapidly spinning neutron star.",
  },
  {
    id: 4,
    question:
      "This open star cluster is famous for its seven bright stars. What is it called?",
    coordinates: { lat: 24.117, lng: 56.75, zoom: 4 },
    answers: [
      { text: "Pleiades (M45)", correct: true },
      { text: "Beehive Cluster (M44)", correct: false },
      { text: "Butterfly Cluster (M6)", correct: false },
      { text: "Wild Duck Cluster (M11)", correct: false },
    ],
    explanation:
      "The Pleiades (M45), also known as the Seven Sisters, is one of the nearest star clusters to Earth at about 444 light-years away and is visible to the naked eye.",
  },
  {
    id: 5,
    question:
      "This bright nebula in Orion is a stellar nursery where new stars are born. Which one is it?",
    coordinates: { lat: -5.389, lng: 83.822, zoom: 4 },
    answers: [
      { text: "Orion Nebula (M42)", correct: true },
      { text: "Lagoon Nebula (M8)", correct: false },
      { text: "Eagle Nebula (M16)", correct: false },
      { text: "Trifid Nebula (M20)", correct: false },
    ],
    explanation:
      "The Orion Nebula (M42) is one of the brightest nebulae and is visible to the naked eye. It's approximately 1,344 light-years away and is actively forming new stars.",
  },
  {
    id: 6,
    question:
      "This galaxy has a distinctive sombrero-like appearance. What is it?",
    coordinates: { lat: -11.623, lng: 189.998, zoom: 4 },
    answers: [
      { text: "Sombrero Galaxy (M104)", correct: true },
      { text: "Pinwheel Galaxy (M101)", correct: false },
      { text: "Bode's Galaxy (M81)", correct: false },
      { text: "Sunflower Galaxy (M63)", correct: false },
    ],
    explanation:
      "The Sombrero Galaxy (M104) has a bright nucleus, an unusually large central bulge, and a prominent dust lane in its disk, giving it the appearance of a sombrero hat.",
  },
  {
    id: 7,
    question:
      "This interacting pair of galaxies is creating spectacular spiral arms. What are they?",
    coordinates: { lat: 47.195, lng: 202.47, zoom: 4 },
    answers: [
      { text: "Whirlpool Galaxy (M51)", correct: true },
      { text: "Antennae Galaxies", correct: false },
      { text: "Mice Galaxies", correct: false },
      { text: "Cartwheel Galaxy", correct: false },
    ],
    explanation:
      "The Whirlpool Galaxy (M51) is interacting with its companion galaxy NGC 5195, creating the spectacular spiral structure we see today.",
  },
  {
    id: 8,
    question:
      "This planetary nebula has a distinctive ring shape. Which nebula is it?",
    coordinates: { lat: 33.029, lng: 283.397, zoom: 4 },
    answers: [
      { text: "Ring Nebula (M57)", correct: true },
      { text: "Helix Nebula", correct: false },
      { text: "Cat's Eye Nebula", correct: false },
      { text: "Eskimo Nebula", correct: false },
    ],
    explanation:
      "The Ring Nebula (M57) in Lyra is a planetary nebula formed when a dying star expelled its outer layers. The 'ring' is actually a cylinder of material viewed end-on.",
  },
  {
    id: 9,
    question:
      "This galaxy pair in Ursa Major shows two beautiful spiral galaxies. What are they?",
    coordinates: { lat: 69.065, lng: 168.369, zoom: 4 },
    answers: [
      { text: "Bode's Galaxy (M81) and Cigar Galaxy (M82)", correct: true },
      { text: "M65 and M66", correct: false },
      { text: "M95 and M96", correct: false },
      { text: "M108 and M109", correct: false },
    ],
    explanation:
      "M81 (Bode's Galaxy) and M82 (Cigar Galaxy) form a beautiful pair. M82 is undergoing intense star formation due to its interaction with M81.",
  },
  {
    id: 10,
    question: "This nebula is known for its three-lobed structure. What is it?",
    coordinates: { lat: -23.033, lng: 270.167, zoom: 4 },
    answers: [
      { text: "Trifid Nebula (M20)", correct: true },
      { text: "Lagoon Nebula (M8)", correct: false },
      { text: "Omega Nebula (M17)", correct: false },
      { text: "Eagle Nebula (M16)", correct: false },
    ],
    explanation:
      "The Trifid Nebula (M20) gets its name from the three dark lanes that divide it. It's both an emission nebula (red) and a reflection nebula (blue).",
  },
  {
    id: 11,
    question: "This open cluster looks like a beehive. What is it called?",
    coordinates: { lat: 19.667, lng: 130.1, zoom: 4 },
    answers: [
      { text: "Beehive Cluster (M44)", correct: true },
      { text: "Pleiades (M45)", correct: false },
      { text: "Ptolemy Cluster (M7)", correct: false },
      { text: "M35", correct: false },
    ],
    explanation:
      "The Beehive Cluster (M44), also known as Praesepe, is an open cluster visible to the naked eye. It contains about 1,000 stars and is approximately 577 light-years away.",
  },
  {
    id: 12,
    question:
      "This nebula contains the famous 'Pillars of Creation'. Which one is it?",
    coordinates: { lat: -13.783, lng: 274.7, zoom: 4 },
    answers: [
      { text: "Eagle Nebula (M16)", correct: true },
      { text: "Orion Nebula (M42)", correct: false },
      { text: "Lagoon Nebula (M8)", correct: false },
      { text: "Carina Nebula", correct: false },
    ],
    explanation:
      "The Eagle Nebula (M16) houses the famous 'Pillars of Creation', towering columns of gas and dust where new stars are forming. The Hubble Space Telescope's image of this region is iconic.",
  },
  {
    id: 13,
    question:
      "This large face-on spiral galaxy is known for its grand design. What is it?",
    coordinates: { lat: 54.349, lng: 210.8, zoom: 4 },
    answers: [
      { text: "Pinwheel Galaxy (M101)", correct: true },
      { text: "Triangulum Galaxy (M33)", correct: false },
      { text: "Southern Pinwheel (M83)", correct: false },
      { text: "Sunflower Galaxy (M63)", correct: false },
    ],
    explanation:
      "The Pinwheel Galaxy (M101) is a face-on spiral galaxy approximately 21 million light-years away. Its large size and detailed spiral structure make it a favorite target for astrophotographers.",
  },
  {
    id: 14,
    question:
      "This globular cluster is one of the oldest objects in our galaxy. Which one is it?",
    coordinates: { lat: 12.167, lng: 322.492, zoom: 4 },
    answers: [
      { text: "M15 Globular Cluster", correct: true },
      { text: "M13 Globular Cluster", correct: false },
      { text: "M5 Globular Cluster", correct: false },
      { text: "M92 Globular Cluster", correct: false },
    ],
    explanation:
      "M15 is one of the oldest globular clusters known, with an age of approximately 12 billion years. It contains over 100,000 stars densely packed in a sphere.",
  },
  {
    id: 15,
    question:
      "This triangular-shaped galaxy is the third largest in our Local Group. What is it?",
    coordinates: { lat: 30.66, lng: 23.462, zoom: 4 },
    answers: [
      { text: "Triangulum Galaxy (M33)", correct: true },
      { text: "Andromeda Galaxy (M31)", correct: false },
      { text: "Pinwheel Galaxy (M101)", correct: false },
      { text: "Whirlpool Galaxy (M51)", correct: false },
    ],
    explanation:
      "The Triangulum Galaxy (M33) is the third-largest member of the Local Group of galaxies, after Andromeda and the Milky Way. It's approximately 3 million light-years away and can be seen with the naked eye under dark skies.",
  },
];
