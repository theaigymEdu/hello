
    // Initialize EmailJS
    (function(){ emailjs.init("5fFjsmWwmEgEjzfCs"); })();

    const sheetURL =
      "https://docs.google.com/spreadsheets/d/1yAvCYmOZeN-TLKwuBGVvE9CDpEXhBCtKhqZIUDZiReA/gviz/tq?tqx=out:json&sheet=Sheet1";

    let allProjects = [], filteredProjects = [];
    let currentPage = 1, itemsPerPage = 6, currentLanguage = "";

    function convertDriveLinkToDirect(link) {
      if (!link) return "";
      const match = link.match(/[-\w]{25,}/);
      return match ? `https://lh3.googleusercontent.com/d/${match[0]}=w1000` : link;
    }

    async function fetchData() {
      try {
        const res = await fetch(sheetURL);
        const text = await res.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows.map(r => ({
          ID: r.c[1]?.v || "",
          Name: r.c[2]?.v || "",
          Description: r.c[3]?.v || "",
          Language: r.c[4]?.v || "",
          Technologies: r.c[5]?.v || "",

          Gif: r.c[6]?.v || "",
          Image: convertDriveLinkToDirect(r.c[7]?.v || ""),
          Video: r.c[8]?.v || "",
          Cost: r.c[9]?.v || "",
          Discount: r.c[10]?.v || ""
        }));
        allProjects = rows;
        filteredProjects = rows;
        displayProjects();
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    function displayProjects() {
      const container = document.getElementById("projectsContainer");
      container.innerHTML = "";

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginated = filteredProjects.slice(start, end);

      if (paginated.length === 0) {
        container.innerHTML = `<p class="text-center text-muted fs-5">No projects found 😢</p>`;
        document.getElementById("pageInfo").textContent = "";
        return;
      }

// Add CSS for animations and effects
// ====== Custom Styles ======
const style = document.createElement('style');
style.textContent = `
  /* === Tech Badge === */
  .tech-badge {
    background-color: #000 !important;
    color: #fff !important;
    border: none !important;
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
  }

  /* === WhatsApp and Email Buttons === */
  .whatsapp-btn, .email-btn {
    background-color: #f68a0a !important;
    color: #fff !important;
    border: none !important;
    transition: none !important;
    padding: 0.5rem 0.75rem !important;
    height: 38px;
  }

  /* === Remove hover effects completely === */
  .whatsapp-btn:hover,
  .email-btn:hover {
    transform: none !important;
    box-shadow: none !important;
    background-color: #f68a0a !important;
    color: #fff !important;
  }

  /* === Card Animations (keep entry animation only) === */
  .project-card {
    opacity: 0;
    transform: translateX(-50px);
    transition: all 0.6s ease-out;
    cursor: pointer;
    position: relative;
  }

  .project-card.animate-in {
    opacity: 1;
    transform: translateX(0);
  }

  /* === Enhanced Card Hover Effect with Strong Background Shadow === */
  .project-card:hover {
    transform: translateY(-8px) !important;
    box-shadow: 
      0 25px 50px rgba(246, 138, 10, 0.4),
      0 0 0 1px rgba(246, 138, 10, 0.1),
      0 0 30px rgba(246, 138, 10, 0.3) !important;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  }

  /* Optional: Add a subtle glow effect around the card */
  .project-card::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: linear-gradient(45deg, #f68a0a, transparent);
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }

  .project-card:hover::before {
    opacity: 0.3;
  }
`;
document.head.appendChild(style);

// Rest of your existing JavaScript code remains the same...

// Add Font Awesome for icons
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
document.head.appendChild(fontAwesome);

// ====== Card Animation Function ======
function animateCards() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in');
    }, index * 150);
  });
}

// ====== Project Card Rendering ======
paginated.forEach((p, index) => {
  const col = document.createElement("div");
  col.className = "col-md-4";

  // Convert technologies into badges
  const techBadges = p.Technologies
    ? p.Technologies.split(',')
        .map(t => `<span class="badge tech-badge me-2 mb-2">${t.trim()}</span>`)
        .join('')
    : '<span class="badge bg-secondary">N/A</span>';

  col.innerHTML = `
    <div class="card shadow-sm border-0 h-100 project-card" style="transition-delay: ${index * 0.1}s">
      <img src="${p.Image || p.Gif || 'https://via.placeholder.com/300x160?text=Image+Unavailable'}"
           class="card-img-top"
           alt="${p.Name}"
           onerror="this.src='https://via.placeholder.com/300x160?text=Image+Unavailable';" />

      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-dark fw-bold mb-2">${p.Name}</h5>

        <div class="mb-2 d-flex flex-wrap align-items-center">
          ${techBadges}
        </div>

        <div class="card-text small text-muted mb-3 flex-grow-1">
          <strong class="text-dark d-block mb-1">Description:</strong>
          <span class="fw-semibold">${p.Description}</span>
        </div>

        <div class="d-flex gap-2 mt-auto">
          <a href="https://wa.me/919876543210?text=Hi, I'm interested in your project: ${encodeURIComponent(p.Name)}"
             class="btn whatsapp-btn btn-sm flex-fill text-center d-flex align-items-center justify-content-center"
             target="_blank">
             <i class="fab fa-whatsapp me-1"></i> Request Demo
          </a>
          <button class="btn email-btn btn-sm flex-fill d-flex align-items-center justify-content-center" 
                  onclick="openEmailModal('${p.Name}')">
            <i class="fas fa-envelope me-1"></i> Request Demo
          </button>
        </div>
      </div>
    </div>
  `;

  container.appendChild(col);
});

// Animate after render
setTimeout(animateCards, 100);



      document.getElementById("pageInfo").textContent =
        `Page ${currentPage} of ${Math.ceil(filteredProjects.length / itemsPerPage)}`;

      document.getElementById("prevBtn").disabled = currentPage === 1;
      document.getElementById("nextBtn").disabled = end >= filteredProjects.length;
    }

    // 🔍 Search Logic
    document.getElementById("searchBox").addEventListener("input", applyFilters);

    // 🧠 Filter Button Logic
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentLanguage = btn.dataset.lang;
        applyFilters();
      });
    });

    // 🧭 Pagination
    document.getElementById("prevBtn").addEventListener("click", () => {
      if (currentPage > 1) { currentPage--; displayProjects(); }
    });
    document.getElementById("nextBtn").addEventListener("click", () => {
      if (currentPage * itemsPerPage < filteredProjects.length) {
        currentPage++; displayProjects();
      }
    });

    function applyFilters() {
      const search = document.getElementById("searchBox").value.toLowerCase();
      filteredProjects = allProjects.filter(p =>
        (p.Name.toLowerCase().includes(search) || p.Description.toLowerCase().includes(search)) &&
        (!currentLanguage || p.Language === currentLanguage)
      );
      currentPage = 1;
      displayProjects();
    }

    // 📧 Email Modal Logic
    const emailModal = new bootstrap.Modal(document.getElementById("emailModal"));
    let selectedProjectName = "";

    function openEmailModal(projectName) {
      selectedProjectName = projectName;
      document.getElementById("selectedProject").value = projectName;
      emailModal.show();
    }

    document.getElementById("contactForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById("submitBtn");
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Sending...";

      const formData = {
        name: document.getElementById("userName").value,
        phone: document.getElementById("userPhone").value,
        email: document.getElementById("userEmail").value,
      };

      const project = allProjects.find(p => p.Name === selectedProjectName);
      if (!project) {
        alert("Please select a valid project.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
      }

      // Send to Team
      emailjs.send("service_mi80889", "template_hepkq4r", {
        user_name: formData.name,
        user_phone: formData.phone,
        user_email: formData.email,
        project_name: project.Name
      }).catch(err => console.error("Team email failed:", err));

      // Send to User
// Send to User
emailjs.send("service_mi80889", "template_vewvt36", {
  user_name: formData.name,
  user_email: formData.email,
  project_name: project.Name,
  demo_video_link: project.Video || "Demo video not available",
  language: project.Language,
  original_price: project.Cost,
  discount: project.Discount
}).then(() => {
        Swal.fire({
    toast: true,
    position: 'top-end', // top-right corner
    icon: 'success',
    title: `✅ Demo link successfully sent to ${formData.email}`,
    showConfirmButton: false,
    timer: 8000, // visible for 5 seconds
    timerProgressBar: true
  });
        emailModal.hide();
        e.target.reset();
      }).catch(err => {
        console.error("User email failed:", err);
                Swal.fire({
    toast: true,
    position: 'top-end', // top-right corner
    icon: 'failure',
    title: `❌ Problem sending demo link to ${formData.email}`,
    showConfirmButton: false,
    timer: 8000, // visible for 5 seconds
    timerProgressBar: true
  });
      }).finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
    });

    fetchData();
