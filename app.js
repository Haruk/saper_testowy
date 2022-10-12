document.addEventListener('DOMContentLoaded', () => { //1

const grid = document.querySelector('.grid')
let width = 10
let bombsAmount = 20 //2
let flags = 0
let squares = []
let isGameOver = false 

//tworzymy plansze

function createBoard () {
    //umieszczamy losowo bomby
    const bombsArray = Array(bombsAmount).fill('bomb')
    const emptyArray = Array(width*width - bombsAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray) //łączymy ze sobą dwa arraye
    const shuffledArray = gameArray.sort(() => Math.random()-0.5) //??? 

    for (let i = 0; i < width*width; i++) {
        const square = document.createElement('div')
        square.setAttribute('id', i)
        square.classList.add(shuffledArray[i]) //dodaje nazwy poszczególnych elementów arraya gameArray jako klasy dla poszczegolnych divów square zgodnie z indeksem obecnie przerabianym w pętli
        grid.appendChild(square) //tworzy element <div class="square"> w elemencie rodzicu <div class="grid">
        squares.push(square) //każdy utworzony <div> umieszczamy w arrayu squares
        // event na kliknięcie
        square.addEventListener('click', function(e) {
            click(square)
        })

        //
        square.oncontextmenu = function(e){
          e.preventDefault()
          addFlag(square)
        }

    }

    // dodajemy numery do pól obok bomb
    for (let i=0; i<squares.length; i++) {
        let total = 0
        const isLeftEdge = (i % width === 0) // ponieważ grid jest ciągiem divów 'zawijanych' po 10 w rzędach nie chcemy sprawdzać pól sąsiadującyh od pól po lewej stronie
        const isRightEdge = (i % width === width-1) // ponieważ grid jest ciągiem divów 'zawijanych' po 10 w rzędach nie chcemy sprawdzać pól sąsiadującyh od pól po prawej stronie
        if (squares[i].classList.contains('valid')) {
            if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++ //sprawdza pole po lewej stronie klikniętego pola
            if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++ //sprawdza pole prawe górne skośne
            if (i > 10 && squares[i -width].classList.contains('bomb')) total ++ //sprawdza pole powyżej
            if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++ // sprawdza pole lewe górne skośne
            if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++ //sprawdza pole po lewej
            if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++ //sprawdza pole lewe dolne skośne 
            if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++ //sprawdza pole lewe górne skośne
            if (i < 89 && squares[i +width].classList.contains('bomb')) total ++ //sprawdza pole poniżej
            squares[i].setAttribute('data', total)
          }

    }
}



createBoard()

//dodawanie flag w miejscu bomb

function addFlag (square) {
    if (isGameOver) return
    if (!square.classList.contains('checked')&& (flags<bombsAmount)) {
      if (!square.classList.contains('flag')){
        square.classList.add('flag')
        square.innerHTML = 'F'
        flags++
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags --
      }
    }

}
//mechanika kliknięcia na planszy
function click(square){
    let currentId = square.id //local scope, ale wykorzystuje też w kolejnej funkcji???
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')){
        gameOver(square)
    } else {
        let total = square.getAttribute('data')
        if (total!=0){
            square.classList.add('checked')
            square.innerHTML = total
            return
        }
        checkSquare(square,currentId)
        
    }
    square.classList.add('checked')
}

// sprawdzamy wszystkie sąsiadujące pola do pola, które kliknęliśmy
function checkSquare (square, currentId){
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width-1)

    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
          const newId = squares[parseInt(currentId) -1].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId > 9 && !isRightEdge) {
          const newId = squares[parseInt(currentId) +1 -width].id
            const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId > 10) {
          const newId = squares[parseInt(currentId -width)].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId > 11 && !isLeftEdge) {
          const newId = squares[parseInt(currentId) -1 -width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 98 && !isRightEdge) {
          const newId = squares[parseInt(currentId) +1].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 90 && !isLeftEdge) {
          const newId = squares[parseInt(currentId) -1 +width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 88 && !isRightEdge) {
          const newId = squares[parseInt(currentId) +1 +width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
        if (currentId < 89) {
          const newId = squares[parseInt(currentId) +width].id
          const newSquare = document.getElementById(newId)
          click(newSquare)
        }
      }, 10)
}

//definiujemy kiedy gra się kończy
function gameOver(square) {
  console.log("game over")
  isGameOver = true

  //pokazuje wszystkie lokacje bomb
  squares.forEach (square => {
    if (square.classList.contains('bomb')) {
      square.innerHTML = 'UPS'
    }
  })
}

//definiujemy warunki wygranej
function checkForWin () {
  let matches = 0
  for (let i = 0; i< squares.length; i++) {
    if (squares [i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
      matches++
    }
    if (matches === bombsAmount) {
      console.log ('win')
      isGameOver = true
    }
  }
}

})



//1 DOMContentLoaded ładuje cały skrypt zanim zacznie go wykonywac, można też dać link na koncu sekcji body
//2 W którym miejscu należy wstawić element scryptu odpowidzialny za zwiększanie bądź zmniejszanie ilośći bomb (np. poziomy trudności)?