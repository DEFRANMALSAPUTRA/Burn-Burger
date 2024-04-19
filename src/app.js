document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "- CheeseBurger -", img: "1.png", price: 24000 },
      { id: 2, name: "- ChickenBurger -", img: "2.png", price: 25000 },
      { id: 3, name: "- CharcoalBurger -", img: "3.png", price: 30000 },
      { id: 4, name: "- FishBurger -", img: "4.png", price: 20000 },
      { id: 5, name: "- SpicyBurger -", img: "5.png", price: 25000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek jika ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // Jika barang sudah ada di cart
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau di remove bedasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari satu
      if (cartItem.quantity > 1) {
        // telusuri satu-satu
        this.items = this.items.map((item) => {
          // jika bukan barang yang diklik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barang nya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validaiton
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open(
    "https://wa.me/6285748520178?text=" + encodeURIComponent(message)
  );
});

// format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer 
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
  Data Pesanan
    ${JSON.parse(obj.items).map(
      (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
    )}
  TOTAL: ${rupiah(obj.total)}
  Terima Kasih.`;
};

// Konversi Ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
