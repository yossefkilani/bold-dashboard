document.addEventListener("DOMContentLoaded", function () {

  /* ======================
     ELEMENTS
  ====================== */

  const form = document.getElementById("boldForm");
  const steps = Array.from(document.querySelectorAll(".brief-step"));
  const progressBar = document.getElementById("progressBar");

  const cards = document.querySelectorAll(".card");
  const serviceInput = document.getElementById("serviceInput");
  const otherField = document.getElementById("otherField");
  const otherInput = document.getElementById("otherInput");

  const fileBtn = document.getElementById("fileBtn");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");

  const backBtn = document.getElementById("backBtn");

  const addLinkBtn = document.getElementById("addLinkBtn");
  const linkInput = document.getElementById("linkInput");
  const linksList = document.getElementById("linksList");

  const langBtn = document.getElementById("langBtn");

  let index = 0;
  let isArabic = false;

  /* ======================
     LANGUAGE SWITCH
  ====================== */

  function setLang(ar) {

    // الاتجاه + اللغة
    document.documentElement.setAttribute("dir", ar ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", ar ? "ar" : "en");

    // 👇 هذا المهم لتفعيل الخط
    document.documentElement.classList.toggle("lang-ar", ar);

    const headlines = document.querySelectorAll(".headline");
    const cardsTitles = document.querySelectorAll(".card h3");
    const nextBtns = document.querySelectorAll(".next");

    if (ar) {

      if (headlines[0]) headlines[0].textContent = "اختر الخدمة";
      if (headlines[1]) headlines[1].textContent = "بياناتك";
      if (headlines[2]) headlines[2].textContent = "تفاصيل المشروع";
      if (headlines[3]) headlines[3].textContent = "شكراً لك";

      if (cardsTitles[0]) cardsTitles[0].textContent = "الهوية البصرية";
      if (cardsTitles[1]) cardsTitles[1].textContent = "إعادة تصميم";
      if (cardsTitles[2]) cardsTitles[2].textContent = "تغليف";
      if (cardsTitles[3]) cardsTitles[3].textContent = "أخرى";

      nextBtns.forEach(btn => btn.textContent = "التالي");

      updateLabel('full_name', "الاسم الكامل *");
      updateLabel('email', "البريد الإلكتروني *");
      updateLabel('phone', "الهاتف / واتساب *");
      updateLabel('location', "الدولة / المدينة");
      updateLabel('industry', "مجال المشروع");
      updateLabel('brand_name', "اسم المشروع");
      updateLabel('business_description', "عن مشروعك");

      const linksLabel = document.getElementById("linksLabel");
      if (linksLabel) linksLabel.textContent = "روابط مرجعية";

      if (linkInput) linkInput.placeholder = "ألصق الرابط هنا";

      const submitBtn = document.querySelector(".submit");
      if (submitBtn) submitBtn.textContent = "إرسال";

      const subtitle = document.querySelector(".subtitle");
      if (subtitle)
        subtitle.textContent = "سنقوم بمراجعة طلبك والتواصل معك قريباً.";

      if (langBtn) langBtn.textContent = "English";

    } else {

      if (headlines[0]) headlines[0].textContent = "Select Service";
      if (headlines[1]) headlines[1].textContent = "Your Details";
      if (headlines[2]) headlines[2].textContent = "Project Details";
      if (headlines[3]) headlines[3].textContent = "Thank You";

      if (cardsTitles[0]) cardsTitles[0].textContent = "Branding";
      if (cardsTitles[1]) cardsTitles[1].textContent = "Rebranding";
      if (cardsTitles[2]) cardsTitles[2].textContent = "Packaging";
      if (cardsTitles[3]) cardsTitles[3].textContent = "Other";

      nextBtns.forEach(btn => btn.textContent = "Continue");

      updateLabel('full_name', "Full Name *");
      updateLabel('email', "Email Address *");
      updateLabel('phone', "Phone / WhatsApp *");
      updateLabel('location', "Country / City");
      updateLabel('industry', "industry");
      updateLabel('brand_name', "Brand / Project Name");
      updateLabel('business_description', "About Your Project");

      const linksLabel = document.getElementById("linksLabel");
      if (linksLabel) linksLabel.textContent = "Reference Links";

      if (linkInput) linkInput.placeholder = "Paste link here";

      const submitBtn = document.querySelector(".submit");
      if (submitBtn) submitBtn.textContent = "Submit";

      const subtitle = document.querySelector(".subtitle");
      if (subtitle)
        subtitle.textContent =
          "We will review your project and contact you shortly.";

      if (langBtn) langBtn.textContent = "Arabic";
    }
  }

  function updateLabel(name, text) {
    const input = document.querySelector(`[name="${name}"]`);
    if (input && input.previousElementSibling)
      input.previousElementSibling.textContent = text;
  }

  // زر اللغة
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      isArabic = !isArabic;
      setLang(isArabic);
    });
  }

  // 👇 مهم جداً: تطبيق اللغة الافتراضية عند التحميل
  setLang(false);

  /* ======================
     STEP CONTROL
  ====================== */

  function showStep(i) {
    steps.forEach(step => step.classList.remove("active"));
    if (steps[i]) steps[i].classList.add("active");

    index = i;

    if (progressBar) {
      const percent = ((index + 1) / steps.length) * 100;
      progressBar.style.width = percent + "%";
    }

    const isLast = index === steps.length - 1;

    // اخفاء العناصر في اخر خطوة
    const topbar = document.querySelector(".form-topbar");
    const progressWrap = document.querySelector(".progress-wrap");

    if (topbar) topbar.style.display = isLast ? "none" : "flex";
    if (progressWrap) progressWrap.style.display = isLast ? "none" : "block";
  }

  function validate() {
    const currentStep = steps[index];
    if (!currentStep) return true;

    const requiredFields = currentStep.querySelectorAll("[required]");

    for (let field of requiredFields) {
      if (!field.value.trim()) {
        field.focus();
        return false;
      }
    }

    if (index === 0) {
      if (!serviceInput.value) return false;
      if (serviceInput.value === "Other" && !otherInput.value.trim()) {
        otherInput.focus();
        return false;
      }
    }

    return true;
  }

  document.addEventListener("click", function (e) {
    const nextBtn = e.target.closest(".next");
    if (!nextBtn) return;

    e.preventDefault();
    if (!validate()) return;

    if (index < steps.length - 1) {
      showStep(index + 1);
    }
  });

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      if (index > 0) showStep(index - 1);
    });
  }

  /* ======================
     SERVICE CARDS
  ====================== */

  cards.forEach(function (card) {
    card.addEventListener("click", function () {

      cards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      const value = card.dataset.value || "";
      serviceInput.value = value;

      if (value === "Other") {
        otherField.classList.remove("hidden");
        otherInput.focus();
      } else {
        otherField.classList.add("hidden");
        otherInput.value = "";
      }
    });
  });

  /* ======================
     LINKS
  ====================== */

  if (addLinkBtn && linkInput && linksList) {

    addLinkBtn.addEventListener("click", function () {

      const value = linkInput.value.trim();
      if (!value) return;

      const wrapper = document.createElement("div");
      wrapper.className = "link-item";

      const link = document.createElement("a");
      link.href = value;
      link.target = "_blank";
      link.textContent = value;

      const remove = document.createElement("span");
      remove.textContent = "×";
      remove.className = "remove-link";

      const hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "links";
      hidden.value = value;

      remove.addEventListener("click", function () {
        wrapper.remove();
        hidden.remove();
      });

      wrapper.appendChild(link);
      wrapper.appendChild(remove);
      linksList.appendChild(wrapper);
      form.appendChild(hidden);

      linkInput.value = "";
    });
  }

  /* ======================
     FILE UPLOAD
  ====================== */

  if (fileBtn && fileInput && fileList) {

    fileBtn.addEventListener("click", function (e) {
      e.preventDefault();
      fileInput.click();
    });

    fileInput.addEventListener("change", function () {

      fileList.innerHTML = "";

      Array.from(fileInput.files || []).forEach(function (file) {

        const wrapper = document.createElement("div");
        wrapper.className = "file-item";

        if (file.type.startsWith("image/")) {
          const img = document.createElement("img");
          img.src = URL.createObjectURL(file);
          img.className = "file-thumb";
          wrapper.appendChild(img);
        }

        const name = document.createElement("div");
        name.textContent = file.name;

        wrapper.appendChild(name);
        fileList.appendChild(wrapper);
      });
    });
  }

  /* ======================
     SUBMIT
  ====================== */

  if (form) {
    form.addEventListener("submit", async function (e) {

      e.preventDefault();
      if (!validate()) return;

      const formData = new FormData(form);

      
      formData.append("project_name", formData.get("brand_name") || "");
      formData.append("project_description", formData.get("business_description") || "");
      formData.append("service", serviceInput.value);

      if (otherInput.value.trim() !== "") {
        formData.append("other_service", otherInput.value.trim());
      }

      try {
        const res = await fetch("/api/submissions", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          alert("Server error");
          return;
        }

        showStep(steps.length - 1);

      } catch (err) {
        alert("Connection error");
      }
    });
  }

  if (steps.length) showStep(0);

});