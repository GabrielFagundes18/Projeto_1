const navBar = document.querySelector(".Navbar-icon ");
const navMenu = document.querySelector(".mobile");

navBar.addEventListener("click", () => {
  if (navMenu.style.display === "none" || navMenu.style.display === "") {
    navMenu.style.display = "block";
  } else {
    navMenu.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const sliderWrapper = document.getElementById("sliderWrapper");
  const slides = document.querySelectorAll(".card-avaliacao");
  const prevButton = document.querySelector(".prev-btn");
  const nextButton = document.querySelector(".next-btn");

  let currentIndex = 0;
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  function getSlideWidth() {
    if (mediaQuery.matches) {
      return slides[0].offsetWidth;
    }
    return slides[0].offsetWidth + 20;
  }

  function updateSlider() {
    const width = getSlideWidth();
    const offset = -currentIndex * width;
    sliderWrapper.style.transform = `translateX(${offset}px)`;

    prevButton.style.display = currentIndex === 0 ? "none" : "block";

    let isLastSlide =
      currentIndex >= slides.length - (mediaQuery.matches ? 1 : 3);
    nextButton.style.display = isLastSlide ? "none" : "block";
  }

  function nextSlide() {
    const maxIndex = slides.length - (mediaQuery.matches ? 1 : 3);
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlider();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  }

  nextButton.addEventListener("click", nextSlide);
  prevButton.addEventListener("click", prevSlide);

  updateSlider();
  window.addEventListener("resize", () => {
    currentIndex = 0;
    updateSlider();
  });
});




const form = document.querySelector("form-contato");
const emailInput = document.getElementById("email");
const replyToInput = document.getElementById("reply_to_email");
const feedbackDiv = document.getElementById("feedback");

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  replyToInput.value = emailInput.value;

  const nome = document.getElementById("nome").value.trim();
  const motivo = document.getElementById("motivo").value;
  const mensagem = document.getElementById("mensagem").value.trim();
  const email = emailInput.value.trim();

  let isValid = true;
  let errorMessage = "";

  if (!nome || motivo === "" || !mensagem || !email) {
    isValid = false;
    errorMessage = "❌ Por favor, preencha todos os campos obrigatórios.";
  } else if (!validateEmail(email)) {
    isValid = false;
    errorMessage = "❌ O formato do e-mail parece incorreto. Verifique!";
  } else if (mensagem.length < 10) {
    isValid = false;
    errorMessage = "❌ Sua mensagem precisa de pelo menos 10 caracteres.";
  }

  if (!isValid) {
    feedbackDiv.className = "mensagem-feedback erro visible";
    feedbackDiv.innerHTML = errorMessage;

    setTimeout(() => {
      feedbackDiv.className = "mensagem-feedback";
    }, 5000);

    return;
  }

  feedbackDiv.className = "mensagem-feedback sucesso visible";
  feedbackDiv.innerHTML = "✅ Validado! Enviando sua mensagem...";

  const data = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: data,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        feedbackDiv.className = "mensagem-feedback sucesso visible";
        feedbackDiv.innerHTML =
          "🎉 Mensagem enviada com sucesso! Em breve entraremos em contato.";
        form.reset();
      } else {
        response.json().then((data) => {
          if (Object.hasOwn(data, "errors")) {
            errorMessage = data["errors"]
              .map((error) => error["message"])
              .join(", ");
          } else {
            errorMessage = "Ocorreu um erro no envio. Tente novamente.";
          }
          feedbackDiv.className = "mensagem-feedback erro visible";
          feedbackDiv.innerHTML = "❌ Erro ao enviar: " + errorMessage;
        });
      }
    })
    .catch((error) => {
      feedbackDiv.className = "mensagem-feedback erro visible";
      feedbackDiv.innerHTML =
        "❌ Erro de conexão. Verifique sua rede e tente novamente.";
    })
    .finally(() => {
      setTimeout(() => {
        feedbackDiv.className = "mensagem-feedback";
      }, 5000);
    });
});

const checkoutAlert = document.getElementById("checkoutAlert");

