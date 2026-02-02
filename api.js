async function loadInstagramFeed() {
    const rssURL = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Frss.app%2Ffeeds%2FDHAgJ1Qebipk3EdD.xml"; 
    const galleryContainer = document.getElementById('insta-gallery');

    try {
        const response = await fetch(rssURL);
        const data = await response.json();

        if (data.status === 'ok') {
            // FİLTRELEME: Başlığında veya linkinde "rss.app" geçenleri siler
            const posts = data.items.filter(item => {
                const isAds = item.title.toLowerCase().includes("rss.app") || 
                              item.link.toLowerCase().includes("rss.app") ||
                              item.description.toLowerCase().includes("rss.app");
                return !isAds; // Reklam değilse geçsin
            });

            galleryContainer.innerHTML = posts.map(post => {
                let imgSrc = post.thumbnail;
                
                if (!imgSrc && post.description) {
                    const imgMatch = post.description.match(/<img[^>]+src="([^">]+)"/);
                    imgSrc = imgMatch ? imgMatch[1] : "";
                }

                if (!imgSrc && post.enclosure && post.enclosure.link) {
                    imgSrc = post.enclosure.link;
                }

                return `
                    <a href="${post.link}" target="_blank" class="group relative overflow-hidden rounded-2xl aspect-square shadow-2xl bg-green-950/10 border border-white/5">
                        <img src="${imgSrc}" 
                             alt="Kurtarıcı Ferat Instagram" 
                             class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                             onerror="this.src='https://via.placeholder.com/400?text=Instagram+Post'">
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <i class="fab fa-instagram text-white text-2xl"></i>
                        </div>
                    </a>
                `;
            }).join('');
        }
    } catch (error) {
        console.error("Filtreleme hatası:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadInstagramFeed);
