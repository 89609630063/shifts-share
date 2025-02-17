const API_URL = "https://shift-schedule-server-production.up.railway.app/api/shifts"; // Замените на ваш API

// 🔄 Функция синхронизации смен с сервером
function syncShiftsWithServer() {
    console.log("📡 Синхронизация смен с сервером...");
    
    if (!shifts.length) {
        console.warn("⚠️ Нет смен для отправки!");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shifts) // Отправляем только массив смен
    })
    .then(response => response.json())
    .then(data => console.log("✅ Смены успешно синхронизированы:", data))
    .catch(error => console.error("❌ Ошибка отправки смен на сервер:", error));
}

// ✅ Добавление смены
function addShift(name, date, startTime, shiftType) {
    if (!name || !date || !startTime || !shiftType) {
        alert("⚠️ Заполните все поля!");
        return;
    }

    const newShift = {
        id: Date.now(),
        name,
        date,
        startTime,
        shiftType,
        remindBefore: 30,
        isDone: false
    };

    shifts.push(newShift);
    saveShiftsToLocalStorage();
    syncShiftsWithServer(); // 🚀 Отправляем изменения на сервер

    console.log("➕ Добавлена новая смена:", newShift);
}

// 🗑️ Удаление смены
function deleteShift(id) {
    shifts = shifts.filter(shift => shift.id !== id);
    saveShiftsToLocalStorage();
    syncShiftsWithServer(); // 🚀 Отправляем изменения на сервер

    console.log("❌ Удалена смена с ID:", id);
}

// ✏️ Редактирование смены
function editShift(id, newName, newDate, newStartTime, newShiftType) {
    let shift = shifts.find(shift => shift.id === id);
    if (!shift) {
        console.warn("⚠️ Смена не найдена!");
        return;
    }

    shift.name = newName || shift.name;
    shift.date = newDate || shift.date;
    shift.startTime = newStartTime || shift.startTime;
    shift.shiftType = newShiftType || shift.shiftType;

    saveShiftsToLocalStorage();
    syncShiftsWithServer(); // 🚀 Отправляем изменения на сервер

    console.log("✏️ Обновлена смена:", shift);
}

// 💾 Сохранение смен в локальное хранилище
function saveShiftsToLocalStorage() {
    localStorage.setItem("shifts", JSON.stringify(shifts));
    console.log("💾 Смены сохранены в LocalStorage");
}

// 🔄 Загрузка смен при старте
function loadShiftsFromLocalStorage() {
    const storedShifts = localStorage.getItem("shifts");
    if (storedShifts) {
        shifts = JSON.parse(storedShifts);
        console.log("📂 Загружены смены из LocalStorage:", shifts);
    } else {
        shifts = [];
    }
}

// ✅ Загружаем смены при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    loadShiftsFromLocalStorage();
    syncShiftsWithServer(); // 🚀 При загрузке сразу синхронизируемся с сервером
});