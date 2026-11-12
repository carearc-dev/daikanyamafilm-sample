# DAIKANYAMA FILM Website

DAIKANYAMA FILMの静的Webサイトです。HTML・CSS・JavaScriptで構成しており、ビルド用の依存パッケージはありません。

## ファイル構成

- `index.html` — ページ本体
- `style.css` — PC・スマートフォン用スタイル、アニメーション
- `script.js` — メニュー、スライダー、スクロール演出
- `assets/` — ロゴ、写真、作品サムネイル

## ローカルで表示

`index.html` をブラウザーで開くか、プロジェクトフォルダーで次を実行します。

```sh
python3 -m http.server 8000
```

その後、`http://localhost:8000/` を開いてください。

## GitHub Pages

1. このフォルダーの内容をGitHubリポジトリのルートへアップロードします。
2. リポジトリの **Settings → Pages** を開きます。
3. **Deploy from a branch** を選び、公開ブランチと `/ (root)` を指定して保存します。

`assets/` の画像はDAIKANYAMA FILM公式サイトの素材を使用しています。
