const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();
const token = process.env.token;
const bot = new TelegramBot(token, { polling: true });

// Admin chat IDs
let adminChatIds = [5889469844]; // Replace with actual admin chat IDs

// Regions and districts data
const regions = {
    'Toshkent': ['Bektemir', 'Chilonzor', 'Hamza', 'Mirobod', 'Mirzo Ulugbek', 'Sergeli', 'Shayxontohur', 'Uchtepa', 'Yakkasaroy', 'Yunusobod', 'Yashnobod'],
    'Andijon': ['Andijon shahri', 'Asaka', 'Baliqchi', 'Bo\'z', 'Buloqboshi', 'Jalaquduq', 'Izboskan', 'Qo\'rg\'ontepa', 'Marhamat', 'Oltinko\'l', 'Paxtaobod', 'Shahrixon', 'Ulug\'nor', 'Xo\'jaobod', 'Andijon tumani'],
    'Buxoro': ['Buxoro shahri', 'Buxoro tumani', 'G\'ijduvon', 'Jondor', 'Kogon', 'Olot', 'Peshku', 'Qorako\'l', 'Qorovulbozor', 'Romitan', 'Shofirkon', 'Vobkent'],
    'Farg\'ona': ['Farg\'ona shahri', 'Beshariq', 'Bog\'dod', 'Buvayda', 'Dang\'ara', 'Farg\'ona tumani', 'Furqat', 'Qo\'qon', 'Oltiariq', 'O\'zbekiston', 'Rishton', 'So\'x', 'Toshloq', 'Uchko\'prik', 'Yozyovon', 'Quva', 'Quvasoy'],
    'Jizzax': ['Jizzax shahri', 'Arnasoy', 'Baxmal', 'Do\'stlik', 'Forish', 'G\'allaorol', 'Jizzax tumani', 'Mirzacho\'l', 'Paxtakor', 'Yangiobod', 'Zafarobod', 'Zarbdor', 'Zomin'],
    'Xorazm': ['Urganch shahri', 'Bog\'ot', 'Gurlan', 'Qo\'shko\'pir', 'Shovot', 'Urganch tumani', 'Xiva', 'Xonqa', 'Hazorasp', 'Yangiariq', 'Yangibozor'],
    'Namangan': ['Namangan shahri', "Namangan tumani", "Yangi namangan tumani", 'Chortoq', 'Chust', 'Kosonsoy', 'Mingbuloq', 'Norin', 'Pop', 'To\'raqo\'rg\'on', 'Uchqo\'rg\'on', 'Uychi', 'Yangiqo\'rg\'on', 'Davlatobod'],
    'Navoiy': ['Navoiy shahri', 'Karmana', 'Qiziltepa', 'Navbahor', 'Nurota', 'Tomdi', 'Uchquduq', 'Xatirchi', 'Zarafshon', 'Konimex'],
    'Qashqadaryo': ['Qarshi shahri', 'Chiroqchi', 'Dehqonobod', 'G\'uzor', 'Qamashi', 'Qarshi tumani', 'Kasbi', 'Kitob', 'Koson', 'Mirishkor', 'Muborak', 'Nishon', 'Shahrisabz', 'Yakkabog\''],
    'Samarqand': ['Samarqand shahri', 'Bulung\'ur', 'Jomboy', 'Ishtixon', 'Kattaqo\'rg\'on', 'Narpay', 'Nurobod', 'Oqdaryo', 'Paxtachi', 'Pastdarg\'om', 'Payariq', 'Qo\'shrabot', 'Samarqand tumani', 'Toyloq', 'Urgut'],
    'Sirdaryo': ['Guliston shahri', 'Boyovut', 'Guliston tumani', 'Mirzaobod', 'Oqoltin', 'Sayxunobod', 'Sardoba', 'Sirdaryo tumani', 'Xovos', 'Yangiyer', 'Shirin'],
    'Surxondaryo': ['Termiz shahri', 'Angor', 'Boysun', 'Denov', 'Jarqo\'rg\'on', 'Muzrabot', 'Oltinsoy', 'Qiziriq', 'Qumqo\'rg\'on', 'Sariosiyo', 'Sherobod', 'Sho\'rchi', 'Termiz tumani', 'Uzun'],
    'Toshkent viloyati': ['Toshkent tumani', 'Bekobod', 'Bo\'stonliq', 'Bo\'ka', 'Chinoz', 'Ohangaron', 'Oqqo\'rg\'on', 'Parkent', 'Piskent', 'Quyi Chirchiq', 'O\'rtachirchiq', 'Yangiyo\'l', 'Yuqori Chirchiq', 'Zangiota']
};

let userInfo = {};
let phoneList = ['Telefon 1', 'Telefon 2', 'Telefon 3'];
let adminState = {};
let cardNumbers = ['1111222233334444']; // Initialize with the given card number

// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userInfo[chatId] = { userId: chatId, firstName: msg.from.first_name, lastName: msg.from.last_name, username: msg.from.username };
    sendRegionSelection(chatId);
});

function sendRegionSelection(chatId) {
    const regionKeyboard = [];
    const regionList = Object.keys(regions);
    for (let i = 0; i < regionList.length; i += 2) {
        regionKeyboard.push(regionList.slice(i, i + 2));
    }
    bot.sendMessage(chatId, "Viloyatingizni tanlang.", {
        reply_markup: {
            keyboard: regionKeyboard,
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}

function sendDistrictSelection(chatId, region) {
    const districtKeyboard = [];
    const districts = regions[region];
    for (let i = 0; i < districts.length; i += 2) {
        districtKeyboard.push(districts.slice(i, i + 2));
    }
    districtKeyboard.push(['Orqaga']);
    bot.sendMessage(chatId, "Tumaningizni tanlang.", {
        reply_markup: {
            keyboard: districtKeyboard,
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}

function sendPhoneSelection(chatId) {
    const phoneKeyboard = [];
    for (let i = 0; i < phoneList.length; i += 2) {
        phoneKeyboard.push(phoneList.slice(i, i + 2));
    }
    phoneKeyboard.push(['Orqaga']);
    bot.sendMessage(chatId, "Telefon tanlang.", {
        reply_markup: {
            keyboard: phoneKeyboard,
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}

// Admin panel
bot.onText(/\/admin/, (msg) => {
    const chatId = msg.chat.id;
    if (adminChatIds.includes(chatId)) {
        adminState[chatId] = 'main';
        sendAdminPanel(chatId);
    } else {
        bot.sendMessage(chatId, "Sizda bu buyruqni bajarish uchun ruxsat yo'q.");
    }
});

function sendAdminPanel(chatId) {
    bot.sendMessage(chatId, "Admin paneli:", {
        reply_markup: {
            keyboard: [
                ["Yangi telefon qo'shish", "Telefonni o'chirish"],
                ["Admin qo'shish", "Adminni o'chirish"],
                ["Karta raqam qo'shish", "Karta raqamni o'chirish"],
                ["Telefonlar ro'yxati", "Adminlar ro'yxati", "Karta raqamlar ro'yxati"]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    });
}

// Handling messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (adminChatIds.includes(chatId) && adminState[chatId]) {
        handleAdminMessage(chatId, text);
    } else if (userInfo[chatId]) {
        handleUserMessage(chatId, text);
    }
});

function handleUserMessage(chatId, text) {
    if (!userInfo[chatId].region && regions[text]) {
        userInfo[chatId].region = text;
        sendDistrictSelection(chatId, text);
    } else if (userInfo[chatId].region && text === 'Orqaga') {
        delete userInfo[chatId].region;
        sendRegionSelection(chatId);
    } else if (userInfo[chatId].region && !userInfo[chatId].district && regions[userInfo[chatId].region].includes(text)) {
        userInfo[chatId].district = text;
        sendPhoneSelection(chatId);
    } else if (userInfo[chatId].district && text === 'Orqaga') {
        delete userInfo[chatId].district;
        sendDistrictSelection(chatId, userInfo[chatId].region);
    } else if (userInfo[chatId].district && phoneList.includes(text)) {
        userInfo[chatId].selectedPhone = text;
        sendInfoToAdmin(chatId);
    }
}

function sendInfoToAdmin(chatId) {
    const info = userInfo[chatId];
    const message = `
Telegram profili:
🆔 User ID: ${"T.me/@id" + info.userId || 'kiritilmagan'}
👤 Ism: ${info.firstName || 'kiritilmagan'}
📝 Familiya: ${info.lastName || 'kiritilmagan'}
🏷 Username: ${"@" + info.username || 'kiritilmagan'}

Kiritilgan ma'lumotlar:
🏙 Viloyat: ${info.region || 'N/A'}
🏘 Tuman: ${info.district || 'N/A'}
📱 Tanlangan telefon: ${info.selectedPhone || 'N/A'}
`;

    adminChatIds.forEach(adminChatId => {
        bot.sendMessage(adminChatId, message);
    });

    delete userInfo[chatId];

    // Send card numbers to the user
    bot.sendMessage(chatId, "Karta raqamlari:\n" + cardNumbers.join("\n"));

    bot.sendMessage(chatId, "Rahmat! Ma'lumotlaringiz yuborildi. Sotuvchi tez orada siz bilan bog'lanadi");
}

function handleAdminMessage(chatId, text) {
    if (text === 'Yangi telefon qo\'shish') {
        adminState[chatId] = 'addPhone';
        bot.sendMessage(chatId, "Yangi telefonni kiriting:");
    } else if (text === 'Telefonni o\'chirish') {
        adminState[chatId] = 'removePhone';
        sendPhoneSelection(chatId);
    } else if (text === 'Admin qo\'shish') {
        adminState[chatId] = 'addAdmin';
        bot.sendMessage(chatId, "Yangi adminning chat ID sini kiriting:");
    } else if (text === 'Adminni o\'chirish') {
        adminState[chatId] = 'removeAdmin';
        sendAdminSelection(chatId);
    } else if (text === 'Karta raqam qo\'shish') {
        adminState[chatId] = 'addCard';
        bot.sendMessage(chatId, "Yangi karta raqamini kiriting:");
    } else if (text === 'Karta raqamni o\'chirish') {
        adminState[chatId] = 'removeCard';
        sendCardSelection(chatId);
    } else if (adminState[chatId] === 'addPhone') {
        phoneList.push(text);
        adminState[chatId] = 'main';
        bot.sendMessage(chatId, "Yangi Telefon qo'shildi.");
        sendAdminPanel(chatId);
    } else if (adminState[chatId] === 'removePhone' && phoneList.includes(text)) {
        phoneList = phoneList.filter(phone => phone !== text);
        adminState[chatId] = 'main';
        bot.sendMessage(chatId, "Telefon o'chirildi.");
        sendAdminPanel(chatId);
    } else if (adminState[chatId] === 'addAdmin') {
        adminChatIds.push(Number(text));
        adminState[chatId] = 'main';
        bot.sendMessage(chatId, "Admin qo'shildi.");
        sendAdminPanel(chatId);
    } else if (adminState[chatId] === 'removeAdmin' && adminChatIds.includes(Number(text))) {
        adminChatIds = adminChatIds.filter(id => id !== Number(text));
        adminState[chatId] = 'main';
        bot.sendMessage(chatId, "Admin o'chirildi.");
        sendAdminPanel(chatId);
    } else if (adminState[chatId] === 'addCard') {
        cardNumbers.push(text);
        adminState[chatId] = 'main';
        bot.sendMessage(chatId, "Karta raqami qo'shildi.");
        sendAdminPanel(chatId);
    } else if (adminState[chatId] === 'removeCard' && cardNumbers.includes(text)) {
        cardNumbers = cardNumbers.filter(card => card !== text);
        adminState[chatId] = 'main';
        bot.sendMessage(chatId, "Karta raqami o'chirildi.");
        sendAdminPanel(chatId);
    } else if (text === 'Telefonlar ro\'yxati') {
        bot.sendMessage(chatId, "Telefonlar ro'yxati:\n" + phoneList.join("\n"));
    } else if (text === 'Adminlar ro\'yxati') {
        bot.sendMessage(chatId, "Adminlar ro'yxati:\n" + adminChatIds.join("\n"));
    } else if (text === 'Karta raqamlar ro\'yxati') {
        bot.sendMessage(chatId, "Karta raqamlar ro'yxati:\n" + cardNumbers.join("\n"));
    }
}

function sendAdminSelection(chatId) {
    const adminKeyboard = [];
    for (let i = 0; i < adminChatIds.length; i += 2) {
        adminKeyboard.push(adminChatIds.slice(i, i + 2).map(String));
    }
    adminKeyboard.push(['Orqaga']);
    bot.sendMessage(chatId, "Adminni tanlang.", {
        reply_markup: {
            keyboard: adminKeyboard,
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}

function sendCardSelection(chatId) {
    const cardKeyboard = [];
    for (let i = 0; i < cardNumbers.length; i += 2) {
        cardKeyboard.push(cardNumbers.slice(i, i + 2));
    }
    cardKeyboard.push(['Orqaga']);
    bot.sendMessage(chatId, "Karta raqamini tanlang.", {
        reply_markup: {
            keyboard: cardKeyboard,
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}
