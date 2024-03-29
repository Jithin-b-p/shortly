"use strict";

import "./style.css";

const input = document.getElementById("link-input");
const linkForm = document.getElementById("link-form");
const errMsg = document.getElementById("err-msg");
const menuBtn = document.getElementById("menu-btn");
const submitBtn = document.getElementById("submit-btn");

const menu = document.getElementById("menu");

const generatedLinks = document.getElementById("generated-links");

const storageData = sessionStorage.getItem("data");
let savedData = [];

if (storageData) {
  try {
    savedData = JSON.parse(storageData);
    displayShorten();
  } catch (error) {
    console.error("Error parsing storage data: ", error);
    sessionStorage.removeItem("data");
  }
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

async function shortenUrl(longUrl) {
  // 1. Define the API endpoint URL
  const apiUrl = "https://url-short-api-seven.vercel.app/shorten";

  // 2. Prepare the data object with the encoded long URL
  const data = { url: longUrl };
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return responseJson.result_url; // Extract the shortened URL from the response
  } catch (error) {
    alert("Server down");
    return null;
  }
}

function displayShorten() {
  generatedLinks.innerHTML = savedData
    .map((data) => {
      return `<div
            class="generated-container"
          >
            <p
              class="long-url"
            >
              ${data.longUrl}
            </p>

            <div
              class="generated-url-container"
            >
              <p
                class="shorturl"
                >${data.shortUrl}</p
              >
              <button class="bg-customcyan"
              >
                Copy
              </button>
            </div>
          </div>`;
    })
    .join("");
}

function formSubmit(e) {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.ariaDisabled = true;

  if (input.value === "") {
    errMsg.innerHTML = "Please enter something";
    input.classList.add("border-red");
    submitBtn.disabled = false;
    submitBtn.ariaDisabled = false;
  } else if (!isValidUrl(input.value)) {
    input.value = "";
    errMsg.innerHTML = "Please enter a valid URL";
    input.classList.add("border-red");
    submitBtn.disabled = false;
    submitBtn.ariaDisabled = false;
  } else {
    const longUrl = input.value;
    if (savedData?.find((data) => data.longUrl === longUrl)) {
      errMsg.innerHTML = "Already shortened!!";
      input.classList.add("border-red");
      input.value = "";
      return;
    }
    input.value = "";
    generatedLinks.innerHTML = `<div class="loader"></div>`;
    shortenUrl(longUrl).then((shortUrl) => {
      if (shortUrl) {
        savedData = [...savedData, { longUrl, shortUrl }];
        sessionStorage.setItem("data", JSON.stringify(savedData));

        generatedLinks.innerHTML = "";
        displayShorten();
      }

      submitBtn.disabled = false;
      submitBtn.ariaDisabled = false;
    });
    errMsg.innerHTML = "";
    input.classList.remove("border-red");
  }
}

function handleMenuClick(e) {
  menuBtn.classList.toggle("open");
  menu.classList.toggle("flex");
  menu.classList.toggle("hidden");
  if (menuBtn.classList.contains("open")) {
    menuBtn.ariaExpanded = true;
    menuBtn.ariaHasPopup = true;
  } else {
    menuBtn.ariaExpanded = false;
    menuBtn.ariaHasPopup = false;
  }
}

async function handleCopy(e) {
  if (e.srcElement.nodeName !== "BUTTON") {
    return;
  }

  const copyBtn = e.target;
  const shortenUrl = copyBtn.parentElement.querySelector("p").textContent;

  try {
    await navigator.clipboard.writeText(shortenUrl);
  } catch (e) {
    console.log(e.message);
  }

  copyBtn.classList.remove("bg-customcyan");
  copyBtn.classList.add("bg-customblack");
  copyBtn.innerHTML = "Copied!";
  setTimeout(() => {
    copyBtn.classList.remove("bg-customblack");
    copyBtn.classList.add("bg-customcyan");
    copyBtn.innerHTML = "Copy";
  }, 4000);
}

linkForm.addEventListener("submit", formSubmit);
menuBtn.addEventListener("click", handleMenuClick);
generatedLinks.addEventListener("click", handleCopy);
