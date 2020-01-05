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

// animals
const hound = new Animal('hound', 6, 3, 0);
const fox = new Animal('fox', 9, 7, 60);

// slower animal variables
const slowerAnimalJumpLength = Animal.animalSize() * 4; //px
const slowerAnimalJumpHeight = Animal.animalSize() * 4; //px
const slowerAnimalJumpTime = 1000; //ms

// helper functions
const whichOneisFaster = (animal1, animal2) => {
  const animal1Ratio = animal1.jumpDistanceRatio / animal1.jumpTimeRatio
  const animal2Ratio = animal2.jumpDistanceRatio / animal2.jumpTimeRatio
  return animal1Ratio <= animal2Ratio ? animal1.name : animal2.name
}
const fasterAnimal = whichOneisFaster(hound, fox)
const slowerAnimal = fasterAnimal === hound.name ? fox.name : hound.name

const fasterAnimalJumpParams = (animal1, animal2) => {
  let jumpLength = null
  let jumpTime = null
  if (fasterAnimal === animal1.name) {
    jumpLength = animal2.jumpDistanceRatio / animal1.jumpDistanceRatio * slowerAnimalJumpLength
    jumpTime = animal2.jumpTimeRatio / animal1.jumpTimeRatio * slowerAnimalJumpTime
  } else {
    jumpLength = animal1.jumpDistanceRatio / animal2.jumpDistanceRatio * slowerAnimalJumpLength
    jumpTime = animal1.jumpTimeRatio / animal2.jumpTimeRatio * slowerAnimalJumpTime
  }
  return { jumpLength: parseFloat(jumpLength.toFixed(2)), jumpTime: parseFloat(jumpTime.toFixed(2)) }
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

// faster animal variables
const fasterAnimalJumpHeight = Animal.animalSize() * 6; //px
const fasterAnimalJumpLength = fasterAnimalJumpParams(hound, fox).jumpLength
const fasterAnimalJumpTime = fasterAnimalJumpParams(hound, fox).jumpTime

// DOM interactions
document.querySelector(`#${initialPosition(hound, fox).name}`).style.left = `${initialPosition(hound, fox).diff + Animal.animalSize()}px`

// move background
const foxEl = document.querySelector('#fox')
const houndEl = document.querySelector('#hound')
const foxElStartingOffsets = { top: foxEl.offsetTop, left: foxEl.offsetLeft }
const houndElStartingOffsets = { top: houndEl.offsetTop, left: houndEl.offsetLeft }


const backgroundImage = document.querySelector('#animation-container')
backgroundImage.style.animation = `animatedBackground ${backgroundImage.offsetWidth / slowerAnimalJumpLength}s linear reverse infinite`


const fasterAnimalVisibleJumpProgress = fasterAnimalJumpProgress(hound, fox) // 16.667
const totalAnimationTime = fasterAnimalJumps(hound, fox) * fasterAnimalJumpTime // 108 000
let starttime = null

// const animate = (timestamp, elements, jump1, time1, jump2, time2, fasterAnimalJumpDiff) => {
//   let runtime = timestamp
//   let progress = (runtime / time1) % 1
//   progress = Math.min(progress, 1)
//   let progressFast = (runtime / time2) % 1
//   progressFast = Math.min(progressFast, 1)
//   // console.log('runtime', runtime)
//   // console.log('progress', progress)

//   elements.forEach(el => {
//     if (el === foxEl) {
//       if (progress < 0.5) {
//         const top = foxElStartingOffsets.top - parseFloat(jump1 * progress) + 'px'
//         el.style.top = top
//       } else {
//         const top = (foxElStartingOffsets.top - parseFloat(jump1 * 0.5)) + parseFloat(jump1 * progress * 0.5) + 'px'
//         el.style.top = top
//       }
//     } else {
//       if (progressFast < 0.5) {
//         const top = houndElStartingOffsets.top - parseFloat(jump2 * progressFast) + 'px'
//         el.style.top = top
//       } else {
//         const top = (houndElStartingOffsets.top - parseFloat(jump2 * 0.5)) + parseFloat(jump2 * progressFast * 0.5) + 'px'
//         el.style.top = top
//       }

//       const left = parseFloat(el.style.left) || 50 + parseFloat(fasterAnimalJumpDiff * progress) + 'px'
//       el.style.left = left
//     }
//   })

//   console.log('------------')
//   // requestAnimationFrame(timestamp => animate(timestamp, elements, jump1, time1, jump2, time2, fasterAnimalJumpDiff))
// }

// requestAnimationFrame(timestamp => animate(timestamp, [foxEl, houndEl], slowerAnimalJumpHeight, slowerAnimalJumpTime, fasterAnimalJumpHeight, fasterAnimalJumpTime, fasterAnimalVisibleJumpProgress))

let then = Date.now()
let fps = 20
let fpsInterval = 1000 / fps
let now, delta
let jumpNumber = 0

const elements = [foxEl, houndEl]

// [foxEl, houndEl], slowerAnimalJumpHeight, slowerAnimalJumpTime, fasterAnimalJumpHeight, fasterAnimalJumpTime, fasterAnimalVisibleJumpProgress, totalAnimationTime

const animate = () => {

  // make it stop
  if (jumpNumber < fasterAnimalJumps(hound, fox) - 1) {
    requestAnimationFrame(animate)
  }

  // let progress = timestamp / totalDuration
  // progress = Math.min(progress, 1)

  now = Date.now()
  delta = now - then

  if (delta > fpsInterval) {
    then = now - (delta % fpsInterval)

    // animate elements
    elements.forEach(el => {
      if (el === foxEl) {
        const progress = then % slowerAnimalJumpTime
        if (progress <= slowerAnimalJumpTime / 2) {
          const top = foxElStartingOffsets.top - parseFloat(slowerAnimalJumpHeight * (progress / slowerAnimalJumpTime)) + 'px'
          el.style.top = top
        } else {
          const top = foxElStartingOffsets.top - parseFloat(slowerAnimalJumpHeight * 0.5) + parseFloat(slowerAnimalJumpHeight * progress / slowerAnimalJumpTime) + 'px'
          el.style.top = top
        }
      } else {
        const progress = then % fasterAnimalJumpTime
        if (progress <= fasterAnimalJumpTime / 2) {
          const top = houndElStartingOffsets.top - parseFloat(fasterAnimalJumpHeight * (progress / fasterAnimalJumpTime)) + 'px'
          el.style.top = top
        } else {
          const top = houndElStartingOffsets.top - parseFloat(fasterAnimalJumpHeight * 0.5) + parseFloat(fasterAnimalJumpHeight * progress / fasterAnimalJumpTime) + 'px'
          el.style.top = top
        }
      
        const left = houndElStartingOffsets.left + parseFloat(jumpNumber * fasterAnimalVisibleJumpProgress) + parseFloat(fasterAnimalVisibleJumpProgress * progress / fasterAnimalJumpTime) + 'px'
        el.style.left = left

        if (progress >= fasterAnimalJumpTime - fpsInterval) jumpNumber++
      }
    })

  }

}

const startAnimate = () => {
  starttime = Date.now()
  animate()
}

startAnimate()

// requestAnimationFrame(timestamp => animate(timestamp, [foxEl, houndEl], slowerAnimalJumpHeight, slowerAnimalJumpTime, fasterAnimalJumpHeight, fasterAnimalJumpTime, fasterAnimalVisibleJumpProgress, totalAnimationTime))