const API_URL = "https://api.artic.edu/api/v1";
const ARTWORK_FIELDS = ['title', 'artist_title', 'date_display', 'place_of_origin'];
const IMG_PARAMETERS = "full/843,/0/default.jpg";
let BASE_IMAGE_URL = "";
let current_page = 1;

async function getArtworks() {
    const url = `${API_URL}/artworks?limit=10&page=${current_page}&fields=${ARTWORK_FIELDS.join(",")},image_id`;
    const response = await fetch(url);
    const data = await response.json();
    BASE_IMAGE_URL = data.config.iiif_url;
    populateTable(data.data);
}

function populateTable(artworks) {
    const tbody = document.getElementById('table_body');
    tbody.innerHTML = '';
    
    artworks.forEach((artwork, index) => {
        const row = tbody.insertRow();
        row.insertCell().textContent = (current_page - 1) * 10 + index;
        
        ARTWORK_FIELDS.forEach(field => {
            row.insertCell().textContent = artwork[field];
        });

        const btnCell = row.insertCell();
        const btn = document.createElement('button');
        btn.textContent = "Inspect";
        btn.onclick = () => showImagePopup(artwork.image_id);
        btnCell.appendChild(btn);
    });
}

async function showImagePopup(imageId) {
    const url = `${BASE_IMAGE_URL}/${imageId}/${IMG_PARAMETERS}`;
    const response = await fetch(url);
    const blob = await response.blob();

    const modal = document.getElementById("img_modal");
    modal.innerHTML = "";

    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.className = "close";
    closeBtn.onclick = () => modal.style.display = "none";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(blob);

    modal.style.display = "block";
    modal.append(closeBtn, img);
}

function changePage(offset) {
    current_page += offset;
    getArtworks();
    document.getElementById("previous_button").disabled = current_page === 1;
}

function setupListeners() {
    document.getElementById("previous_button").onclick = () => changePage(-1);
    document.getElementById("next_button").onclick = () => changePage(1);
}

setupListeners();
getArtworks();

