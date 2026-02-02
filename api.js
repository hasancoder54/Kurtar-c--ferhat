async function loadInstagramFeed() {
    // Yeni güncel Behold URL
    const beholdURL = "https://feeds.behold.so/s82aBRMBW75LwWIeaifg"; 
    const galleryContainer = document.getElementById('insta-gallery');

    try {
        const response = await fetch(beholdURL);
        const data = await response.json();

        // Posts dizisinden son 6 içeriği alıyoruz
        const posts = data.posts.slice(0, 6); 

        galleryContainer.innerHTML = posts.map(post => `
            <a href="${post.permalink}" target="_blank" class="group relative overflow-hidden rounded-2xl aspect-square shadow-2xl bg-white/5 border border-white/5">
                <img src="${post.mediaUrl}" alt="Kurtarıcı Ferat Instagram" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <i class="fab fa-instagram text-white text-2xl"></i>
                </div>
            </a>
        `).join('');
    } catch (error) {
        console.error("Instagram verisi yüklenemedi:", error);
        galleryContainer.innerHTML = `
            <p class="text-[8px] text-gray-700 col-span-2 text-center uppercase tracking-widest">
                Akış şu an güncellenemiyor.
            </p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadInstagramFeed);
