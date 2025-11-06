document.addEventListener('DOMContentLoaded', () => {
  const uploadImageForm = document.querySelector('#uploadImageForm') 
  if (uploadImageForm) {
    uploadImageForm.addEventListener('submit', (event) => {
      event.preventDefault()

      const formData = new FormData(uploadImageForm) // image upload help from Google

      fetch('/animals', {
        method: 'POST',
        body: formData
      })
        .then((response) => {
          if (!response.ok) return response.text().then((t) => { throw new Error(t || ('HTTP ' + response.status)) })
          return response.json()
        })
        .then((data) => {
          console.log('[main.js] Upload OK:', data)
          window.location.reload(true)
        })
        .catch((err) => {
          console.error('[main.js] Upload failed:', err?.message || err)
          alert('Upload failed: ' + (err.message || err))
        })
    })
  }

  const thumbsUp = document.querySelectorAll('.fa-thumbs-up')
  const thumbsDown = document.querySelectorAll('.fa-thumbs-down')
  const trashIcons = document.querySelectorAll('.fa-trash')

  thumbsUp.forEach((el) => {
    el.addEventListener('click', () => {
      const card = el.closest('.creatures')
      if (!card) return
      const name = card.querySelector('.animal-name')?.textContent.trim()
      const countEl = card.querySelector('.vote-count')
      if (!name) return

      fetch('/animals/thumbUp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        })
      })
        .then((res) => res.ok && res.json())
        .then((data) => {
          if (data && typeof data.thumbUp === 'number' && countEl) countEl.textContent = data.thumbUp
        })
        .catch((err) => console.error(err))
    })
  })

  thumbsDown.forEach((el) => {
    el.addEventListener('click', () => {
      const card = el.closest('.creatures')
      if (!card) return
      const name = card.querySelector('.animal-name')?.textContent.trim()
      const countEl = card.querySelector('.vote-count')
      if (!name) return

      fetch('/animals/thumbDown', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        })
      })
        .then((res) => res.ok && res.json())
        .then((data) => {
          if (data && typeof data.thumbUp === 'number' && countEl) countEl.textContent = data.thumbUp
        })
        .catch((err) => console.error(err))
    })
  })

  trashIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const card = icon.closest('.creatures')
      if (!card) return
      const id = card?.dataset.animalId
      if (!id) return

      fetch(`/animals/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) throw new Error('Delete failed')
          return res.json()
        })
        .then((out) => { if (out?.ok) card.remove() })
        .catch((err) => {
          console.error('Delete error:', err)
          alert('Error deleting animal: ' + err.message)
        })
    })
  })
})