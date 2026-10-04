# FRAITERS MERCH

Официальный интернет-магазин авторского мерча и аксессуаров Fraiters.
В этом репозитории находится исходный код проекта.

## Tech Stack

*   **Framework:** Next.js 15 (App Router)
*   **Styling:** Tailwind CSS (В будущем планируется переход на чистый CSS / CSS Modules с использованием переменных для поддержки светлой/темной темы)
*   **Database:** SQLite
*   **ORM:** Drizzle ORM
*   **Animations:** Motion (Framer Motion)
*   **Forms:** React Hook Form

## Project Structure

*   `src/app` - Страницы и роутинг Next.js
*   `src/components` - Переиспользуемые React компоненты
*   `src/db` - Схема БД и настройка Drizzle (SQLite)
*   `src/hooks` - Кастомные React хуки
*   `src/lib` - Утилиты, контексты, константы и типы
*   `src/types` - Глобальные TypeScript типы (в процессе наполнения)

## Setup Instructions

1.  **Установка зависимостей:**
    ```bash
    npm install
    ```

2.  **Настройка окружения:**
    Скопируйте файл `.env.example` в `.env` и укажите необходимые переменные.
    ```bash
    cp .env.example .env
    ```
    *Важно: Никогда не коммитьте `.env` файл или файлы базы данных (`*.db`, `*.sqlite`) в репозиторий.*

3.  **Настройка базы данных:**
    Проект использует SQLite и Drizzle ORM. Для синхронизации схемы с базой данных выполните команду:
    ```bash
    npx drizzle-kit push
    ```
    Это создаст файл `sqlite.db` (или файл, указанный в `DATABASE_URL` в `.env`) со всеми необходимыми таблицами.

4.  **Запуск проекта:**
    Для запуска development-сервера:
    ```bash
    npm run dev
    ```
    Откройте [http://localhost:3000](http://localhost:3000) в браузере, чтобы увидеть результат.

## Development Guidelines

См. файл `AGENTS.md` для правил работы с кодом и архитектурных соглашений.
