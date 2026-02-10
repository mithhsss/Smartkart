import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { image, mimeType } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Check image size — base64 strings over ~10MB can cause issues
    const imageSizeMB = (image.length * 3) / 4 / 1024 / 1024;
    if (imageSizeMB > 10) {
      return NextResponse.json({ error: `Image too large (${imageSizeMB.toFixed(1)}MB). Please use an image under 10MB.` }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      // Return mock data if no API key is configured
      return NextResponse.json({
        items: [
          { name: "Tomatoes", quantity: "1 kg" },
          { name: "Onions", quantity: "1 kg" },
          { name: "Milk", quantity: "1 L" },
          { name: "Eggs", quantity: "12 pcs" },
          { name: "Bread", quantity: "1 pack" },
          { name: "Chicken", quantity: "500 g" },
          { name: "Rice", quantity: "5 kg" },
          { name: "Butter", quantity: "100 g" },
        ],
        mock: true,
      });
    }

    console.log('[SmartCart] Calling Gemini API with image size:', imageSizeMB.toFixed(2), 'MB, mimeType:', mimeType || 'image/jpeg');

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: image,
              },
            },
            {
              text: `Analyze this image carefully. It could be a grocery list (handwritten or typed), a photo of a fridge/pantry, a recipe, or any image containing food/grocery items.

Extract ALL grocery or food items visible in this image.

You MUST respond with ONLY a valid JSON array, no markdown, no code fences, no extra text. Each element must have:
- "name": the item name (common grocery term, e.g., "Tomatoes", "Milk", "Chicken Breast")
- "quantity": estimated quantity (e.g., "1 kg", "500 g", "2 L", "6 pcs", "1 pack")

Example response:
[{"name": "Tomatoes", "quantity": "1 kg"}, {"name": "Milk", "quantity": "1 L"}]

If no grocery items are found, return an empty array: []`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMsg = `Gemini API returned status ${response.status}`;
      try {
        const errorData = await response.json();
        console.error('[SmartCart] Gemini API error:', JSON.stringify(errorData, null, 2));
        errorMsg = errorData?.error?.message || errorMsg;
      } catch (e) {
        const errorText = await response.text();
        console.error('[SmartCart] Gemini API raw error:', errorText);
      }
      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    const data = await response.json();
    console.log('[SmartCart] Gemini response candidates:', data.candidates?.length || 0);

    // Check for blocked content
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      return NextResponse.json({ error: 'Image was blocked by safety filters. Try a different image.' }, { status: 400 });
    }

    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    console.log('[SmartCart] Gemini raw text:', textContent.substring(0, 200));

    // Clean the response — strip markdown code fences if present
    let cleaned = textContent.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    let items;
    try {
      items = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('[SmartCart] Failed to parse Gemini response:', cleaned);
      return NextResponse.json({ error: 'AI response was not valid JSON. Please try again.' }, { status: 500 });
    }

    if (!Array.isArray(items)) {
      items = [];
    }

    console.log('[SmartCart] Extracted', items.length, 'items');
    return NextResponse.json({ items, mock: false });
  } catch (error) {
    console.error('[SmartCart] Unexpected error:', error.message, error.stack);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
