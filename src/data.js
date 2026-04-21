export const SWATCHES = {
  warm: ['#F5E6D3', '#E8B588'],
  red: ['#F7CCC2', '#D97C6A'],
  green: ['#D9E7D0', '#86A876'],
  sage: ['#E6EADC', '#A8B494'],
  butter: ['#F7E9C2', '#D8B770'],
  tomato: ['#F4C7BE', '#C8574A'],
  cream: ['#F2EDE0', '#C9BEA2'],
  forest: ['#C4D1B8', '#5E7A52'],
  rose: ['#F3D3D0', '#C9806F'],
  mustard: ['#EFD89B', '#B78A2A'],
};

export const RECIPES = [
  {
    id: 'r1', name: 'Ginger-soy rice bowl',
    subtitle: 'with crispy egg & wilted spinach',
    time: 22, difficulty: 'Easy', cal: 540,
    tags: ['quick', 'pantry', 'high-protein'],
    cuisine: 'Japanese-ish', tone: 'warm',
    summary: 'A 22-minute weeknight bowl that makes pantry rice and a jammy egg feel like a plan. Toasted sesame, soft-wilted spinach, and a ginger-soy glaze that turns sticky as it hits the hot pan.',
    nutrition: { cal: 540, protein: '24g', carbs: '62g', fat: '18g' },
    servings: 2,
    ingredients: [
      { name: 'Short-grain rice', qty: '1 cup', have: true },
      { name: 'Eggs', qty: '2 large', have: true },
      { name: 'Baby spinach', qty: '3 big handfuls', have: true },
      { name: 'Soy sauce', qty: '3 tbsp', have: false },
      { name: 'Fresh ginger', qty: '1 thumb', have: false },
      { name: 'Rice vinegar', qty: '1 tbsp', have: false },
      { name: 'Sesame oil', qty: '2 tsp', have: false },
      { name: 'Scallions', qty: '2, sliced', have: false },
    ],
    steps: [
      { t: 'Rinse & cook rice', d: 'Rinse 1 cup of rice until water runs mostly clear. Cook with 1 1/4 cups water, covered, 18 minutes. Rest 5 minutes off heat.' },
      { t: 'Make the glaze', d: 'Grate a thumb of ginger. Whisk with 3 tbsp soy, 1 tbsp rice vinegar, 1 tsp sugar, and a splash of sesame oil.' },
      { t: 'Crisp the eggs', d: 'Heat 1 tbsp neutral oil over medium-high. Crack eggs in; spoon hot oil over the whites until edges lace and yolks stay jammy, about 90 seconds.' },
      { t: 'Wilt the spinach', d: 'Off heat, dump spinach into the still-hot pan. Toss with tongs until just collapsed.' },
      { t: 'Assemble', d: 'Rice in a shallow bowl. Spinach on top. Eggs alongside. Spoon glaze over the whole thing; finish with scallions and sesame seeds.' },
    ],
  },
  {
    id: 'r2', name: 'Tomato-butter spaghetti',
    subtitle: 'marcella-style, 35 minutes, total comfort',
    time: 35, difficulty: 'Easy', cal: 620,
    tags: ['comfort', 'vegetarian', 'kid-friendly'],
    cuisine: 'Italian', tone: 'tomato',
    summary: 'Three ingredients do most of the work: butter, onion, canned tomatoes. It tastes like a restaurant you keep meaning to go back to.',
    nutrition: { cal: 620, protein: '17g', carbs: '88g', fat: '22g' },
    servings: 4,
    ingredients: [
      { name: 'Spaghetti', qty: '1 lb', have: false },
      { name: 'Whole canned tomatoes', qty: '28 oz can', have: false },
      { name: 'Unsalted butter', qty: '5 tbsp', have: false },
      { name: 'Yellow onion', qty: '1, halved', have: true },
      { name: 'Parmesan', qty: 'to serve', have: false },
      { name: 'Salt', qty: 'to taste', have: true },
    ],
    steps: [
      { t: 'Start the sauce', d: 'Empty the can of tomatoes into a wide pot. Add butter and the halved onion, cut-side down. Simmer, uncovered, 35 minutes, breaking up tomatoes with a spoon now and then.' },
      { t: 'Boil the pasta', d: 'In the last 10 minutes, bring a big salted pot of water to a boil. Cook spaghetti 1 minute shy of package time.' },
      { t: 'Marry them', d: 'Pluck the onion out of the sauce (save it, snack). Add cooked pasta plus a splash of pasta water; toss over low heat until sauce clings.' },
      { t: 'Serve', d: 'Shallow bowls, heavy Parmesan, a grind of black pepper.' },
    ],
  },
  {
    id: 'r3', name: 'Sheet-pan harissa chicken',
    time: 45, difficulty: 'Easy', cal: 580,
    subtitle: 'with chickpeas & charred lemon',
    tags: ['sheet-pan', 'high-protein', 'dairy-free'],
    cuisine: 'North African', tone: 'red',
    summary: 'One pan, big flavor. Harissa catches on the skin; chickpeas crisp in the chicken fat.',
    nutrition: { cal: 580, protein: '38g', carbs: '34g', fat: '28g' },
    servings: 4,
    ingredients: [
      { name: 'Chicken thighs, bone-in', qty: '6', have: false },
      { name: 'Chickpeas', qty: '15 oz can', have: false },
      { name: 'Harissa paste', qty: '3 tbsp', have: false },
      { name: 'Lemon', qty: '1, halved', have: true },
      { name: 'Olive oil', qty: '3 tbsp', have: true },
      { name: 'Cilantro', qty: 'small bunch', have: false },
    ],
    steps: [
      { t: 'Rub the chicken', d: 'Pat thighs dry. Toss with harissa, olive oil, salt.' },
      { t: 'Sheet pan', d: 'Chicken skin-up on a sheet pan with drained chickpeas and a halved lemon. 425 F, 38-42 min until skin is dark and crackly.' },
      { t: 'Finish', d: 'Rest 5 min. Squeeze the roasted lemon over everything. Cilantro on top.' },
    ],
  },
  {
    id: 'r4', name: 'Miso-glazed salmon',
    subtitle: 'with sticky rice & cucumber',
    time: 28, difficulty: 'Easy', cal: 510,
    tags: ['quick', 'omega-3', 'gluten-free'],
    cuisine: 'Japanese-ish', tone: 'butter',
    summary: 'A 5-minute broil. The glaze does everything.',
    nutrition: { cal: 510, protein: '34g', carbs: '48g', fat: '18g' },
    servings: 2,
    ingredients: [
      { name: 'Salmon fillets', qty: '2 x 6oz', have: false },
      { name: 'White miso', qty: '2 tbsp', have: false },
      { name: 'Mirin', qty: '1 tbsp', have: false },
      { name: 'Brown sugar', qty: '1 tbsp', have: true },
      { name: 'Cucumber', qty: '1, sliced', have: false },
      { name: 'Rice', qty: '1 cup', have: true },
    ],
    steps: [
      { t: 'Glaze', d: 'Whisk miso, mirin, brown sugar, a splash of soy.' },
      { t: 'Broil', d: 'Brush on salmon. Broil on high 5-6 minutes until lacquered.' },
      { t: 'Serve', d: 'Rice, salmon, quick-sliced cucumber with rice vinegar and salt.' },
    ],
  },
  {
    id: 'r5', name: 'Crispy tofu larb',
    subtitle: 'with herbs, lime, and toasted rice',
    time: 30, difficulty: 'Med', cal: 440,
    tags: ['vegetarian', 'high-protein', 'spicy'],
    cuisine: 'Thai', tone: 'green',
    summary: 'The toasted rice is non-negotiable. It changes the whole thing.',
    nutrition: { cal: 440, protein: '22g', carbs: '38g', fat: '22g' },
    servings: 2,
    ingredients: [
      { name: 'Firm tofu', qty: '14 oz', have: false },
      { name: 'Jasmine rice', qty: '2 tbsp (for toasting)', have: true },
      { name: 'Shallots', qty: '2, sliced thin', have: false },
      { name: 'Lime', qty: '2', have: false },
      { name: 'Mint + cilantro', qty: 'big handful', have: false },
      { name: 'Fish sauce (or soy)', qty: '2 tbsp', have: false },
    ],
    steps: [
      { t: 'Toast the rice', d: 'Dry-toast rice in a pan until deep gold. Grind to coarse powder.' },
      { t: 'Crisp tofu', d: 'Crumble tofu. Pan-fry in oil until edges are brown and crunchy, 8 min.' },
      { t: 'Dress', d: 'Off heat, toss with shallots, herbs, lime juice, fish sauce, chili, toasted rice powder.' },
      { t: 'Serve', d: 'On lettuce leaves or over rice.' },
    ],
  },
  {
    id: 'r6', name: 'Butter chicken',
    subtitle: "the family's version, mild, tomato-forward",
    time: 50, difficulty: 'Med', cal: 650,
    tags: ['kid-friendly', 'batch-cook', 'gluten-free'],
    cuisine: 'Indian', tone: 'rose',
    summary: 'The version Maya actually eats. Less heat, more cream, charred tomatoes.',
    nutrition: { cal: 650, protein: '42g', carbs: '28g', fat: '38g' },
    servings: 4,
    ingredients: [
      { name: 'Chicken thighs', qty: '1.5 lb', have: false },
      { name: 'Crushed tomatoes', qty: '28 oz', have: false },
      { name: 'Heavy cream', qty: '1/2 cup', have: false },
      { name: 'Garam masala', qty: '1 tbsp', have: false },
      { name: 'Butter', qty: '4 tbsp', have: true },
      { name: 'Basmati rice', qty: '2 cups', have: true },
    ],
    steps: [
      { t: 'Sear chicken', d: 'Brown chicken pieces in butter. Set aside.' },
      { t: 'Build sauce', d: 'Sweat onion + ginger + garlic. Add garam masala, tomatoes; simmer 15 min.' },
      { t: 'Finish', d: 'Return chicken, cream. Simmer 15 more min. Finish with cilantro.' },
    ],
  },
  {
    id: 'r7', name: 'Roasted carrot soup',
    subtitle: 'with brown butter & sage',
    time: 40, difficulty: 'Easy', cal: 320,
    tags: ['vegetarian', 'make-ahead', 'gluten-free'],
    cuisine: 'European', tone: 'mustard',
    summary: 'Sweet carrots, nutty brown butter, green sage oil. Fall-forward.',
    nutrition: { cal: 320, protein: '6g', carbs: '38g', fat: '16g' },
    servings: 4,
    ingredients: [
      { name: 'Carrots', qty: '2 lb', have: false },
      { name: 'Yellow onion', qty: '1', have: true },
      { name: 'Veg stock', qty: '4 cups', have: false },
      { name: 'Butter', qty: '4 tbsp', have: true },
      { name: 'Fresh sage', qty: '10 leaves', have: false },
    ],
    steps: [
      { t: 'Roast', d: 'Toss carrots + onion in oil. Roast at 425 F, 28 min.' },
      { t: 'Blend', d: 'Blend with stock until silky.' },
      { t: 'Brown the butter', d: 'Melt butter, cook until nutty. Fry sage 15 sec. Drizzle over soup.' },
    ],
  },
  {
    id: 'r8', name: 'Chickpea-chard stew',
    subtitle: 'tomato-y, lemony, done in 25',
    time: 25, difficulty: 'Easy', cal: 390,
    tags: ['vegan', 'one-pot', 'high-fiber'],
    cuisine: 'Mediterranean', tone: 'forest',
    summary: 'Chickpeas get creamy. Chard turns silky. Lemon at the end wakes it up.',
    nutrition: { cal: 390, protein: '16g', carbs: '52g', fat: '12g' },
    servings: 3,
    ingredients: [
      { name: 'Chickpeas', qty: '2 x 15oz cans', have: false },
      { name: 'Swiss chard', qty: '1 bunch', have: false },
      { name: 'Crushed tomatoes', qty: '14 oz', have: false },
      { name: 'Garlic', qty: '5 cloves', have: true },
      { name: 'Lemon', qty: '1', have: true },
    ],
    steps: [
      { t: 'Sizzle garlic', d: 'Thin-slice garlic; sizzle in olive oil until pale gold.' },
      { t: 'Simmer', d: 'Add tomatoes, chickpeas (with liquid), chopped chard stems. Simmer 12 min.' },
      { t: 'Finish', d: 'Add chard leaves, cook 3 min. Off heat, squeeze lemon, big drizzle of olive oil.' },
    ],
  },
];

export const PANTRY_SUGGESTIONS = ['rice', 'eggs', 'spinach', 'chicken thighs', 'pasta', 'canned tomatoes', 'olive oil', 'garlic', 'onion', 'butter', 'tofu', 'lemon', 'ginger', 'soy sauce'];

export const CUISINES = ['Any', 'Italian', 'Japanese', 'Thai', 'Indian', 'Mexican', 'Mediterranean', 'North African', 'Korean', 'French'];

export const DIET_TAGS = [
  { k: 'vegetarian',  label: 'Vegetarian',   icon: 'Leaf',  tone: 'sage' },
  { k: 'vegan',       label: 'Vegan',        icon: 'Leaf',  tone: 'forest' },
  { k: 'gluten-free', label: 'Gluten-free',  icon: 'Wheat', tone: 'butter' },
  { k: 'dairy-free',  label: 'Dairy-free',   icon: 'Dot',   tone: 'sky' },
  { k: 'high-protein',label: 'High-protein', icon: 'Flame', tone: 'coral' },
  { k: 'low-carb',    label: 'Low-carb',     icon: 'Dot',   tone: 'plum' },
  { k: 'pescatarian', label: 'Pescatarian',  icon: 'Fish',  tone: 'sky' },
  { k: 'nut-free',    label: 'Nut-free',     icon: 'Dot',   tone: 'butter' },
];

export const LIFESTYLE_TAGS = [
  { k: 'quick',        label: 'Under 30 min', icon: 'Clock',  tone: 'sky' },
  { k: 'one-pot',      label: 'One-pot',      icon: 'Dot',    tone: 'sage' },
  { k: 'kid-friendly', label: 'Kid-friendly', icon: 'Star',   tone: 'butter' },
  { k: 'batch-cook',   label: 'Batch cook',   icon: 'Dot',    tone: 'plum' },
  { k: 'budget',       label: 'Budget',       icon: 'Dollar', tone: 'forest' },
  { k: 'date-night',   label: 'Date night',   icon: 'Heart',  tone: 'rose' },
];

export const DEFAULT_HOUSEHOLD = {
  members: [
    { id: 'h1', name: 'Priya', role: 'Adult', age: 34, loves: ['spicy', 'greens', 'seafood'], avoids: ['olives'], diet: [] },
    { id: 'h2', name: 'Jordan', role: 'Adult', age: 36, loves: ['pasta', 'bread', 'cheese'], avoids: ['cilantro'], diet: ['pescatarian'] },
    { id: 'h3', name: 'Maya', role: 'Kid', age: 8, loves: ['butter chicken', 'plain rice', 'mango'], avoids: ['spicy', 'onion chunks', 'mushrooms'], diet: [] },
    { id: 'h4', name: 'Leo', role: 'Kid', age: 4, loves: ['pasta', 'cheese', 'peas'], avoids: ['sauce mixed in', 'green things'], diet: [] },
  ],
  budgetPerMeal: 22,
  mealsPerWeek: 5,
  cookTime: 35,
};

export const todayIdx = () => {
  const d = new Date();
  return (d.getDay() + 6) % 7; // Mon=0
};

export const DEFAULT_PLAN = () => ({
  '0-dinner': 'r2',
  '1-dinner': 'r1',
  '2-dinner': 'r6',
  '3-dinner': 'r4',
  '4-dinner': 'r3',
  '5-dinner': 'r8',
  '2-lunch': 'r7',
  '0-lunch': 'r5',
});

export const TONE_COLOR = {
  warm: 'oklch(0.68 0.13 60)',
  red: 'oklch(0.62 0.17 25)',
  green: 'oklch(0.60 0.12 155)',
  sage: 'oklch(0.58 0.09 155)',
  butter: 'oklch(0.68 0.14 80)',
  tomato: 'oklch(0.60 0.18 25)',
  cream: 'oklch(0.60 0.06 70)',
  forest: 'oklch(0.52 0.11 155)',
  rose: 'oklch(0.65 0.12 15)',
  mustard: 'oklch(0.65 0.14 85)',
};
