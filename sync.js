const GITHUB_USER = "89609630063"; // Твой GitHub username
const REPO_NAME = "shifts-data"; // Имя репозитория
const FILE_PATH = "shifts.json";

// ❌ НЕ ВСТАВЛЯЙ ТОКЕН В КОД! Используй Secrets.
const GIT_TOKEN = "ТОКЕН_ИЗ_GITHUB"; 

async function updateShiftsOnGitHub(shifts) {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${FILE_PATH}`;

    try {
        // 1️⃣ Получаем SHA текущего файла (GitHub требует SHA при обновлении)
        const response = await fetch(url, {
            headers: { "Authorization": `token ${GIT_TOKEN}` }
        });

        let sha = "";
        if (response.ok) {
            const fileData = await response.json();
            sha = fileData.sha; // Получаем SHA файла, если он существует
        }

        // 2️⃣ Кодируем JSON в Base64
        const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(shifts, null, 2))));

        // 3️⃣ Обновляем файл на GitHub
        const updateResponse = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `token ${GIT_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Обновление смен",
                content: newContent,
                sha
            })
        });

        if (updateResponse.ok) {
            console.log("✅ Смены успешно обновлены на GitHub!");
        } else {
            console.error("❌ Ошибка при обновлении GitHub:", await updateResponse.text());
        }
    } catch (error) {
        console.error("❌ Ошибка сети:", error);
    }
}