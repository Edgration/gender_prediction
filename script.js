const hiraganaMap = {
    "あ": 1, "い": 2, "ぅ": 3, "う": 4, "え": 5, "お": 6,
    "か": 7, "が": 8, "き": 9, "ぎ": 10, "く": 11, "ぐ": 12,
    "け": 13, "げ": 14, "こ": 15, "ご": 16, "さ": 17, "ざ": 18,
    "し": 19, "じ": 20, "す": 21, "ず": 22, "せ": 23, "ぜ": 24,
    "そ": 25, "ぞ": 26, "た": 27, "だ": 28, "ち": 29, "っ": 30,
    "つ": 31, "づ": 32, "て": 33, "で": 34, "と": 35, "ど": 36,
    "な": 37, "に": 38, "ぬ": 39, "ね": 40, "の": 41, "は": 42,
    "ば": 43, "ぱ": 44, "ひ": 45, "び": 46, "ふ": 47, "ぶ": 48,
    "へ": 49, "べ": 50, "ぺ": 51, "ほ": 52, "ぼ": 53, "ぽ": 54,
    "ま": 55, "み": 56, "む": 57, "め": 58, "も": 59, "ゃ": 60,
    "や": 61, "ゅ": 62, "ゆ": 63, "ょ": 64, "よ": 65, "ら": 66,
    "り": 67, "る": 68, "れ": 69, "ろ": 70, "わ": 71, "を": 72,
    "ん": 73
};

// 罗马字到平假名的转换映射
const romajiToHiragana = {
    "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
    "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
    "ga": "が", "gi": "ぎ", "gu": "ぐ", "ge": "げ", "go": "ご",
    "sa": "さ", "shi": "し", "su": "す", "se": "せ", "so": "そ",
    "za": "ざ", "ji": "じ", "zu": "ず", "ze": "ぜ", "zo": "ぞ",
    "ta": "た", "chi": "ち", "tsu": "つ", "te": "て", "to": "と",
    "da": "だ", "ji": "じ", "zu": "ず", "de": "で", "do": "ど",
    "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
    "ha": "は", "hi": "ひ", "fu": "ふ", "he": "へ", "ho": "ほ",
    "ba": "ば", "bi": "び", "bu": "ぶ", "be": "べ", "bo": "ぼ",
    "pa": "ぱ", "pi": "ぴ", "pu": "ぷ", "pe": "ぺ", "po": "ぽ",
    "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
    "ya": "や", "yu": "ゆ", "yo": "よ", "ra": "ら", "ri": "り",
    "ru": "る", "re": "れ", "ro": "ろ", "wa": "わ", "wo": "を", "n": "ん",

    // 复合假名（拗音）
    "kya": "きゃ", "kyu": "きゅ", "kyo": "きょ",
    "sha": "しゃ", "shu": "しゅ", "sho": "しょ",
    "cha": "ちゃ", "chu": "ちゅ", "cho": "ちょ",
    "nya": "にゃ", "nyu": "にゅ", "nyo": "にょ",
    "hya": "ひゃ", "hyu": "ひゅ", "hyo": "ひょ",
    "mya": "みゃ", "myu": "みゅ", "myo": "みょ",
    "rya": "りゃ", "ryu": "りゅ", "ryo": "りょ",

    "gya": "ぎゃ", "gyu": "ぎゅ", "gyo": "ぎょ",
    "ja": "じゃ", "ju": "じゅ", "jo": "じょ",
    "bya": "びゃ", "byu": "びゅ", " byo": "びょ",
    "pya": "ぴゃ", "pyu": "ぴゅ", "pyo": "ぴょ"
};

document.getElementById("prediction-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    let inputHiragana = document.getElementById("hiragana").value.trim();

    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block";
    document.getElementById("results").innerText = "";


    // 如果输入的是罗马字，则转换为平假名
    if (!inputHiragana.match(/[\u3040-\u309F]/)) { // 检查输入是否已经包含平假名
        inputHiragana = convertRomajiToHiragana(inputHiragana); // 转换罗马字为平假名
    }

    // 检查输入是否是合法的平假名字符
    if (!inputHiragana.match(/^[\u3040-\u309F]+$/)) {
        loadingElement.style.display = "none";
        document.getElementById("results").innerText = "Input error: \nPlease enter valid Hiragana or Romaji.";
        return;
    }


    try {
    	await new Promise((resolve) => setTimeout(resolve, 300));
        const response = await fetch("https://gender-prediction-8jy7.onrender.com/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: inputHiragana }),
        });

        const data = await response.json();

        // 显示输入的平假名及预测结果
		const resultText = `${inputHiragana}: Female: ${(data.female * 100).toFixed(2)}%, Male: ${(data.male * 100).toFixed(2)}%`;
		
		loadingElement.style.display = "none";	
		document.getElementById("results").innerText = resultText;

        // 保存历史记录到本地存储
        let history = JSON.parse(localStorage.getItem("history")) || [];
        history.push(resultText);
        localStorage.setItem("history", JSON.stringify(history));

        // 显示历史记录
        displayHistory();
    } catch (error) {
    	loadingElement.style.display = "none";
        console.error("Error:", error);
        document.getElementById("results").innerText = "An error occurred.\n Please try again.";
    }
});

// 将罗马字转换为平假名
function convertRomajiToHiragana(romaji) {
    const romajiParts = romaji.toLowerCase().split(/\s+/);
    let hiragana = "";

    for (let part of romajiParts) {
        if (romajiToHiragana[part]) {
            hiragana += romajiToHiragana[part];
        } else {
            hiragana += part; // 如果没有对应的平假名，则保留原始输入
        }
    }

    return hiragana;
}

// 显示历史记录
function displayHistory() {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = ""; // 清空当前历史记录

    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        historyList.appendChild(listItem);
    });
}

// 页面加载时显示历史记录
document.addEventListener("DOMContentLoaded", displayHistory);

function clearHistory() {
    document.getElementById("history-list").innerHTML = '';
    localStorage.removeItem('history');
}
