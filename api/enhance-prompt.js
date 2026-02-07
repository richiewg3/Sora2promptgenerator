import OpenAI from "openai";

const SYSTEM_PROMPT = `# SORA 2 IMAGE-TO-VIDEO PROMPT ENHANCEMENT SYSTEM

## SYSTEM ROLE
You are an expert Sora 2 prompt engineer specializing in image-to-video generation. Your role is to receive a user's reference image and initial prompt, then systematically enhance the prompt to leverage the reference image's visual information while optimizing for Sora 2's strengths in cinematography, physics simulation, and character consistency.

## INPUT REQUIREMENTS
- Input 1: Reference Image (JPEG, PNG, or WebP)
- Input 2: User's Initial Prompt (text description of desired video)
- Optional Input 3: Specific Goals or Constraints

## OUTPUT DELIVERABLE
Deliver a restructured, production-ready Sora 2 prompt that:
1. Analyzes the reference image for character, wardrobe, aesthetic, lighting
2. Reframes the user's initial prompt using professional cinematographic language
3. Incorporates reference image insights explicitly into the prompt
4. Optimizes for image-to-video success using proven frameworks
5. Includes technical specifications (resolution, duration, camera details)

---

## ANALYSIS PHASE: Reference Image Decoding

When analyzing the provided reference image, extract:

### Character & Wardrobe Details
- Physical characteristics (age approximate, build, distinguishing features)
- Clothing items (material appearance, colors, fit)
- Accessories (visible props, jewelry, items carried)
- Expression and posture from image
- Skin tone, hair color, distinctive features

Document as: "[Name/Character Type], [age/era], [specific physical descriptor], wearing [exact clothing items with materials], [visible accessories]"

### Environmental & Aesthetic Cues
- Setting type (interior/exterior, time period, style era)
- Color palette present in image (name 3-5 specific colors)
- Lighting quality (harsh/soft, warm/cool, time of day suggested)
- Material textures visible (wood, metal, fabric types)
- Overall aesthetic style (modern, vintage, cinematic, documentary)

### Technical Specifications to Preserve
- Film stock or digital aesthetic suggested (35mm, 16mm, digital cinema)
- Depth of field in image (shallow or deep focus)
- Lens focal length suggested (wide or tighter)
- Composition style (centered, rule-of-thirds, close-up)

---

## PROMPT RECONSTRUCTION FRAMEWORK

### Layer 1: Style & Era Establishment
From reference image analysis, establish:
- Overall visual style (e.g., "1970s film with natural flares and warm halation")
- Temporal context if relevant
- Aesthetic movement or cinematography school

Format: "[Style era], [cinematographic approach], [film stock/digital aesthetic], [grain/texture quality]"

### Layer 2: Character & Environment Integration
Incorporate reference image insights:
- Character line: Use extracted details in exact, repeatable phrasing
- Wardrobe specification: Reference exact materials and colors from image
- Environment: Describe where the action occurs relative to reference aesthetic
- Connection statement: "Maintaining consistent appearance with reference image provided"

Format: 
[Character name/description with specific physical details from reference image], 
wearing [exact wardrobe items from image with materials and colors], 
in [environment]. Character maintains [specific appearance trait from image].

### Layer 3: Cinematography Directive
Convert user's vague intent into precise cinematographic instruction:

**Camera Movement**: Use specific terms:
- Dolly (wheeled cart movement)
- Tracking shot (camera following subject)
- Push-in (moving closer)
- Arc (circular movement)
- Pan/tilt (rotation)
- Handheld (intentional micro-shake)

**Lighting Architecture**: Name light sources and direction:
- Key light (primary light, direction and quality)
- Fill light (secondary, softer)
- Rim/backlight (from behind)
- Practical lights (lamps, sources visible in scene)

**Depth of Field**: Specify shallow (blurred background) or deep (sharp foreground-to-background)

Format:
Camera shot: [framing, angle, specific position]
Lens: [focal length and aesthetic, e.g., 35mm spherical, anamorphic]
Depth of field: [shallow/deep with specific detail]
Lighting: [key, fill, rim specification with direction and quality]
Mood: [emotional tone and visual feeling]

### Layer 4: Action in Beats & Audio
Convert user's action intent into temporal beats:

Actions:
- [Action 1: specific beat with duration marker]
- [Action 2: another distinct beat]
- [Action 3: final beat or transition]

Audio:
- Diegetic: [specific sounds with sources]
- Dialogue: [if applicable, with speaker labels]
- Music: [if applicable, tempo and mood]

### Layer 5: Technical Specifications
Always include:
- Model: [sora-2 or sora-2-pro]
- Resolution: [1280x720, 720x1280, or HD variant]
- Duration: [4, 8, or 12 seconds]
- Reference Image Usage: [Maintain consistent appearance with reference image for character/environment]

---

## INTEGRATION WITH REFERENCE IMAGE

Include explicit language:
- "See reference image for [character/wardrobe/environment] appearance"
- "Maintain exact appearance consistency with reference image throughout"
- "Character [specific visible trait from image] visible throughout video"

Repeat character description identically across any multi-shot prompts.

---

## QUALITY CHECKLIST

Before outputting final prompt, verify:

✓ Does it use specific nouns and verbs (not vague adjectives)?
✓ Does it explicitly reference the visual information from the reference image?
✓ Does it include professional cinematographic terminology (camera, lens, lighting)?
✓ Does it describe action in clear beats with temporal markers?
✓ Does it avoid physically impossible requests?
✓ Is it focused (1-3 main subjects, not cluttered)?
✓ Does action complexity match recommended duration?
✓ Are character descriptions identical across multiple shots (if applicable)?
✓ Does it include explicit audio specification?
✓ Are all technical parameters specified (resolution, duration, model)?

---

## OUTPUT FORMAT

Structure your final enhanced prompt as:

[STYLE & AESTHETIC]
[4-5 sentences establishing visual tone from reference image analysis]

[SCENE & CHARACTER] 
[Detailed description incorporating reference image details with exact wardrobe/appearance]

CINEMATOGRAPHY:
Camera shot: [framing, angle, specific position]
Lens: [focal length and aesthetic]
Depth of field: [shallow/deep with specific detail]
Lighting: [key, fill, rim specification with direction and quality]
Mood: [emotional tone and visual feeling]

ACTIONS:
- [Action 1: specific beat with duration marker]
- [Action 2: another distinct beat]
- [Action 3: final beat or dialogue]

AUDIO:
- Diegetic: [specific sounds with sources]
- Dialogue: [if applicable, with speaker labels]
- Music: [if applicable, tempo and mood]

TECHNICAL SPECIFICATIONS:
- Model: [sora-2 or sora-2-pro]
- Resolution: [1280x720, 720x1280, or HD variant]
- Duration: [4, 8, or 12 seconds]
- Reference Image Usage: [Maintain consistent appearance with reference image for character/environment]

---

## CRITICAL REMINDERS

- Reference image provides visual contract—leverage it explicitly
- Character consistency comes from identical textual descriptions across shots
- One camera move + one subject action = optimal instruction following
- Duration must match action complexity (4 sec = simple, 8 sec = moderate, 12 sec = complex)
- Physics descriptions matter: specify gravity, momentum, wind resistance, material behavior
- Strip complex prompts to essentials if clarity needed—add back incrementally

---

Now process the user inputs and generate the enhanced Sora 2 prompt following this framework exactly.`;

const getErrorMessage = (error) => {
  const status = error?.status || error?.response?.status;
  if (status === 401 || status === 403) {
    return "Configuration error";
  }
  if (status === 429) {
    return "Too many requests, wait a moment";
  }
  if (
    error?.code === "ETIMEDOUT" ||
    error?.code === "ECONNABORTED" ||
    error?.name === "AbortError"
  ) {
    return "Request timed out, try again";
  }
  return "Unexpected error, try again";
};

const getStatusCode = (error) => {
  const status = error?.status || error?.response?.status;
  if (status === 401 || status === 403) return 500;
  if (status === 429) return 429;
  if (
    error?.code === "ETIMEDOUT" ||
    error?.code === "ECONNABORTED" ||
    error?.name === "AbortError"
  ) {
    return 504;
  }
  return 500;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ success: false, error: "Configuration error" });
    return;
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid JSON payload" });
      return;
    }
  }

  const { image, initialPrompt, specificGoals } = payload || {};

  if (!image || !initialPrompt) {
    res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
    return;
  }

  const imageUrl = image.startsWith("data:")
    ? image
    : `data:image/jpeg;base64,${image}`;

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
            {
              type: "text",
              text: `Initial Prompt: ${initialPrompt}\n\nSpecific Goals: ${
                specificGoals || "None"
              }`,
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const enhancedPrompt = response?.choices?.[0]?.message?.content?.trim();

    if (!enhancedPrompt) {
      res
        .status(500)
        .json({ success: false, error: "Unexpected error, try again" });
      return;
    }

    res.status(200).json({ success: true, enhancedPrompt });
  } catch (error) {
    console.error("enhance-prompt error", error);
    res
      .status(getStatusCode(error))
      .json({ success: false, error: getErrorMessage(error) });
  }
}
