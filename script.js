// --- PENGATURAN MENU LAYANAN & ADD-ONS ---
// EDIT DAFTAR LAYANAN UTAMA ANDA DI SINI
const availableServices = [
    { name: 'Pilih Layanan...', price: 0 },
	{ name: 'Outer Clean', price: 25000 },
	{ name: 'Deep Clean', price: 35000 },
	{ name: 'Leather Care', price: 40000 },
	{ name: 'Flat Shoes', price: 25000 },
	{ name: 'Kids Shoes', price: 25000 },
	{ name: 'Sandal', price: 20000 },
	{ name: 'Deep Clean - Topi', price: 20000 },
	{ name: 'Deep Clean - Dompet', price: 20000 },
	{ name: 'Deep Clean - Small Bag', price: 25000 },
	{ name: 'Deep Clean - Medium Bag', price: 35000 },
	{ name: 'Deep Clean - Large Bag', price: 50000 },
	{ name: 'Deep Clean - Half Face Helmet', price: 25000 },
	{ name: 'Deep Clean - Full Face Helmet', price: 30000 },
	{ name: 'Deep Clean - Soft Opening Promo', price: 0 }

];

// EDIT DAFTAR LAYANAN TAMBAHAN (ADD-ONS) ANDA DI SINI
const availableAddons = [
    { name: 'One-day Service (24 Jam)', price: 10000 },
    { name: 'Unyellowing', price: 15000 },
    { name: 'Whitening', price: 20000 }
];
// ------------------------------------


// --- Bagian Pengaturan & Elemen DOM ---
const serviceTableBody = document.getElementById('serviceTableBody');
const addServiceBtn = document.getElementById('addServiceBtn');
const subtotalEl = document.getElementById('subtotal');
const totalAmountEl = document.getElementById('totalAmount');
const discountEl = document.getElementById('discount');
const photoUpload = document.getElementById('photoUpload');
const photoPreviewContainer = document.getElementById('photoPreviewContainer');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const photoDocumentationSection = document.getElementById('photoDocumentationSection');


// --- Fungsi Utama ---

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function calculateTotal() {
    let subtotal = 0;
    const rows = serviceTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        
        const basePrice = parseFloat(row.querySelector('.service-select').options[row.querySelector('.service-select').selectedIndex].dataset.price) || 0;
        
        let addonsPrice = 0;
        row.querySelectorAll('.addon-checkbox:checked').forEach(checkbox => {
            addonsPrice += parseFloat(checkbox.dataset.price) || 0;
        });

        const unitPrice = basePrice + addonsPrice;
        row.querySelector('.price').value = unitPrice;

        const rowTotal = unitPrice * qty;
        row.querySelector('.row-total').textContent = formatCurrency(rowTotal);
        subtotal += rowTotal;
    });
    
    const discount = parseFloat(discountEl.value) || 0;
    const total = subtotal - discount;

    subtotalEl.textContent = formatCurrency(subtotal);
    totalAmountEl.textContent = formatCurrency(total);
}

function createServiceRow(selectedService = 'Pilih Layanan...', quantity = 1) {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-gray-200';

    // Buat Opsi Dropdown Layanan Utama
    let serviceOptionsHtml = availableServices.map(service => {
        const isSelected = service.name === selectedService ? 'selected' : '';
        return `<option value="${service.name}" data-price="${service.price}" ${isSelected}>${service.name}</option>`;
    }).join('');

    // Buat Opsi Checkbox Add-ons
    let addonsHtml = availableAddons.map(addon => `
        <div class="addon-item">
            <input type="checkbox" class="addon-checkbox" data-price="${addon.price}">
            <label>${addon.name}</label>
            <span>+ ${formatCurrency(addon.price)}</span>
        </div>
    `).join('');

    tr.innerHTML = `
        <td class="p-4 align-top">
            <select class="editable w-full service-select">${serviceOptionsHtml}</select>
            <input type="text" class="editable w-full mt-2 manual-description" placeholder="Contoh: Nike Air Force 1 Hitam size 43...">
            <div class="addons-container">${addonsHtml}</div>
        </td>
        <td class="p-4 align-top"><input type="number" class="editable w-full text-center qty" value="${quantity}" min="1"></td>
        <td class="p-4 align-top"><input type="number" class="editable w-full text-right price" value="0" min="0" readonly></td>
        <td class="p-4 align-top text-right row-total font-semibold">Rp 0</td>
        <td class="p-4 align-top text-center no-print"><button class="text-red-500 font-bold remove-btn">X</button></td>
    `;

    // Tambah Event Listeners untuk baris ini
    const updateRow = () => calculateTotal();
    tr.querySelector('.service-select').addEventListener('change', updateRow);
    tr.querySelector('.qty').addEventListener('input', updateRow);
    tr.querySelectorAll('.addon-checkbox').forEach(cb => cb.addEventListener('change', updateRow));

    tr.querySelector('.remove-btn').addEventListener('click', () => {
        tr.remove();
        calculateTotal();
    });

    serviceTableBody.appendChild(tr);
    calculateTotal(); // Hitung total setelah baris baru ditambahkan
}

function handlePaymentMethodChange() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    document.getElementById('cashDetails').classList.toggle('hidden', selectedMethod !== 'cash');
    document.getElementById('qrisDetails').classList.toggle('hidden', selectedMethod !== 'qris');
    document.getElementById('transferDetails').classList.toggle('hidden', selectedMethod !== 'transfer');
}

function checkPhotoPlaceholder() {
    if (photoPreviewContainer.children.length > 0) {
        uploadPlaceholder.classList.add('hidden');
        photoDocumentationSection.classList.remove('no-print-if-empty');
    } else {
        uploadPlaceholder.classList.remove('hidden');
        photoDocumentationSection.classList.add('no-print-if-empty');
    }
}

// --- Event Listeners Global ---
addServiceBtn.addEventListener('click', () => createServiceRow());
discountEl.addEventListener('input', calculateTotal);

document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', handlePaymentMethodChange);
});

photoUpload.addEventListener('change', event => {
    for (const file of event.target.files) {
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                const wrapper = document.createElement('div');
                wrapper.className = 'photo-wrapper';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'photo-thumbnail';
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-photo-btn no-print';
                removeBtn.innerHTML = '&times;';
                removeBtn.onclick = () => {
                    wrapper.remove();
                    checkPhotoPlaceholder();
                };
                wrapper.appendChild(img);
                wrapper.appendChild(removeBtn);
                photoPreviewContainer.appendChild(wrapper);
                checkPhotoPlaceholder();
            };
            reader.readAsDataURL(file);
        }
    }
    event.target.value = '';
});

// Fungsi untuk mempersiapkan halaman sebelum dicetak
function prepareForPrint() {
    document.querySelectorAll('.addon-checkbox').forEach(checkbox => {
        if (!checkbox.checked) {
            const item = checkbox.closest('.addon-item');
            if (item) { // Pemeriksaan keamanan
                item.classList.add('hide-on-print');
            }
        }
    });
}

// Fungsi untuk membersihkan halaman setelah dicetak
function cleanupAfterPrint() {
    document.querySelectorAll('.addon-item.hide-on-print').forEach(item => {
        item.classList.remove('hide-on-print');
    });
}

// Event listener yang dijalankan sebelum dan sesudah proses cetak
window.addEventListener('beforeprint', prepareForPrint);
window.addEventListener('afterprint', cleanupAfterPrint);

// --- Inisialisasi Halaman ---
function initializeDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('issueDate').value = today;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    document.getElementById('dueDate').value = tomorrow.toISOString().split('T')[0];
}

window.addEventListener('load', () => {
    createServiceRow(); // Cukup buat satu baris kosong saat memulai
    initializeDates();
    handlePaymentMethodChange();
    checkPhotoPlaceholder();
});


