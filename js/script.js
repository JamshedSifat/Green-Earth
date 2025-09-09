const openModal = (id) => {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then(res => res.json())
    .then(json => {
      const plant = json.plants; 

      const modal = document.getElementById("my_modal_5");

      modal.querySelector(".plant-name").innerText = plant.name;
      modal.querySelector(".plant-image").src = plant.image;
      modal.querySelector(".plant-category").innerHTML = `<span class="font-bold">Category:</span> ${plant.category}`;
      modal.querySelector(".plant-price").innerHTML = `<span class="font-bold">Price:</span> ৳${plant.price}`;
      modal.querySelector(".plant-description").innerHTML = `<span class="font-bold">Description:</span> ${plant.description}`;

      modal.showModal();
    })
   
};


const displayCard = (plants) => {
  const treeContainer = document.getElementById("cards");
  treeContainer.innerHTML = '';
  for (let plant of plants) {
    const card = document.createElement("div");
    card.className = "bg-white rounded shadow p-4 space-y-2";
    card.innerHTML = `
      <img class="w-full h-40 object-cover rounded" src="${plant.image}">
      <h3 onclick="openModal(${plant.id})" class="font-bold cursor-pointer">${plant.name}</h3>
      <p>${plant.description.slice(0, 60)}</p>
      <div class="flex justify-between items-center">
        <h3 class="text-[#15803D] bg-[#DCFCE7] rounded-md p-1">${plant.category}</h3>
        <h2><span class="font-bold">৳</span>${plant.price}</h2>
      </div>
      <button onclick='handleAddToCartClick(${JSON.stringify(plant)})'   class="bg-[#15803D] w-full rounded-full text-white p-2">Add to Cart</button>
    `;
    treeContainer.appendChild(card);
  }
};


const loadAllTrees = () => {
  const url = "https://openapi.programming-hero.com/api/plants"; 
  fetch(url)
    .then(res => res.json())
    .then((json) => {
      displayCard(json.plants);
     
    });
};


const loadTrees =(id)=>{
  
   const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
  .then(response => response.json())
  .then((data)=> displayCard(data.plants))
}

const loadContainer =()=>{
  const url = "https://openapi.programming-hero.com/api/categories"
  fetch(url)
  .then(response => response.json())
  .then((data) => displayLeftContant(data.categories))
  loadAllTrees()
  
}

const displayLeftContant =(items)=>{
  const levelCategories = document.getElementById("categories")
  levelCategories.innerHTML='';
  // all plant button added
  const allBtn = document.createElement("li")
  allBtn.innerHTML=`
    <button onclick="loadAllTrees()" class="px-3 py-1 border rounded bg-[#15803D] text-white">
       All Plants
      </button>
  `
  levelCategories.appendChild(allBtn)
  //  loop through categories
  for (let item of items) {
    const li = document.createElement("li");
    li.innerHTML = `
    <button 
    id="cat-${item.id}" onclick="loadTrees(${item.id}); setActiveButton(${item.id})">
  ${item.category_name}
</button>
    `;
    levelCategories.appendChild(li);
  }
};
loadContainer()



/* challang part */
let cart = [];
let totalPrice = 0;

const addToCart = (plant) => {
  cart.push(plant);

  const cartList = document.getElementById("cart-list");
  const li = document.createElement("li");
  li.setAttribute("id", `cart-item-${plant.id}`);
 
  li.innerHTML = `
    <div class="flex justify-between mx-auto items-center bg-[#F0FDF4 ] p-2">
         <div class="">
          <h1 class="font-bold text-xl">${plant.name}</h1>
        <p>৳<span>${plant.price}</span></p>
        </div>
        <div class="">
          <button onclick="removeFromCart(${plant.id}, ${plant.price})">
            ❌
          </button>
        </div>
       </div>
  `;
  cartList.appendChild(li);

  // total update
  totalPrice += plant.price;
  document.getElementById("total").innerText = totalPrice;
  document.getElementById("cart-count").innerText = cart.length;
};

const removeFromCart = (id, price) => {
  // remove from ui
  const item = document.getElementById(`cart-item-${id}`);
  if (item) item.remove();

  // total update
  totalPrice -= price;
  document.getElementById("total").innerText = totalPrice;

  // remove from cart
  cart = cart.filter(p => p.id !== id);
  document.getElementById("cart-count").innerText = cart.length;
};


// Active button handle
const setActiveButton = (id) => {
  const buttons = document.querySelectorAll("#categories button");
  
 /* remove activate class */
  buttons.forEach(btn => {
    btn.classList.remove("bg-[#15803D]", "text-white","border");
    btn.classList.add("text-black");
  });

  /* Activate Button */
  let activeBtn;
  if (id === "all") {
    activeBtn = document.getElementById("all-plants-btn");
  } else {
    activeBtn = document.getElementById(`cat-${id}`);
  }

  if (activeBtn) {
    activeBtn.classList.add("bg-[#15803D]", "text-white");
    activeBtn.classList.remove("text-black");
  }
};

/*when add to cart click give a popup  */
const handleAddToCartClick = (plant) => {
  const confirmAdd = confirm(`Do you want to add "${plant.name}" to your cart?`);

  if (confirmAdd) {
    addToCart(plant);
  } else {
    console.log(`"${plant.name}" not added to cart.`);
  }
};




