# Toro Context 生成箇所 - 実装棚卸し結果

`toro_entries.context` の生成を行っている箇所をコードベースから抽出・整理しました。
中央集権的な保存関数 `createToroEntry` (app/actions/toro.ts) に対して、UI コンポーネントごとの呼び出しパターンを分類しています。

---

## 1. 応募 (Application) 関連

### 1-1. 新規応募作成時の自動生成

新規応募を作成した際、入力された「紹介元詳細」や「次のアクション」を Toro エントリーとして保存しています。

- **ファイルパス**: `components/new-opportunity-bottom-sheet.tsx`
- **コンポーネント**: `NewOpportunityBottomSheet`
- **呼び出し元**: 新規応募追加モーダル ("保存する" 実行時)
- **生成される context**:

```json
{
  "source": "candi_application",
  "applicationId": "（新規作成された Application ID）",
  "companyName": "（入力された企業名）"
}
```

- **特徴**:
  - `source` を明示的に指定。
  - `type` は指定なし（ `null` または `undefined` ）。

### 1-2. 応募詳細画面でのメモ追加

既存の応募に対してメモを追加する場合です。

- **ファイルパス**: `components/application-detail-modal.tsx`
- **コンポーネント**: `ApplicationDetailModal`
- **呼び出し元**: 応募詳細ダイアログ内の "この応募のメモ > メモを追加"
- **生成される context**:

```json
{
  "source": "candi_application",
  "applicationId": "（現在の Application ID）",
  "companyName": "（現在の企業名）"
}
```

- **特徴**:
  - 1-1 と同じ構造。

---

## 2. イベント (Event) 関連

### 2-1. イベント詳細でのメモ追加・編集

特定の選考イベント（面接など）に紐づくメモです。

- **ファイルパス**:
  1. `components/application-detail-modal.tsx` (`ApplicationDetailModal`)
  2. `components/add-event-bottom-sheet.tsx` (`AddEventBottomSheet`)
- **コンポーネント**: 上記 2 ファイルで共通のロジックを使用
- **呼び出し元**:
  - 応募詳細タイムライン上の "メモを追加" / "編集"
  - イベント追加・編集シート内の "メモを追加"
- **生成される context**:

```json
{
  "source": "candi_event",
  "applicationId": "（親となる Application ID）",
  "eventId": "（対象の Event ID）",
  "eventTitle": "（イベント名 または イベント種別）"
}
```

- **特徴**:
  - `source` が `candi_event` となる。
  - `eventId` が必須で含まれる。
  - `eventTitle` に「一次面接」「PdM 面談」などの文字列が入る。

---

## 3. 転職活動の軸 (Job Change Analysis)

ホーム画面にある「あなたの転職活動について」セクションからの入力です。3 つの設問ごとに異なる `type` が割り振られています。

- **ファイルパス**: `components/job-change-details.tsx`
- **コンポーネント**: `JobChangeDetails`
- **呼び出し元**: ホーム画面下部 "あなたの転職活動について" 内の各項目
- **生成される context**:

**A. 大事なポイント (Priority)**

```json
{
  "type": "job_change_priority"
}
```

**B. 転職理由 (Reason)**

```json
{
  "type": "job_change_reason"
}
```

**C. 避けたい条件 (Avoid)**

```json
{
  "type": "job_change_avoid"
}
```

- **特徴**:
  - `type` キーのみを持つシンプルな構造。
  - `source` キーは存在しない。

---

## 4. 今のひとこと (Hitokoto)

ホーム画面や専用書き込みページからの自由記述です。

- **ファイルパス**:
  1. `components/home-page-client.tsx` (Floating Action Button からの起動)
  2. `app/(public)/(toro)/write/write-client.tsx` ( `/write` ページ)
- **呼び出し元**:
  - 右下の "+" ボタン -> "今のひとこと" シート
  - `/write` ページ（Deep Link や URL 直アクセス）
- **生成される context**:

```json
{
  "type": "hitokoto"
}
```

- **特徴**:
  - `type: 'hitokoto'` で固定。
  - 基本的にこれ以外のキーを持たない。

---

## 集計・まとめ

| 分類             | context.source      | context.type   | その他の主要キー                         | 備考                                  |
| :--------------- | :------------------ | :------------- | :--------------------------------------- | :------------------------------------ |
| **応募メモ**     | `candi_application` | (なし)         | `applicationId`, `companyName`           | 新規作成時と詳細画面メモで共通        |
| **イベントメモ** | `candi_event`       | (なし)         | `applicationId`, `eventId`, `eventTitle` | `eventId` で一意に特定                |
| **転職の軸**     | (なし)              | `job_change_*` | -                                        | `priority`, `reason`, `avoid` の 3 種 |
| **ひとこと**     | (なし)              | `hitokoto`     | -                                        | 最も汎用的なエントリー                |

### 補足事項

- `createToroEntry` 自体は `context: any` を受け取るため、型定義上の強制力はない。
- データの取得 (`getToroEntries` 等) では、PostgreSQL の JSONB クエリ (`->>type`, `contains`) を使用してこれらのキーを参照している。
