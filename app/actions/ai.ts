'use server'

export async function generateQuestion(text: string) {
  if (!text) {
    throw new Error('Text is required')
  }

  // 3000文字制限 (呼び出し側でも行うが一応ここでも)
  const truncatedText = text.trim().slice(0, 3000)

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `以下のテキストを読んで、ユーザーが自分の考えや気持ちをより深められるような「問い」を1つだけ生成してください。
返信には問いの文章のみを含めてください。

テキスト:
${truncatedText}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 128,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API Error:', errorData)
      throw new Error('Failed to generate question')
    }

    const data = await response.json()
    const question = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!question) {
      throw new Error('No question generated')
    }

    return question
  } catch (error) {
    console.error('AI Generation Error:', error)
    throw error
  }
}
