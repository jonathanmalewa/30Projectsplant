const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === "") {
    alert("Silahkan Tuliskan Sesuatu");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value = "";
  saveData();
}

// event untuk check dan remove list container
listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName == "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      saveData();
    }
  },
  false
);

//save list container ke localstorage browser
function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

// Menampilkan data

function showData() {
  listContainer.innerHTML = localStorage.getItem("data");
}

showData();
