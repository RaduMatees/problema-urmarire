class Animal {
  constructor (name, jumpTimeRatio, jumpDistanceRatio, advantage) {
    this.name = name
    this.jumpTimeRatio = jumpTimeRatio
    this.jumpDistanceRatio = jumpDistanceRatio
    this.advantage = advantage
  }

  static animalSize() {
    return 5 //px
  }
}

const hound = new Animal('hound', 6, 3, 0);
const fox = new Animal('fox', 9, 7, 60);

const slowerAnimalJumpLength = Animal.animalSize() * 4; //px
const slowerAnimalJumpHeight = Animal.animalSize() * 4; //px
const slowerAnimalJumpTime = 1000; //ms


const whichOneisFaster = (animal1, animal2) => {
  const animal1Ratio = animal1.jumpDistanceRatio / animal1.jumpTimeRatio
  const animal2Ratio = animal2.jumpDistanceRatio / animal2.jumpTimeRatio
  return animal1Ratio <= animal2Ratio ? animal1.name : animal2.name
}
const fasterAnimal = whichOneisFaster(hound, fox)

const fasterAnimalJumpParams = (animal1, animal2) => {
  let jumpTime = null
  if (fasterAnimal === animal1.name) {
    jumpTime = animal2.jumpTimeRatio / animal1.jumpTimeRatio * slowerAnimalJumpTime
  } else {
    jumpTime = animal1.jumpTimeRatio / animal2.jumpTimeRatio * slowerAnimalJumpTime
  }
  return parseFloat(jumpTime.toFixed(2))
}

const initialPosition = (animal1, animal2) => {
  return {
    name: animal1.advantage >= animal2.advantage ? animal1.name : animal2.name,
    diff: Math.abs((animal1.advantage - animal2.advantage) * slowerAnimalJumpLength)
  }
}

const fasterAnimalJumps = (animal1, animal2) => {
  let fasterAnimal = animal1
  let slowerAnimal = animal2
  if (whichOneisFaster(animal1, animal2) === animal2.name) {
    slowerAnimal = animal1
    fasterAnimal = animal2
  }
  const fasterAnimalJumps = fasterAnimal.jumpDistanceRatio * slowerAnimal.advantage * fasterAnimal.jumpTimeRatio / Math.abs(fasterAnimal.jumpTimeRatio * slowerAnimal.jumpDistanceRatio - fasterAnimal.jumpDistanceRatio * slowerAnimal.jumpTimeRatio)
  return fasterAnimalJumps 
}

const fasterAnimalJumpProgress = (animal1, animal2) => {
  return parseFloat((initialPosition(animal1, animal2).diff / fasterAnimalJumps(animal1, animal2)).toFixed(3))
}


const fasterAnimalJumpHeight = Animal.animalSize() * 6; //px
const fasterAnimalJumpTime = fasterAnimalJumpParams(hound, fox)

// render animal with correct advantage
document.querySelector(`#${initialPosition(hound, fox).name}`).style.left = `${initialPosition(hound, fox).diff + Animal.animalSize()}px`

// DOM interactions
const foxEl = document.querySelector('#fox')
const houndEl = document.querySelector('#hound')
const foxElStartingOffsets = { top: foxEl.offsetTop, left: foxEl.offsetLeft }
const houndElStartingOffsets = { top: houndEl.offsetTop, left: houndEl.offsetLeft }

// animate background
const backgroundImage = document.querySelector('#animation-container')
backgroundImage.style.animation = `animatedBackground ${backgroundImage.offsetWidth / slowerAnimalJumpLength}s linear reverse infinite`

// faster animal visible progress taking in account that the slower animals stays put 
// (meaning that the background actually moves at its speed)
const fasterAnimalVisibleJumpProgress = fasterAnimalJumpProgress(hound, fox)
const totalAnimationTime = fasterAnimalJumps(hound, fox) * fasterAnimalJumpTime

// animation
let starttime = Date.now()
let then = Date.now()
let fps = 20
let fpsInterval = 1000 / fps
let now, delta
let jumpNumber = 0
const elements = [foxEl, houndEl]

const animate = (slowJumpTime, slowJumpHeight, slowStart, fastJumpTime, fastJumpHeight, fastStart, duration) => {

  now = Date.now()
  delta = now - then

  if (now - starttime < duration) {
    requestAnimationFrame(_ => animate(slowJumpTime, slowJumpHeight, slowStart, fastJumpTime, fastJumpHeight, fastStart, duration))
  }

  if (delta > fpsInterval) {
    then = now - (delta % fpsInterval)

    // animate elements
    elements.forEach(el => {
      if (el === foxEl) {
        const progress = then % slowJumpTime
        if (progress <= slowJumpTime / 2) {
          const top = slowStart.top - parseFloat(slowJumpHeight * (progress / slowJumpTime)) + 'px'
          el.style.top = top
        } else {
          const top = slowStart.top - parseFloat(slowJumpHeight * 0.5) + parseFloat(slowJumpHeight * progress / slowJumpTime) + 'px'
          el.style.top = top
        }
      } else {
        const progress = then % fastJumpTime
        if (progress <= fastJumpTime / 2) {
          const top = fastStart.top - parseFloat(fastJumpHeight * (progress / fastJumpTime)) + 'px'
          el.style.top = top
        } else {
          const top = fastStart.top - parseFloat(fastJumpHeight * 0.5) + parseFloat(fastJumpHeight * progress / fasterAnimalJumpTime) + 'px'
          el.style.top = top
        }
      
        const left = fastStart.left + parseFloat(jumpNumber * fasterAnimalVisibleJumpProgress) + parseFloat(fasterAnimalVisibleJumpProgress * progress / fasterAnimalJumpTime) + 'px'
        el.style.left = left

        if (progress >= fastJumpTime - fpsInterval) jumpNumber++
      }
    })

  }

}

animate(slowerAnimalJumpTime, slowerAnimalJumpHeight, foxElStartingOffsets, fasterAnimalJumpTime, fasterAnimalJumpHeight, houndElStartingOffsets, totalAnimationTime)