# Инструкция по деплою

## Вариант 1: Vercel (рекомендуется - бесплатно и просто)

1. **Установите Vercel CLI** (опционально, можно через веб-интерфейс):
   ```bash
   npm i -g vercel
   ```

2. **Задеплойте через CLI**:
   ```bash
   vercel
   ```
   Следуйте инструкциям в терминале.

3. **Или через веб-интерфейс**:
   - Зайдите на https://vercel.com
   - Войдите через GitHub
   - Нажмите "New Project"
   - Подключите ваш репозиторий
   - Настройки:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Нажмите "Deploy"

4. **После деплоя** вы получите постоянную ссылку вида: `https://your-project.vercel.app`

## Вариант 2: Netlify

1. Зайдите на https://netlify.com
2. Войдите через GitHub
3. Нажмите "Add new site" → "Import an existing project"
4. Подключите репозиторий
5. Настройки:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Нажмите "Deploy site"

## Вариант 3: GitHub Pages

1. Установите `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Добавьте в `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. Запустите:
   ```bash
   npm run deploy
   ```

4. Включите GitHub Pages в настройках репозитория (Settings → Pages)

## Вариант 4: Быстрый доступ через ngrok (для разработки)

1. Установите ngrok: https://ngrok.com/download
2. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
3. В другом терминале запустите:
   ```bash
   ngrok http 5173
   ```
4. Вы получите публичную ссылку (действует пока запущен ngrok)

