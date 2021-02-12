const slider = document.querySelector('.slider-container'),

// Array.from() retorna um Array de qualquer objeto com uma propriedade length ou um objeto iterável.
  slides = Array.from(document.querySelectorAll('.slide'))

// Configurações
let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  currentIndex = 0


// Para cada elemento dentro de slides ele executa uma função passando o index junto
slides.forEach((slide, index) => {
  // Utilizando "slide" ele seleciona a "img" e armazena em "slideImage"
  const slideImage = slide.querySelector('img')
  // Cancela o evento de arrastar elementos da imagem em "slideImage"
  slideImage.addEventListener('dragstart', e => e.preventDefault())
  
  // Touch events
  slide.addEventListener('touchstart', touchStart(index))
  slide.addEventListener('touchend', touchEnd)
  slide.addEventListener('touchmove', touchMove)
  
  // Mouse events
  slide.addEventListener('mousedown', touchStart(index))
  slide.addEventListener('mouseup', touchEnd)
  slide.addEventListener('mouseleave', touchEnd)
  slide.addEventListener('mousemove', touchMove)
})

// Disable context menu
// Menu que aparece quando pressiona uma imagem (opções de download, abrir em nova aba, etc...)
window.oncontextmenu = function(event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}

// "mousedown" e "touchstart"
function touchStart(index) {
  // Retorna uma função passando um evento
  return function(event) {
    // Atribui o valor de "index" para "currentIndex"
    currentIndex = index
    // Chama a função "getPositionX" passando o evento e atribuindo o valor retornado a "startPos" (onde ocorreu o toque/clique)
    startPos = getPositionX(event)
    
    // Altera "isDragging" para "true"
    isDragging = true
    
    // Chama a função "animation" por "requestAnimationFrame" e atribui o valor a "animationID"
    animationID = requestAnimationFrame(animation)
    
    // Adiciona a "slider" (container onde está todos os slides) a classe "grabbing"
    slider.classList.add('grabbing')
  }
}


// "mouseup", "mouseleave" e "touchend"
function touchEnd() {
  // Atribui a "isDragging" o valor "false"
  isDragging = false
  // Cancela o "requestAnimationFrame" chamando "animationID" pela função "cancelAnimationFrame"
  cancelAnimationFrame(animationID)
  
  // Atribui a "movedBy" o valor de "currentTranslate" - "prevTranslate"
  const movedBy = currentTranslate - prevTranslate
  
  // Se "movedBy" for menor que "-100" e "currentIndex" for menor que "slides.length - 1", ele entra e incrementa "currentIndex" em 1
  if(movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1
  }
  
  // Se "movedBy" for maior que "100" e "currentIndex" for maior que "0", ele decrementa "currentIndex" em 1
  if(movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1
  }
  
  // Chama a função "setPositionByIndex"
  setPositionByIndex()
  
  // Remove a classe "grabbing" de "slider" (container onde está os slides)
  slider.classList.remove('grabbing')
}


// "mousemove" e "touchmove" passando o evento
function touchMove(event) {
  // Se "isDragging" for true, ele entra (enquanto o usuário mantém o toque/ segura o clique)
  if (isDragging) {
    // Chama a função "getPositionX" passando o evento, e atribui o valor recebido a "currentPosition"
    // A função é chamada várias vezes enquanto o usuário move o toque/mouse segurando o clique
    const currentPosition = getPositionX(event)
    
    // Atribui valor q "currentTranslate" como "prevTranslate" + "currentPosition - startPos"
    currentTranslate = prevTranslate + currentPosition - startPos
  }
}


// Função getPositionX que recebe o evento
function getPositionX(event) {
  // Se o evento for do tipo "mouse", ele retorna "event.pageX", se for falso, retorna "event.touches[0].clientX" que seria o evento de toque
  return event.type.includes('mouse') 
    ? event.pageX 
    : event.touches[0].clientX
}


function animation() {
  // Chama a função "setSliderPosition"
  setSliderPosition()
  // Se "isDragging" for true, ele continua chamando a função "animation" por "requestAnimationFrame" (como um loop)
  if(isDragging) requestAnimationFrame(animation)
}


// Função "setSliderPosition"
function setSliderPosition() {
  // Atribui ao container "slider" o translate com o valor em "currentTranslate"
  slider.style.transform = `translateX(${currentTranslate}px)`
}


// Função setPositionByIndex
function setPositionByIndex() {
  // Atribui a "currentTranslate" o valor de "currentIndex" * "-window.innerWidth"
  currentTranslate = currentIndex * -window.innerWidth
  
  // Atribui a "prevTranslate" o valor de "currentTranslate"
  prevTranslate = currentTranslate
  
  // Chama a função "setSliderPosition"
  setSliderPosition()
}

// https://css-tricks.com/using-requestanimationframe/

// Array.from():
// https://www.w3schools.com/jsref/jsref_from.asp

