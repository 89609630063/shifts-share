const GITHUB_USER = "89609630063"; // Например, "myusername"
const REPO_NAME = "shifts-data"; // Твой репозиторий
const FILE_PATH = "shifts.json";
const GIT_TOKEN = process.env.GIT_TOKEN;

async function updateShiftsOnGitHub(shifts) {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    try {
        // 1️⃣ Получаем текущий SHA-файл (GitHub требует SHA при обновлении)
        const response = await fetch(url, {
            headers: { "Authorization": `token ${GIT_TOKEN}` }
        });
        const fileData = await response.json();
        const sha = fileData.sha; 

        // 2️⃣ Кодируем JSON в Base64
        const newContent = btoa(JSON.stringify({ shifts }, null, 2));

        // 3️⃣ Обновляем файл через GitHub API
        const result = await fetch(url, {
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

        if (result.ok) {
            console.log("✅ Смены успешно обновлены на GitHub!");
        } else {
            console.error("❌ Ошибка при обновлении GitHub:", await result.json());
        }
    } catch (error) {
        console.error("❌ Ошибка сети:", error);
    }
}