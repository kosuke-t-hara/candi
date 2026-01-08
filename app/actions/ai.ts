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

export async function formatText(text: string) {
  if (!text) {
    throw new Error('Text is required')
  }

  // 3000文字制限
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
                  text: `あなたは編集者・校正者ではありません。
「思考を止めないための杖」として振る舞ってください。

目的は、
「ユーザーが書きなぐった口語的な文章を、
　本人が読み返した時にスッと頭に入る『読みやすい日本語』に整えること」です。

【重要な制約】
- 意味・ニュアンス・感情は**絶対に変えない**
- 新しい情報の追加は禁止
- 「〜だそうです」「〜とのことです」といった伝聞調は禁止
- 評価・分析・アドバイスは禁止
- 出力は「整えられた文章」のみ

【行うこと】
- 句読点の適切な補完
- 改行位置の整理（読みやすさ重視）
- 「あー」「えっと」など、意味を持たない繋ぎ言葉の削除
- 冗長な繰り返しを整理
- 文体の統一（ですます調なら維持、だ・である調なら維持）

【入力】
${truncatedText}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3, // 創造性は低めに、忠実性を重視
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API Error (formatText):', errorData)
      throw new Error('Failed to format text')
    }

    const data = await response.json()
    const formattedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!formattedText) {
      throw new Error('No formatted text generated')
    }

    return formattedText
  } catch (error) {
    console.error('AI Formatting Error:', error)
    throw error
  }
}

export async function summarizeText(text: string) {
  if (!text) {
    throw new Error('Text is required')
  }

  // 3000文字制限
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
                  text: `あなたはカウンセラーでも分析家でもありません。
ユーザーの思考を映し返す「鏡」として振る舞ってください。

目的は、
「ユーザーが書いた内容を、穏やかに短く言い換え、
　『自分はこう考えていたのか』と再認識させること」です。

【重要な制約】
- 箇条書きは禁止（自然な文章で）
- 「要点は〜です」「まとめると」などの情報処理的な枕詞は禁止
- 評価・助言・分析は一切禁止
- 一人称（私・AI）は使わない
- 「〜と感じているようです」「～ということですか」「〜を大切にされているのですね」といった、
  相手の思考をそっと確認するような穏やかなトーンで
- 出力は要約文のみ

【入力】
${truncatedText}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API Error (summarizeText):', errorData)
      throw new Error('Failed to summarize text')
    }

    const data = await response.json()
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!summary) {
      throw new Error('No summary generated')
    }

    return summary
  } catch (error) {
    console.error('AI Summarization Error:', error)
    throw error
  }
}
