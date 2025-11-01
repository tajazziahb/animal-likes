const thumbsUp = document.querySelectorAll('.fa-thumbs-up')
const thumbsDown = document.querySelectorAll('.fa-thumbs-down')

Array.from(thumbsUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const card = this.closest('.creatures')
    const name = card.dataset.animalId
    const countEl = card.querySelector('.vote-count')

    console.log('Clicked 👍 for:', name)
    console.log('Found countEl:', countEl)
    console.log('Current number text:', countEl ? countEl.textContent : '(none)')

    fetch('/animals/thumbUp', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
      .then(function (response) {
        if (response.ok) return response.json()
      })
      .then(function (data) {
        console.log('Server returned:', data)
        if (data && typeof data.thumbUp === 'number' && countEl) {
          countEl.textContent = data.thumbUp
          console.log('Updated number to:', data.thumbUp)
        }
      })
      .catch(function (err) {
        console.error('Error:', err)
      })
  })
})

Array.from(thumbsDown).forEach(function (element) {
  element.addEventListener('click', function () {
    const card = this.closest('.creatures')
    const name = card.dataset.animalId
    const countEl = card.querySelector('.vote-count')

    console.log('Clicked 👎 for:', name)
    console.log('Found countEl:', countEl)
    console.log('Current number text:', countEl ? countEl.textContent : '(none)')

    fetch('/animals/thumbDown', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
      .then(function (response) {
        if (response.ok) return response.json()
      })
      .then(function (data) {
        console.log('Server returned:', data)
        if (data && typeof data.thumbUp === 'number' && countEl) {
          countEl.textContent = data.thumbUp
          console.log('Updated number to:', data.thumbUp)
        }
      })
      .catch(function (err) {
        console.error('Error:', err)
      })
  })
})
