
window.addEventListener('load', () => {
  let width = window.innerWidth
  let height = window.innerHeight
  let canvas = document.getElementById('canvas')
  let createBtn = document.querySelector('.create-btn')

  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)

  let renderer = new THREE.WebGLRenderer({ canvas: canvas })
  renderer.setClearColor(0xdedede)

  let scene = new THREE.Scene()

  let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000)
  camera.position.set(0, 0, 1000)
 
  let light = new THREE.SpotLight()
  light.position.set(-300,300,0)
  light.receiveShadow = true
  scene.add(light)

  createBtn.addEventListener('click', (e) => {
    e.preventDefault()
    scene.add(createMesh(takeValueFromForm()))
  })
  
  function loop() {
    renderer.render(scene, camera)
    requestAnimationFrame(function () {
      loop()
    })
  }
  loop()

  function createMesh(data) {
    if(!data.scale) return false
    let newGeometry = new THREE[data.geometry](1)
    let material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: false,
    })
    let mesh = new THREE.Mesh(newGeometry, material)
    mesh.scale.set(data.scale, data.scale, data.scale)
    mesh.position.set(...randomPosition())
    mesh.rotation.x = randomPosition()[0]
    mesh.rotation.y = randomPosition()[0]
    mesh.castShadow = true
    renderUuid(mesh.uuid)
    removeMesh()

    return mesh
  }
  function takeValueFromForm() {
    const form = document.querySelector('#config-mesh')

    return {
      geometry: form.figure.value,
      scale: +form.scale.value,
    }
  }
  function randomPosition() {
    let width = window.innerWidth
    let height = window.innerHeight
    let x = Math.floor(Math.random() * width - 200)
    let y = Math.floor(Math.random() * height - 200)
    let z = Math.floor(Math.random() * 100)
    return [x, y, z]
  }
  function remove(uuid) {
    const object = scene.getObjectByProperty('uuid', uuid)
    scene.remove(object)
  }
  function renderUuid(uuid) {
    let uuidFields = document.getElementById('uuid-fields')
    let id = `<li>${uuid}<span class='delete-mesh' data-uuid = ${uuid}>&times;</span></li>`
    uuidFields.insertAdjacentHTML('beforeend', id)
  }
  function removeMesh() {
    let uuidFields = document.getElementById('uuid-fields')
    uuidFields.addEventListener('click', (e) => {
      let uuid = e.target.dataset.uuid
      if (uuid) {
        e.target.parentNode.remove()
        remove(uuid)
      }
    })
  }
})
