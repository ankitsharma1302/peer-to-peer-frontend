// ======= PAGE SWITCHING =======
const sections = document.querySelectorAll("section");
const showSection = (id) => {
  sections.forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Navigation buttons
document.getElementById("login-btn").onclick = () => showSection("login-page");
document.getElementById("signin").onclick = () => showSection("dashboard");
document.getElementById("goto-signup").onclick = () => showSection("signup-page");
document.getElementById("create-account").onclick = () => showSection("dashboard");
document.getElementById("upload-section").onclick = () => showSection("upload-page");
document.getElementById("download-section").onclick = () => showSection("download-options");

// 🟢 FIXED: Subject Notes & Question Paper Separate
document.getElementById("subject-notes").onclick = () => {
  document.getElementById("question-paper-list").classList.remove("active");
  document.getElementById("qp-container").innerHTML = "";
  showSection("subject-notes-list");
};

document.getElementById("question-paper").onclick = () => {
  document.getElementById("subject-notes-list").classList.remove("active");
  document.getElementById("notes-container").innerHTML = "";
  showSection("question-paper-list");
};

document.getElementById("logout-btn").onclick = () => {
  alert("You have been logged out successfully!");
  showSection("landing-page");
};

// Back buttons
document.querySelectorAll(".back-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const current = document.querySelector("section.active").id;
    if (["login-page", "signup-page"].includes(current)) showSection("landing-page");
    else if (["upload-page", "download-options"].includes(current)) showSection("dashboard");
    else if (["subject-notes-list", "question-paper-list"].includes(current))
      showSection("download-options");
  });
});

// ======= SUBJECT DATA =======
const subjects = {
  "BCA": {
    "1": ["Computer Fundamental & Problem Solving Techniques", "C Programming", "Principle of Management", "Business Communication", "Mathematics-I"],
    "2": ["Object Oriented Programming Using C++", "Internet Technology and Web Design", "Organization Behaviour", "Financial Accounting & Management", "Mathematics-II"],
    "3": ["Python Programming", "Data Structure Using C & C++", "Operating System", "Digital Electronics & Computer Organization", "Elements of Statistics"],
    "4": ["Computer Graphics & Animation", "Database Management System", "Software Engineering", "Optimization Techniques", "Mathematics-III"],
    "5": ["Knowledge Management", "Java Programming and Dynamic Webpage Design", "Computer Network", "Numerical Methods"],
    "6": ["Information & Cyber Security", "Internet of Things", "E-Commerce", "Data Science and Machine Learning"]
  },
  "BBA": {
    "1": ["A.Business Economics", "B.Basic Accounting", "A.Business Statistics", "B.Principles of Management", "A.Basic Ethics and Governance", "B:Computer Applications"],
    "2": ["A.Organisational Behavior", "B.Marketing Theory and Practices", "A.Business Mathematics", "B.Advertising Management"],
    "3": ["A.Management & Cost Accounting", "B.Business Law", "A.Production Management", "B.Business Policy", "A.Business Communication", "B.Business Environment"],
    "4": ["A.Supply Chain Management", "B.Research Methodology", "A.Specialised Accounting", "B.Consumer Behaviour", "A.Investment Analysis & Portfolio Management", "B.Company Law"],
    "5": ["A.Income Tax", "B.Marketing Communication", "A.Entrepreneurship & Small Business Management", "B.Sales Management", "A.Industrial Relations & Labour Laws", "B.Company Accounts"],
    "6": ["A.Project Management", "B.Goods & Service Tax", "A.Auditing", "B.International Trade", "A.Strategic Management", "B.Training and Development"]
  }
};

// ======= UPLOAD SECTION =======
const uploadCourse = document.getElementById("upload-course");
const uploadSubject = document.getElementById("upload-subject");
const uploadButton = document.getElementById("submit-upload");
const uploadStatus = document.getElementById("upload-status");

uploadCourse.addEventListener("change", () => {
  const course = uploadCourse.value;
  uploadSubject.innerHTML = `<option selected disabled>Select Subject</option>`;
  if (subjects[course]) {
    const allSubjects = Object.values(subjects[course]).flat();
    allSubjects.forEach(sub => {
      const opt = document.createElement("option");
      opt.textContent = sub;
      uploadSubject.appendChild(opt);
    });
  }
});

uploadButton.addEventListener("click", () => {
  const course = uploadCourse.value;
  const subject = uploadSubject.value;
  const title = document.getElementById("file-title").value;
  const file = document.getElementById("file-input").value;

  if (!course || !subject || !title || !file) {
    uploadStatus.textContent = "⚠️ Please fill all fields before uploading.";
    uploadStatus.style.color = "yellow";
    return;
  }

  uploadStatus.textContent = "✅ File uploaded successfully!";
  uploadStatus.style.color = "lightgreen";

  document.getElementById("file-title").value = "";
  document.getElementById("file-input").value = "";
  uploadCourse.selectedIndex = 0;
  uploadSubject.innerHTML = `<option selected disabled>Select Subject</option>`;
});

// ======= SUBJECT NOTES SECTION (FIXED UNIT LINKS) =======
document.getElementById("notes-submit").addEventListener("click", () => {
  const course = document.getElementById("notes-course").value;
  const sem = document.getElementById("notes-semester").value;
  const container = document.getElementById("notes-container");
  container.innerHTML = "";

  if (!course || !sem) return;

  subjects[course][sem].forEach(sub => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3 class="subject-name">${sub}</h3>
      <div class="unit-container" style="display:none; margin-top:10px;">
        <a href="#">Download Notes - Unit 1</a><br>
        <a href="#">Download Notes - Unit 2</a><br>
        <a href="#">Download Notes - Unit 3</a><br>
        <a href="#">Download Notes - Unit 4</a><br>
        <a href="#">Download Notes - Unit 5</a>
      </div>`;
    container.appendChild(card);
  });

  document.querySelectorAll(".subject-name").forEach(name => {
    name.addEventListener("click", () => {
      const unitDiv = name.nextElementSibling;
      unitDiv.style.display = unitDiv.style.display === "none" ? "block" : "none";
    });
  });
});

// ======= QUESTION PAPER SECTION =======
document.getElementById("qp-submit").addEventListener("click", () => {
  const course = document.getElementById("qp-course").value;
  const sem = document.getElementById("qp-semester").value;
  const container = document.getElementById("qp-container");
  container.innerHTML = "";

  if (!course || !sem) return;

  subjects[course][sem].forEach(sub => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${sub}</h3>
      <a href="#">Download Question Paper</a>`;
    container.appendChild(card);
  });
});

document.getElementById("signin").onclick = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (response.ok) {
    alert("✅ Login successful!");
    showSection("dashboard");
  } else {
    alert("❌ " + data.message);
  }
};

document.getElementById("create-account").onclick = async () => {
  const course = document.querySelector("select:nth-of-type(1)").value;
  const semester = document.querySelector("select:nth-of-type(2)").value;
  
  const user = {
    firstName: document.querySelector("input[placeholder='First Name']").value,
    middleName: document.querySelector("input[placeholder='Middle Name']").value,
    lastName: document.querySelector("input[placeholder='Last Name']").value,
    rollNumber: document.querySelector("input[placeholder='Roll Number']").value,
    course,
    semester
  };

  const response = await fetch("http://localhost:5000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  const data = await response.json();
  if (response.ok) {
    alert("✅ Account created!");
    showSection("dashboard");
  } else {
    alert("❌ " + data.message);
  }
};

document.getElementById("submit-upload").addEventListener("click", async () => {
  const course = document.getElementById("upload-course").value;
  const subject = document.getElementById("upload-subject").value;
  const title = document.getElementById("file-title").value;
  const fileInput = document.getElementById("file-input");

  if (!course || !subject || !title || !fileInput.files.length) {
    alert("⚠️ Fill all fields before upload!");
    return;
  }

  const formData = new FormData();
  formData.append("course", course);
  formData.append("subject", subject);
  formData.append("title", title);
  formData.append("file", fileInput.files[0]);

  const response = await fetch("http://localhost:5000/api/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  if (response.ok) {
    alert("✅ File uploaded successfully!");
  } else {
    alert("❌ Upload failed: " + data.message);
  }
});

document.getElementById("notes-submit").addEventListener("click", async () => {
  const course = document.getElementById("notes-course").value;
  const sem = document.getElementById("notes-semester").value;
  const container = document.getElementById("notes-container");
  container.innerHTML = "";

  const response = await fetch(`http://localhost:5000/api/notes?course=${course}&semester=${sem}`);
  const notes = await response.json();

  notes.forEach(sub => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${sub.subject}</h3>
      <a href="${sub.downloadLink}" target="_blank">Download Notes</a>
    `;
    container.appendChild(card);
  });
});




