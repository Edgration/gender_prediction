document.getElementById("prediction-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const inputHiragana = document.getElementById("hiragana").value;

    try {
        const response = await fetch("https://your-backend-endpoint/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: inputHiragana }),
        });

        const data = await response.json();
        document.getElementById("results").innerText = `Possible of female: ${data.female}, Possible of male: ${data.male}`;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("results").innerText = "An error occurred. Please try again.";
    }
});
