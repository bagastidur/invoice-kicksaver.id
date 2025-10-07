// --- PENGATURAN MENU LAYANAN ---
// EDIT DAFTAR LAYANAN ANDA DI SINI
const availableServices = [
    { name: 'Pilih Layanan...', price: 0 },
    { name: 'Outer Clean', price: 25000 },
    { name: 'Deep Clean', price: 35000 },
    { name: 'Unyellowing', price: 75000 },
    { name: 'Whitening', price: 100000 },
    { name: 'Reglue', price: 30000 },
    { name: '+ One Day Service', price: 15000 }
];
// ------------------------------------


// --- Bagian Pengaturan & Elemen DOM ---
const serviceTableBody = document.getElementById('serviceTableBody');
const addServiceBtn = document.getElementById('addServiceBtn');
const subtotalEl = document.getElementById('subtotal');
const totalAmountEl = document.getElementById('totalAmount');
const discountEl = document.getElementById('discount');

// Elemen Baru untuk Fitur Foto
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
        const price = parseFloat(row.querySelector('.price').value) || 0;
        const rowTotal = qty * price;
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

    let optionsHtml = '';
    availableServices.forEach(service => {
        const isSelected = service.name === selectedService ? 'selected' : '';
        optionsHtml += `<option value="${service.name}" data-price="${service.price}" ${isSelected}>${service.name}</option>`;
    });

    tr.innerHTML = `
        <td class="p-4">
            <select class="editable w-full service-select">${optionsHtml}</select>
        </td>
        <td class="p-4"><input type="number" class="editable w-full text-center qty" value="${quantity}" min="1"></td>
        <td class="p-4"><input type="number" class="editable w-full text-right price" value="0" min="0"></td>
        <td class="p-4 text-right row-total">Rp 0</td>
        <td class="p-4 text-center no-print"><button class="text-red-500 font-bold remove-btn">X</button></td>
    `;

    const selectEl = tr.querySelector('.service-select');
    const priceEl = tr.querySelector('.price');

    const updatePriceForRow = () => {
        const selectedOption = selectEl.options[selectEl.selectedIndex];
        const price = selectedOption.dataset.price || 0;
        priceEl.value = price;
        calculateTotal();
    };

    selectEl.addEventListener('change', updatePriceForRow);

    tr.querySelector('.remove-btn').addEventListener('click', () => {
        tr.remove();
        calculateTotal();
    });

    serviceTableBody.appendChild(tr);
    updatePriceForRow(); // Atur harga awal untuk baris yang baru dibuat
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

// --- Event Listeners ---

addServiceBtn.addEventListener('click', () => createServiceRow());

serviceTableBody.addEventListener('input', calculateTotal);
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


// --- Inisialisasi Halaman ---

function initializeDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('issueDate').value = today;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    document.getElementById('dueDate').value = tomorrow.toISOString().split('T')[0];
}

window.addEventListener('load', () => {
    createServiceRow('Deep Clean - Sneakers Suede', 1);
    createServiceRow('Water Repellent Coating', 1);
    // calculateTotal() tidak perlu dipanggil di sini karena sudah dipanggil di dalam createServiceRow
    initializeDates();
    handlePaymentMethodChange();
    checkPhotoPlaceholder();
});

