async function loadInstagramFeed() {
    const beholdURL = "https://feeds.behold.so/s82aBRMBW75LwWIeaifg"; 
    const galleryContainer = document.getElementById('insta-gallery');

    try {
        const response = await fetch(beholdURL);
        const data = await response.json();

        // Tüm postları alıyoruz (Sınırı kaldırdım)
        const posts = data.posts; 

        galleryContainer.innerHTML = posts.map(post => {
            // Video ise kapak resmini, resim ise direkt mediaUrl'yi kullanıyoruz
            const displayImage = post.thumbnailUrl || post.mediaUrl;

            return `
                <a href="${post.permalink}" target="_blank" class="group relative overflow-hidden rounded-2xl aspect-square shadow-2xl bg-gradient-to-br from-green-900/20 to-black border border-white/5">
                    <img src="${displayImage}" 
                         alt="Kurtarıcı Ferat Instagram" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         onerror="this.style.display='none'"> 
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <i class="fab fa-instagram text-white text-2xl"></i>
                    </div>
                    ${post.mediaType === 'VIDEO' ? '<div class="absolute top-2 right-2 text-white/70 text-[10px]"><i class="fas fa-play"></i></div>' : ''}
                </a>
            `;
        }).join('');
    } catch (error) {
        console.error("Instagram verisi yüklenemedi:", error);
        galleryContainer.innerHTML = `<p class="text-[8px] text-gray-700 col-span-2 text-center uppercase tracking-widest">Akış şu an güncellenemiyor.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadInstagramFeed);
