"use strict";

import "./style.css";

const input = document.getElementById("link-input");
const linkForm = document.getElementById("link-form");
const errMsg = document.getElementById("err-msg");
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

async function shortenUrl(longUrl) {
  // const encodedUrl = encodeURIComponent(longUrl);

  // 2. Define the API endpoint URL
  const apiUrl = "https://cleanuri.com/api/v1/shorten";

  // 3. Prepare the data object with the encoded long URL
  const data = { url: longUrl };
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(data), // Convert data object to JSON string
      headers: { "Content-Type": "application/json" }, // Set content type
      mode: "no-cors",
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const responseJson = await response.json();

    return responseJson.result.short_url; // Extract the shortened URL from the response
  } catch (error) {
    console.error("Error shortening URL:", error);
    return null; // Handle errors gracefully, like returning null
  }
}

function formSubmit(e) {
  e.preventDefault();

  if (input.value === "") {
    errMsg.innerHTML = "Please enter something";
    input.classList.add("border-red");
  } else if (!isValidUrl(input.value)) {
    errMsg.innerHTML = "Please enter a valid URL";
    input.classList.add("border-red");
  } else {
    const longUrl = input.value;
    shortenUrl(longUrl).then((shortUrl) => {
      if (shortUrl) {
        console.log("Shortened URL:", shortUrl);
      }
    });
    errMsg.innerHTML = "";
    input.classList.remove("border-red");
  }
}

function handleMenuClick(e) {
  menuBtn.classList.toggle("open");
  menu.classList.toggle("flex");
  menu.classList.toggle("hidden");
}

linkForm.addEventListener("submit", formSubmit);
menuBtn.addEventListener("click", handleMenuClick);
