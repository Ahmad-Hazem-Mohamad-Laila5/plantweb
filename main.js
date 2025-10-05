// عناصر القائمة والسلة
const openmenu = document.querySelector(".open-menu");
const mobile_menu = document.querySelector(".mobile-menu");
const opencart = document.querySelector(".cart");
const cart = document.querySelector(".cart-tab");
const closecart = document.querySelector(".close-btn");
const cartitems = document.querySelector(".cart-item");


// قائمة المنتجات والسلة
const cardlist = document.querySelector(".card-container");
const cardlistopen = document.querySelector(".cart-list");
const carttotal = document.querySelector(".cart-total");


 // القائمة الجانبية للموبايل
openmenu.addEventListener("click", function () {
  mobile_menu.classList.add("avtive"); 
});
document.addEventListener("click", function (e) {
  if (mobile_menu.classList.contains("avtive")) {
    if (!mobile_menu.contains(e.target) && !openmenu.contains(e.target)) {
      mobile_menu.classList.remove("avtive");
    }
  }
});

// فتح القائمة الجانبية للموبايل
openmenu.addEventListener("click", function () {
  mobile_menu.classList.add("avtive"); // ملاحظة: كان هناك خطأ إملائي "avtive"
});

// فتح السلة
opencart.addEventListener("click", function (e) {
  e.preventDefault();
  cart.classList.add("cart-page-active");
});

// إغلاق السلة
closecart.addEventListener("click", function (e) {
  e.preventDefault();
  cart.classList.remove("cart-page-active");
});

// السلايدر (Swiper)
var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#prev",
    prevEl: "#next",
  },
});

// عرض المنتجات
let prolist = [];
const showpro = () => {
  prolist.forEach((e) => {
    const ordercard = document.createElement("div");
    ordercard.classList.add("plant-card");
    ordercard.innerHTML = `
      <img src='${e.image}' />
      <div class="card-content">
        <h3>${e.name}</h3>
        <p>${e.title}</p>
        <div class="price">${e.price}</div>
        <button class="card-btn">Add To Cart</button>
      </div>
    `;

    const cardbtn = ordercard.querySelector(".card-btn");
    cardbtn.addEventListener("click", function (en) {
      en.preventDefault();
      addtocart(e);
    });

    cardlist.appendChild(ordercard);
  });
};

// إضافة منتجات للسلة
let cartproduct = [];

const addtocart = (pro) => {
  let quantity = 1;
  let price = parseFloat(pro.price.replace("$", ""));
  const existing = cartproduct.find((m) => m.id === pro.id);

  if (existing) {
    alert("هذا المنتج موجود بالفعل في السلة!");
    return;
  }

  cartproduct.push(pro);

  const carditem = document.createElement("div");
  carditem.classList.add("item");
  carditem.innerHTML = `
    <div class="item-image">
      <img src="${pro.image}" alt="" />
    </div>
    <div class="tx">
      <h4>${pro.name}</h4>
      <h4 class="item-total">${pro.price}</h4>
    </div>
    <div class="flex">
      <a href="#" class="quantity-btn min">-</a>
      <h4 class="quantity-value">${quantity}</h4>
      <a href="#" class="quantity-btn plus">+</a>
    </div>
  `;

  const plus = carditem.querySelector(".plus");
  const min = carditem.querySelector(".min");
  const itemtotal = carditem.querySelector(".item-total");
  const quantityvalue = carditem.querySelector(".quantity-value");

  // زر الزيادة
  plus.addEventListener("click", function (ee) {
    ee.preventDefault();
    quantity++;
    quantityvalue.textContent = quantity;
    itemtotal.textContent = `$${(price * quantity).toFixed(2)}`;
    updatetotals();
  });

  // زر النقص
  min.addEventListener("click", function (ee) {
    if (quantity > 1) {
      ee.preventDefault();
      quantity--;
      quantityvalue.textContent = quantity;
      itemtotal.textContent = `$${(price * quantity).toFixed(2)}`;
      updatetotals();
    } else {
      // إزالة المنتج إذا الكمية أصبحت 0
      setTimeout(() => {
        carditem.remove();
        ee.preventDefault();
        cartproduct = cartproduct.filter((item) => item.id !== pro.id);
        updatetotals();
        ee.preventDefault();
      }, 0);
    }
  });

  cardlistopen.appendChild(carditem);
  updatetotals();
};

// تحديث السعر الكلي
const updatetotals = () => {
  let totalquantity = 0;
  let totalprice = 0;
  document.querySelectorAll(".item").forEach((item) => {
    const quantity = parseInt(item.querySelector(".quantity-value").textContent);
    const priceText = item
      .querySelector(".item-total")
      .textContent.replace("$", "");
    const price = parseFloat(priceText);
    totalprice += price;
    totalquantity += quantity;
  });
  carttotal.textContent = `$${totalprice.toFixed(2)}`;
  cartitems.textContent = `${totalquantity}`
};

// تحميل المنتجات من ملف JSON
const initapp = () => {
  fetch("pro.json")
    .then((response) => response.json())
    .then((data) => {
      prolist = data;
      showpro();
    });
};

initapp();
document.addEventListener("click", function (e) {
  const target = e.target;

  // إذا كان العنصر <a> و href="#"
  if (target.tagName === "A" && target.getAttribute("href") === "#") {
    e.preventDefault();
  }
});

