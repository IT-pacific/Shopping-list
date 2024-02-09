const itemForm = document.getElementById('item-form')
const formBtn = itemForm.querySelector('button')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear')
const filterInput = document.getElementById('filter')

let isNotOnList
let isEditMode = false

const displayItems = () => {
  const list = JSON.parse(localStorage.getItem('items'))
  if (list !== null) {
    list.forEach((item) => addItemToDom(item))
  }
  checkList()
}

const creatIcon = (classes) => {
  const icon = document.createElement('i')
  icon.className = classes
  return icon
}

const creatButton = (classes) => {
  const button = document.createElement('button')
  button.className = classes
  const icon = creatIcon('fa-solid fa-xmark')
  button.appendChild(icon)
  return button
}

const getItemFromStorage = () => {
  let storageItems
  if (localStorage.getItem('items') === null) {
    storageItems = []
  } else {
    storageItems = JSON.parse(localStorage.getItem('items'))
  }

  return storageItems
}

const checkDuplicate = (item) => {
  const itemsFromStorage = getItemFromStorage()
  isNotOnList = itemsFromStorage.every((i) => i !== item)
}

// checkDuplicate('orange')

const addItemToLocalStorage = (item) => {
  const storageItems = getItemFromStorage()

  storageItems.push(item)

  localStorage.setItem('items', JSON.stringify(storageItems))
}

const addItemToDom = (item) => {
  const li = document.createElement('li')
  li.appendChild(document.createTextNode(item))

  const button = creatButton('remove-item btn-link text-red')
  li.appendChild(button)

  itemList.appendChild(li)
}

const onAddItemSubmit = (e) => {
  e.preventDefault()
  const newItem = itemInput.value
  if (newItem === '') {
    alert('Enter something.')
    return
  } else {
    checkDuplicate(newItem)
    if (isNotOnList) {
      // Check for edit mode
      if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode')
        removeItem(itemToEdit)
        itemToEdit.classList.remove('edit-mode')
        itemToEdit.remove()
        isEditMode = false
      }

      // Add item to DOM
      addItemToDom(newItem)

      // Add item to localStorage
      addItemToLocalStorage(newItem)

      checkList()

      itemInput.value = ''
    } else {
      alert('item is already on list !')
    }
  }
}

const removeItem = (item) => {
  item.remove()
  const itemText = item.innerText.trim()
  // Remove from local storage
  let itemsFromLocalStorage = getItemFromStorage()

  itemsFromLocalStorage = itemsFromLocalStorage.filter((i) => i !== itemText)

  localStorage.setItem('items', JSON.stringify(itemsFromLocalStorage))
}

const setItemToEdit = (item) => {
  isEditMode = true
  itemList.querySelectorAll('li').forEach((i) => {
    i.classList.remove('edit-mode')
  })

  item.classList.add('edit-mode')
  itemInput.value = item.innerText.trim()

  formBtn.innerText = 'Edit item'
  formBtn.style.backgroundColor = '#064e3b'
}

const onItemClick = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.closest('li'))

    checkList()
  } else {
    if (e.target.matches('li')) {
      setItemToEdit(e.target)
    }
  }
}

const clearList = (e) => {
  if (e.target.matches('button')) {
    while (itemList.firstChild) {
      itemList.firstChild.remove()
    }

    localStorage.removeItem('items')

    checkList()
  }
}

const filterItems = (e) => {
  const items = itemList.querySelectorAll('li')
  const text = e.target.value.toLowerCase()
  items.forEach((item) => {
    if (item.innerText.toLowerCase().includes(text)) {
      item.style.display = 'flex'
    } else {
      item.style.display = 'none'
    }
  })
}

const checkList = () => {
  const items = itemList.querySelectorAll('li')

  if (items.length === 0) {
    // filterBtn.style.display = 'none'
    // clearBtn.style.display = 'none'
    filterInput.classList.add('remove')
    clearBtn.classList.add('remove')
  } else {
    // filterBtn.style.display = 'block'
    // clearBtn.style.display = 'block'
    filterInput.classList.remove('remove')
    clearBtn.classList.remove('remove')
  }

  formBtn.innerText = 'Add item'
  formBtn.style.backgroundColor = '#333'

  isEditMode = false
}

// Event Listeners
function init() {
  itemForm.addEventListener('submit', onAddItemSubmit)
  itemList.addEventListener('click', onItemClick)
  clearBtn.addEventListener('click', clearList)
  filterInput.addEventListener('input', filterItems)
  document.addEventListener('DOMContentLoaded', displayItems)

  checkList()
}

init()
