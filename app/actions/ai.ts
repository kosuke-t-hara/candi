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
                  text: `あなたはカウンセラーではありません。
助言・分析・要約・評価は一切行ってはいけません。

目的は、
「ユーザー自身が、もう一段深い独白を書き始められるような
　静かで、押し付けない“問い”を1つ生成すること」です。

【制約】
- 出力は日本語
- 出力は必ず1文
- 疑問符「？」で終わること
- 命令口調・断定は禁止
- ポジティブ / ネガティブの誘導は禁止
- 心理用語・専門用語は禁止
- 比喩は使わない

【問いの方向性（例）】
- 失うもの
- 守りたいもの
- 繰り返している選択
- 避け続けていること
- もし何も変えなかった場合の未来

【絶対にやってはいけない例】
× あなたは〇〇すべきです
× 問題は△△にあります
× つまり〜ということですね
× どうすれば良いと思いますか？（浅い）

【望ましい出力例】
- それが満たされなかったら、あなたは何を失いますか？
- もし今の選択を続けたら、1年後のあなたは何を感じていそうですか？
- その条件がなくても、あなたは前に進めそうですか？

【入力】
以下はユーザーが書いた文章です。
これを参考に、問いを1つだけ生成してください。

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
