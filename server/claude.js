import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const MODEL = process.env.CLAUDE_MODEL || 'claude-opus-4-7';

const TONES = ['warm', 'red', 'green', 'sage', 'butter', 'tomato', 'cream', 'forest', 'rose', 'mustard'];

const RECIPE_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Short, confident dish name like a cookbook title' },
    subtitle: { type: 'string', description: 'One-line descriptor' },
    time: { type: 'integer', description: 'Total time in minutes' },
    difficulty: { type: 'string', enum: ['Easy', 'Med', 'Hard'] },
    cal: { type: 'integer', description: 'Calories per serving' },
    tags: { type: 'array', items: { type: 'string' }, description: '3-5 short tags like "quick", "high-protein"' },
    cuisine: { type: 'string' },
    tone: { type: 'string', enum: TONES, description: 'A visual tone for the recipe card' },
    summary: {
      type: 'string',
      description: '2-3 sentence description that sounds like a thoughtful friend describing the dish.',
    },
    nutrition: {
      type: 'object',
      properties: {
        cal: { type: 'integer' },
        protein: { type: 'string' },
        carbs: { type: 'string' },
        fat: { type: 'string' },
      },
      required: ['cal', 'protein', 'carbs', 'fat'],
      additionalProperties: false,
    },
    servings: { type: 'integer' },
    ingredients: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          qty: { type: 'string' },
          have: { type: 'boolean', description: 'True if this is likely already in the user\'s pantry' },
        },
        required: ['name', 'qty', 'have'],
        additionalProperties: false,
      },
    },
    steps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          t: { type: 'string', description: 'Short step title' },
          d: { type: 'string', description: 'Step instructions' },
        },
        required: ['t', 'd'],
        additionalProperties: false,
      },
    },
  },
  required: ['name', 'subtitle', 'time', 'difficulty', 'cal', 'tags', 'cuisine', 'tone', 'summary', 'nutrition', 'servings', 'ingredients', 'steps'],
  additionalProperties: false,
};

const RECIPES_LIST_SCHEMA = {
  type: 'object',
  properties: {
    recipes: {
      type: 'array',
      items: RECIPE_SCHEMA,
    },
  },
  required: ['recipes'],
  additionalProperties: false,
};

const JOEYS_SYSTEM = `You are Joey's, a warm meal-planning assistant. You design recipes that feel like they came from a cookbook a thoughtful friend wrote for a specific family.

Principles:
- Prefer pantry items the user already has whenever possible.
- Respect all dietary constraints and avoids STRICTLY. If a member avoids cilantro, never put cilantro in the dish.
- Scale difficulty and technique to the stated cook time.
- Names should be short and confident, like a cookbook title. "Miso-glazed salmon" not "Quick Easy Delicious Baked Miso Salmon for the Whole Family".
- Summaries sound like a thoughtful friend describing the dish, not a press release.
- For weekly plans, make each night feel distinct across proteins, cuisines, and intensity. Balance effort so most nights are easy.`;

function buildUserContext({ query, pantry, cuisine, tags, household }) {
  const parts = [];
  if (query?.trim()) parts.push(`User wants: ${query.trim()}`);
  if (pantry?.length) parts.push(`Pantry (already have): ${pantry.join(', ')}`);
  if (cuisine && cuisine !== 'Any') parts.push(`Cuisine: ${cuisine}`);
  if (tags?.length) parts.push(`Tags/constraints: ${tags.join(', ')}`);
  if (household?.members?.length) {
    const mems = household.members.map(m => {
      const bits = [`${m.name} (${m.role})`];
      if (m.loves?.length) bits.push(`loves ${m.loves.join(', ')}`);
      if (m.avoids?.length) bits.push(`avoids ${m.avoids.join(', ')}`);
      if (m.diet?.length) bits.push(`diet: ${m.diet.join(', ')}`);
      return bits.join('; ');
    });
    parts.push(`Family:\n- ${mems.join('\n- ')}`);
    if (household.budgetPerMeal) parts.push(`Budget per meal per person: $${household.budgetPerMeal}`);
    if (household.cookTime) parts.push(`Max cook time: ${household.cookTime} minutes`);
  }
  return parts.join('\n') || 'Anything good for dinner tonight.';
}

async function generateRecipes(userContext, count, extraSystem = '') {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'medium',
      format: {
        type: 'json_schema',
        name: 'recipes_response',
        schema: RECIPES_LIST_SCHEMA,
      },
    },
    system: [
      {
        type: 'text',
        text: JOEYS_SYSTEM,
        cache_control: { type: 'ephemeral' },
      },
      ...(extraSystem ? [{ type: 'text', text: extraSystem }] : []),
    ],
    messages: [{ role: 'user', content: userContext }],
  });

  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock) throw new Error('No text in response');
  const parsed = JSON.parse(textBlock.text);
  return (parsed.recipes || []).slice(0, count).map((r, i) => ({
    id: `ai-${Date.now()}-${i}`,
    ...r,
  }));
}

export async function generateRecipeOptions(context) {
  const userContext = buildUserContext(context);
  const extra = 'Generate EXACTLY 2 different recipes they could cook tonight. The two should feel distinct from each other (not two variants of the same dish). One should be a "best match" to the request, the other a tasty wildcard.';
  return generateRecipes(userContext, 2, extra);
}

export async function generateWeeklyPlan(context, numMeals) {
  const userContext = buildUserContext(context);
  const extra = `Generate EXACTLY ${numMeals} dinner recipes for the week. They should feel varied in protein, cuisine, and intensity. Distribute cook times so most nights are easy and one or two can be a little more involved.`;
  return generateRecipes(userContext, numMeals, extra);
}
