const GITHUB_USER = "89609630063"; // Твой GitHub username
const REPO_NAME = "shifts-data"; // Имя репозитория
const FILE_PATH = "shifts.json";
const GIT_TOKEN = "ТОКЕН_ИЗ_GITHUB_SECRETS"; // ❌ НЕ ХРАНИ В КОДЕ!!!

// ✅ Функция обновления смен на GitHub
async function updateShiftsOnGitHub(shifts) {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    try {
        // 1️⃣ Получаем текущий SHA файла (GitHub требует SHA для обновления)
        const response = await fetch(url, {
            headers: { "Authorization": `token ${GIT_TOKEN}` }
        });

        let sha = null;
        if (response.ok) {
            const fileData = await response.json();
            sha = fileData.sha; // Если файл существует, получаем его SHA
        }

        // 2️⃣ Кодируем JSON в Base64 (GitHub API требует Base64)
        const newContent = btoa(unescape(encodeURIComponent(JSON.stringify({ shifts }, null, 2))));

        // 3️⃣ Отправляем обновление на GitHub
        const result = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `token ${GIT_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Обновление смен",
                content: newContent,
                sha // Добавляем SHA, если файл уже существует
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

// ✅ Обработчик формы
document.getElementById("shiftForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nameVal = document.getElementById("name").value.trim();
    const dateVal = document.getElementById("dateInput").value;
    const startTimeVal = document.getElementById("startTime").value;
    const shiftTypeVal = document.getElementById("shiftType").value;
    const remindBeforeVal = parseInt(document.getElementById("remindBefore").value, 10) || 0;

    if (!dateVal || !startTimeVal || !shiftTypeVal) {
        alert("Заполните дату, время и тип смены!");
        return;
    }

    const newShift = {
        id: Date.now(),
        name: nameVal,
        date: dateVal,
        startTime: startTimeVal,
        shiftType: shiftTypeVal,
        remindBefore: remindBeforeVal
    };

    shifts.push(newShift);

    // **Отправляем смены на GitHub**
    updateShiftsOnGitHub(shifts);

    renderShiftsTable();
    shiftForm.reset();
});