// Menunggu seluruh elemen HTML dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {

    // === Mengambil Elemen-elemen Penting dari DOM ===
    const loginPage = document.getElementById('login-page');
    const mainApp = document.getElementById('main-app');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const logoutButton = document.getElementById('logout-button');
    const pageContentContainer = document.getElementById('page-content-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // === Konten untuk Setiap Halaman ===
    const pages = {
        beranda: `
            <div class="bg-white p-8 rounded-lg shadow-md animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-900 mb-4">Selamat Datang di Beranda</h1>
                <p class="text-gray-700">Ini adalah halaman utama website Anda. Anda dapat menampilkan ringkasan tentang perusahaan, produk unggulan, atau berita terbaru di sini.</p>
            </div>
        `,
        tentang: `
            <div class="bg-white p-8 rounded-lg shadow-md animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-900 mb-4">Tentang Kami</h1>
                <p class="text-gray-700">Kami adalah perusahaan yang berdedikasi untuk memberikan solusi terbaik bagi pelanggan kami. Sejak didirikan pada tahun 2024, kami telah berkomitmen pada kualitas dan inovasi.</p>
                <p class="text-gray-700 mt-2">Visi kami adalah menjadi pemimpin di industri ini, dan misi kami adalah melayani dengan integritas.</p>
            </div>
        `,
        servis: `
            <div class="bg-white p-8 rounded-lg shadow-md animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-900 mb-4">Layanan Kami</h1>
                <p class="text-gray-700">Berikut adalah beberapa layanan yang kami tawarkan:</p>
                <ul class="list-disc list-inside mt-4 text-gray-700">
                    <li>Pengembangan Web</li>
                    <li>Desain Grafis</li>
                    <li>Konsultasi Digital Marketing</li>
                    <li>Manajemen Media Sosial</li>
                </ul>
            </div>
            <div class="mt-8 bg-white p-8 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">✨ Dapatkan Ide Proyek dengan AI</h2>
                <p class="text-gray-600 mb-4">Punya ide bisnis tapi bingung mulai dari mana? Jelaskan singkat ide Anda di bawah ini, dan biarkan AI kami memberikan rekomendasi layanan yang cocok serta slogan yang menarik!</p>
                <div>
                    <label for="business-description" class="sr-only">Deskripsi Bisnis Anda</label>
                    <textarea id="business-description" rows="4" class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Contoh: Saya ingin membuka kedai kopi modern untuk anak muda di Bandung..."></textarea>
                </div>
                <div class="mt-4">
                    <button id="generate-idea-button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Hasilkan Ide
                    </button>
                </div>
                <div id="idea-result" class="mt-6">
                    </div>
            </div>
        `,
        kontak: `
            <div class="bg-white p-8 rounded-lg shadow-md animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
                <p class="text-gray-700">Jangan ragu untuk menghubungi kami melalui informasi di bawah ini:</p>
                <ul class="mt-4 space-y-2 text-gray-700">
                    <li><strong>Email:</strong> kontak@perusahaananda.com</li>
                    <li><strong>Telepon:</strong> (021) 123-4567</li>
                    <li><strong>Alamat:</strong> Jl. Merdeka No. 1, Jakarta, Indonesia</li>
                </ul>
            </div>
        `
    };

    // === Fungsi untuk Menampilkan Halaman Tertentu ===
    function showPage(pageName) {
        if (pages[pageName]) {
            pageContentContainer.innerHTML = pages[pageName];
            navLinks.forEach(link => {
                link.classList.remove('nav-link-active');
                if (link.dataset.page === pageName) {
                    link.classList.add('nav-link-active');
                }
            });
            mobileMenu.classList.add('hidden');
        }
    }
    
    // === Fungsi untuk memanggil Gemini API ===
    async function generateProjectIdea() {
        const ideaResultDiv = document.getElementById('idea-result');
        const businessDescription = document.getElementById('business-description').value;

        if (!businessDescription.trim()) {
            ideaResultDiv.innerHTML = '<p class="text-red-500">Mohon isi deskripsi bisnis Anda terlebih dahulu.</p>';
            return;
        }

        // Tampilkan loading spinner
        ideaResultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center p-6">
                <div class="spinner"></div>
                <p class="mt-4 text-gray-600">AI sedang berpikir...</p>
            </div>
        `;

        const prompt = `
            Anda adalah seorang konsultan bisnis dan marketing yang sangat kreatif dan membantu.
            Seorang klien potensial memberikan deskripsi bisnis berikut: "${businessDescription}".

            Daftar layanan yang kami tawarkan adalah:
            - Pengembangan Web
            - Desain Grafis
            - Konsultasi Digital Marketing
            - Manajemen Media Sosial

            Berdasarkan deskripsi klien, berikan rekomendasi dalam format HTML. Buatlah respons yang terstruktur dan menarik.
            Struktur respons harus sebagai berikut:
            1.  Gunakan tag <h3> dengan judul "Rekomendasi Layanan untuk Anda".
            2.  Buat unordered list (<ul>) untuk setiap layanan yang relevan.
            3.  Untuk setiap item list (<li>), sebutkan nama layanan dengan tag <strong>, diikuti dengan penjelasan singkat mengapa layanan itu penting untuk bisnis klien.
            4.  Setelah daftar layanan, gunakan tag <h3> dengan judul "Contoh Slogan Marketing".
            5.  Buat paragraf (<p>) yang berisi satu slogan yang menarik, singkat, dan mudah diingat yang sesuai dengan deskripsi bisnis klien.
        `;
        
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = ""; // API key tidak diperlukan saat menggunakan model ini di lingkungan ini
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0) {
                const generatedHtml = result.candidates[0].content.parts[0].text;
                ideaResultDiv.innerHTML = `<div class="p-4 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg">${generatedHtml}</div>`;
            } else {
                throw new Error("Respons dari API tidak valid.");
            }

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            ideaResultDiv.innerHTML = '<p class="text-red-500">Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi nanti.</p>';
        }
    }

    // === Event Delegation untuk tombol Generate Idea ===
    pageContentContainer.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'generate-idea-button') {
            event.preventDefault();
            generateProjectIdea();
        }
    });

    // === Logika untuk Proses Login ===
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (username === 'admin' && password === 'password') {
            loginPage.classList.add('hidden'); 
            mainApp.classList.remove('hidden'); 
            errorMessage.classList.add('hidden');
            showPage('beranda'); 
        } else {
            errorMessage.classList.remove('hidden');
        }
    });

    // === Logika untuk Proses Logout ===
    logoutButton.addEventListener('click', () => {
        mainApp.classList.add('hidden');
        loginPage.classList.remove('hidden');
        usernameInput.value = '';
        passwordInput.value = '';
    });
    
    // === Logika untuk Navigasi Halaman ===
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageName = event.target.dataset.page;
            showPage(pageName);
        });
    });

    // === Logika untuk Mobile Menu (Burger Menu) ===
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
});