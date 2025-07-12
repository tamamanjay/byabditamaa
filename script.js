document.addEventListener("DOMContentLoaded", () => {
  // Ambil semua elemen yang dibutuhkan
  const noBtn = document.getElementById("no-btn");
  const yesBtn = document.getElementById("yes-btn");
  const questionContainer = document.getElementById("question-container");
  const thanksContainer = document.getElementById("thanks-container");
  const flowerContainer = document.getElementById("flower-container");
  const buttonContainer = document.querySelector(".buttons");

  let originalNoBtnLeft, originalNoBtnTop;

  // Fungsi untuk mengatur dan menyimpan posisi awal tombol 'Tidak'
  function setInitialNoButtonPosition() {
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const buttonContainerRect = buttonContainer.getBoundingClientRect();

    // Hitung posisi 'kiri' untuk tombol 'Tidak' agar berada di samping kanan tombol 'Iya'
    originalNoBtnLeft = yesBtnRect.right - buttonContainerRect.left + 20; // 20 adalah gap
    originalNoBtnTop = yesBtnRect.top - buttonContainerRect.top;

    noBtn.style.left = `${originalNoBtnLeft}px`;
    noBtn.style.top = `${originalNoBtnTop}px`;
  }

  // Panggil fungsi saat halaman dimuat dan saat ukuran window berubah
  // Diberi sedikit delay agar layout stabil
  setTimeout(() => {
    setInitialNoButtonPosition();
    window.addEventListener("resize", setInitialNoButtonPosition);
  }, 100);

  // Fungsi untuk membuat tombol 'Tidak' lari
  const moveButton = () => {
    const containerRect = document.body.getBoundingClientRect();
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    // Batas maksimal agar tombol tidak keluar layar
    const maxX = containerRect.width - btnWidth;
    const maxY = containerRect.height - btnHeight;

    // Posisi acak baru
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
  };

  // Fungsi untuk mengembalikan tombol 'Tidak' ke posisi semula
  const returnButton = () => {
    noBtn.style.left = `${originalNoBtnLeft}px`;
    noBtn.style.top = `${originalNoBtnTop}px`;
  };

  // Panggil fungsi 'moveButton' saat kursor mendekat
  noBtn.addEventListener("mouseover", moveButton);
  // Kembalikan tombol saat kursor menjauh
  noBtn.addEventListener("mouseout", returnButton);
  // Buat tombol lari juga saat diklik untuk mencegah sentuhan di mobile
  noBtn.addEventListener("click", moveButton);

  // Fungsi saat tombol 'Iya' diklik
  yesBtn.addEventListener("click", () => {
    // Sembunyikan halaman pertanyaan dengan animasi fade out
    gsap.to(questionContainer, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        questionContainer.classList.add("hidden");
      },
    });

    // Tampilkan halaman terima kasih
    thanksContainer.classList.remove("hidden");
    thanksContainer.style.display = "flex";
    gsap.from(thanksContainer, { opacity: 0, duration: 1, delay: 0.5 });

    // Mulai animasi bunga dan kunang-kunang (hanya sekali)
    createFlowerGarden();
    createFireflies();
  });

  // Fungsi untuk membuat satu bunga tulip
  function createTulip(xPosition, delay, scale, height, skew) {
    const tulip = document.createElement("div");
    tulip.className = "tulip";

    tulip.innerHTML = `
            <div class="tulip-body" style="height: ${height}px;">
                <div class="stem" style="--skew-amount: ${skew}deg"></div>
                <div class="leaf left"></div>
                <div class="leaf right"></div>
                <div class="flower">
                    <div class="petal petal-1"></div>
                    <div class="petal petal-2"></div>
                    <div class="petal petal-3"></div>
                </div>
            </div>
        `;
    flowerContainer.appendChild(tulip);

    // Atur posisi dan skala awal menggunakan GSAP
    gsap.set(tulip, {
      left: xPosition,
      scale: scale,
    });

    // Animasikan bunga muncul dari bawah (tumbuh)
    gsap.to(tulip, {
      bottom: gsap.utils.random(-50, 20), // Variasi posisi akhir
      duration: gsap.utils.random(3, 5),
      delay: delay,
      ease: "power2.out",
    });

    // Animasikan kelopak mekar dengan lebih dramatis
    gsap.to(tulip.querySelector(".petal-1"), {
      rotate: -35,
      duration: 2.5,
      delay: delay + 1.5,
      ease: "elastic.out(1, 0.5)",
    });
    gsap.to(tulip.querySelector(".petal-2"), {
      rotate: 35,
      duration: 2.5,
      delay: delay + 1.5,
      ease: "elastic.out(1, 0.5)",
    });
  }

  // Fungsi untuk menciptakan taman bunga dalam formasi V yang rimbun
  function createFlowerGarden() {
    const flowerCount = 10; // Jumlah bunga sesuai permintaan
    const centerX = window.innerWidth / 2;
    const spread = window.innerWidth * 0.8; // Lebar sebaran bunga

    for (let i = 0; i < flowerCount; i++) {
      const progress = i / (flowerCount - 1);
      const x =
        centerX + (progress - 0.5) * spread + gsap.utils.random(-40, 40);

      // Bunga di tengah lebih dekat (besar), di pinggir lebih jauh (kecil)
      const distanceFromCenter = Math.abs(progress - 0.5);
      const scale = gsap.utils.mapRange(0, 0.5, 1.3, 0.8, distanceFromCenter);
      const height = gsap.utils.mapRange(0, 0.5, 400, 250, distanceFromCenter);

      // Bunga yang lebih jauh dari tengah, muncul sedikit lebih lambat
      const delay = distanceFromCenter * 0.4 + Math.random() * 0.5;
      const skew = gsap.utils.random(-8, 8);

      createTulip(x, delay, scale, height, skew);
    }
  }

  // FUNGSI KUNANG-KUNANG SUDAH DIPERBARUI
  function createFireflies() {
    const fireflyCount = 30;
    for (let i = 0; i < fireflyCount; i++) {
      const firefly = document.createElement("div");
      firefly.className = "firefly";

      // Langsung atur posisi awal kunang-kunang di seluruh layar
      firefly.style.left = `${Math.random() * 100}vw`;
      firefly.style.top = `${Math.random() * 100}vh`;

      // Variabel untuk animasi sekarang adalah pergerakan kecil (flutter effect)
      firefly.style.setProperty("--tx1", `${gsap.utils.random(-50, 50)}px`);
      firefly.style.setProperty("--ty1", `${gsap.utils.random(-50, 50)}px`);
      firefly.style.setProperty("--tx2", `${gsap.utils.random(-50, 50)}px`);
      firefly.style.setProperty("--ty2", `${gsap.utils.random(-50, 50)}px`);

      firefly.style.animationDelay = `${Math.random() * 15}s`;
      firefly.style.animationDuration = `${gsap.utils.random(12, 22)}s`;

      thanksContainer.appendChild(firefly);
    }
  }
});
