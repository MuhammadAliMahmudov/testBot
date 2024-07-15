const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config()
const token=process.env.token
const bot = new TelegramBot(token, { polling: true });

// Admin chat IDs
const adminChatIds = [648424505, 1015112180]; // Replace with actual admin chat IDs

// Regions and districts data
const regions = {
    'Toshkent': ['Bektemir', 'Chilonzor', 'Hamza', 'Mirobod', 'Mirzo Ulugbek', 'Sergeli', 'Shayxontohur', 'Uchtepa', 'Yakkasaroy', 'Yunusobod', 'Yashnobod'],
    'Andijon': ['Andijon shahri', 'Asaka', 'Baliqchi', 'Bo\'z', 'Buloqboshi', 'Jalaquduq', 'Izboskan', 'Qo\'rg\'ontepa', 'Marhamat', 'Oltinko\'l', 'Paxtaobod', 'Shahrixon', 'Ulug\'nor', 'Xo\'jaobod', 'Andijon tumani'],
    'Buxoro': ['Buxoro shahri', 'Buxoro tumani', 'G\'ijduvon', 'Jondor', 'Kogon', 'Olot', 'Peshku', 'Qorako\'l', 'Qorovulbozor', 'Romitan', 'Shofirkon', 'Vobkent'],
    'Farg\'ona': ['Farg\'ona shahri', 'Beshariq', 'Bog\'dod', 'Buvayda', 'Dang\'ara', 'Farg\'ona tumani', 'Furqat', 'Qo\'qon', 'Oltiariq', 'O\'zbekiston', 'Rishton', 'So\'x', 'Toshloq', 'Uchko\'prik', 'Yozyovon', 'Quva', 'Quvasoy'],
    'Jizzax': ['Jizzax shahri', 'Arnasoy', 'Baxmal', 'Do\'stlik', 'Forish', 'G\'allaorol', 'Jizzax tumani', 'Mirzacho\'l', 'Paxtakor', 'Yangiobod', 'Zafarobod', 'Zarbdor', 'Zomin'],
    'Xorazm': ['Urganch shahri', 'Bog\'ot', 'Gurlan', 'Qo\'shko\'pir', 'Shovot', 'Urganch tumani', 'Xiva', 'Xonqa', 'Hazorasp', 'Yangiariq', 'Yangibozor'],
    'Namangan': ['Namangan shahri', "Namangan tumani", "Yangi namangan tumani", 'Chortoq', 'Chust', 'Kosonsoy', 'Mingbuloq', 'Namangan tumani', 'Norin', 'Pop', 'To\'raqo\'rg\'on', 'Uchqo\'rg\'on', 'Uychi', 'Yangiqo\'rg\'on'],
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

// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userInfo[chatId] = {};
    bot.sendMessage(chatId, "Telefon raqamingizni kiriting.", {
        reply_markup: {
            keyboard: [[{
                text: "Telefon raqamini yuborish",
                request_contact: true
            }]],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

// Handling contact
bot.on('contact', (msg) => {
    const chatId = msg.chat.id;
    userInfo[chatId] = {
        phoneNumber: msg.contact.phone_number,
        userId: msg.from.id,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        username: msg.from.username
    };
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
        bot.sendMessage(chatId, "Admin paneli:", {
            reply_markup: {
                keyboard: [
                    ["Yangi telefon qo'shish", "Telefonni o'chirish"],
                    ["Telefonlar ro'yxati"]
                ],
                resize_keyboard: true,
                one_time_keyboard: false
            }
        });
    } else {
        bot.sendMessage(chatId, "Sizda bu buyruqni bajarish uchun ruxsat yo'q.");
    }
});

// Handling messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (msg.contact) {
        return;
    }

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
    } else if (!userInfo[chatId].district && userInfo[chatId].region && regions[userInfo[chatId].region].includes(text)) {
        userInfo[chatId].district = text;
        sendPhoneSelection(chatId);
    } else if (!userInfo[chatId].selectedPhone && phoneList.includes(text)) {
        userInfo[chatId].selectedPhone = text;
        const user = userInfo[chatId];
        const message = `
Yangi foydalanuvchi ma'lumotlari:

Telegram profili:
🆔 User ID: ${"T.me/@id" + user.userId}
👤 Ism: ${user.firstName}
📝 Familiya: ${user.lastName || 'Kiritilmagan'}
🏷 Username: @${user.username || 'Kiritilmagan'}

Kiritilgan ma'lumotlar:
📞 Telefon raqami: ${user.phoneNumber}
🏙 Viloyat: ${user.region}
🏘 Tuman: ${user.district}
📱 Tanlangan telefon: ${user.selectedPhone}
`;
        adminChatIds.forEach(adminId => {
            bot.sendMessage(adminId, message);
        });
        bot.sendMessage(chatId, "Ma'lumotlaringiz qabul qilindi. Rahmat! Tez orada sotuvchi aloqaga chiqadi");
    } else if (text === 'Orqaga') {
        if (userInfo[chatId].district) {
            userInfo[chatId].district = null;
            sendRegionSelection(chatId);
        } else if (userInfo[chatId].region) {
            userInfo[chatId].region = null;
            sendRegionSelection(chatId);
        } else if (userInfo[chatId].selectedPhone) {
            userInfo[chatId].selectedPhone = null;
            sendDistrictSelection(chatId, userInfo[chatId].region);
        }
    }
}

function handleAdminMessage(chatId, text) {
    switch (adminState[chatId]) {
        case 'main':
            if (text === "Yangi telefon qo'shish") {
                adminState[chatId] = 'adding_phone';
                bot.sendMessage(chatId, "Yangi telefon nomini kiriting:");
            } else if (text === "Telefonni o'chirish") {
                adminState[chatId] = 'deleting_phone';
                sendPhoneListForDeletion(chatId);
            } else if (text === "Telefonlar ro'yxati") {
                const phoneListMessage = phoneList.join('\n');
                bot.sendMessage(chatId, `Telefonlar ro'yxati:\n${phoneListMessage}`);
            }
            break;
        case 'adding_phone':
            if (text === 'Orqaga') {
                returnToAdminPanel(chatId);
            } else {
                phoneList.push(text);
                bot.sendMessage(chatId, `Yangi telefon qo'shildi: ${text}`);
                returnToAdminPanel(chatId);
            }
            break;
        case 'deleting_phone':
            if (text === 'Orqaga') {
                returnToAdminPanel(chatId);
            } else if (phoneList.includes(text)) {
                phoneList = phoneList.filter(phone => phone !== text);
                bot.sendMessage(chatId, `Telefon o'chirildi: ${text}`);
                returnToAdminPanel(chatId);
            } else {
                bot.sendMessage(chatId, "Noto'g'ri tanlov, qayta urinib ko'ring.");
                sendPhoneListForDeletion(chatId);
            }
            break;
    }
}

function sendPhoneListForDeletion(chatId) {
    const phoneKeyboard = phoneList.map(phone => [phone]);
    phoneKeyboard.push(['Orqaga']);
    bot.sendMessage(chatId, "O'chiriladigan telefonni tanlang:", {
        reply_markup: {
            keyboard: phoneKeyboard,
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}

function returnToAdminPanel(chatId) {
    adminState[chatId] = 'main';
    bot.sendMessage(chatId, "Admin paneli:", {
        reply_markup: {
            keyboard: [
                ["Yangi telefon qo'shish", "Telefonni o'chirish"],
                ["Telefonlar ro'yxati"]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    });
}