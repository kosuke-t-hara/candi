"use client";

import { useEffect, useState } from "react";
import { gaEvent } from "@/lib/ga";

const STORAGE_KEY = "candi_auth_hint_seen_v1";

interface AuthHintProps {
  screen?: string;
}

export function AuthHint({ screen = "auth" }: AuthHintProps) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY) === "1";
      setOpen(!seen); // 初回だけ開く
      setReady(true);

      // 初回表示した時点で seen を立てる
      if (!seen) localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage が使えない環境でも壊れないように
      setOpen(true);
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      gaEvent("auth_hint_toggle", {
        open: next,           // true: 展開 / false: 折りたたみ
        screen: screen,       // login / signup
      });
      return next;
    });
  };

  return (
    <div className="mb-4 rounded-lg border bg-white p-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="font-medium text-muted-foreground">やることに迷ったら</div>
        <button
          type="button"
          className="shrink-0 text-xs text-blue-600 hover:underline"
          onClick={toggle}
        >
          {open ? "閉じる" : "使い方を見る"}
        </button>
      </div>
      
      {open ? (
        <div className="mt-2 space-y-1 text-muted-foreground">
          <p>たとえば、「今日いちばん迷っていること」を1行で書きます。</p>
          <p>ログイン後、画面右下の丸いボタンから。</p>
        </div>
      ) : (
        <div className="text-muted-foreground">

        </div>
      )}
    </div>
  );
}
