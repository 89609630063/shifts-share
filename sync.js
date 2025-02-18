const GITHUB_USER = "89609630063"; // Твой GitHub username
const REPO_NAME = "shifts-data"; // Имя репозитория
const FILE_PATH = "shifts.json";
const GIT_TOKEN = "ТОКЕН_ИЗ_GITHUB_SECRETS"; // ❌ НЕ ХРАНИ В КОДЕ!!!


async function updateShiftsOnGitHub(shifts) {
    const url = `https://api.github.com/repos/89609630063/shifts-data/dispatches`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `token ghp_xxx`, // ❌ УДАЛИ ЭТО! Не вставляй токен прямо в код.
                "Accept": "application/vnd.github.everest-preview+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                event_type: "update-shifts",
                client_payload: { shifts }
            })
        });

        if (response.ok) {
            console.log("✅ Запрос в GitHub Actions отправлен!");
        } else {
            console.error("❌ Ошибка при отправке в GitHub:", await response.text());
        }
    } catch (error) {
        console.error("❌ Ошибка сети:", error);
    }
}