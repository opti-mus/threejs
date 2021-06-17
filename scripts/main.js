import { OrbitControls } from './libs/OrbitControls.js'

window.addEventListener('load', () => {
  let createBtn = document.querySelector('.create-btn')
  let obj

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  renderer.setClearColor(0xdedede)

  let scene = new THREE.Scene()

  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  )
  camera.position.set(0, 0, 1000)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.0)
  dirLight.position.set(0, 0, 1000).normalize()
  scene.add(dirLight)

  const pointLight = new THREE.PointLight(0xffffff, 1.5)
  pointLight.position.set(0, 0, 1000)
  scene.add(pointLight)

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
    if (!data.scale) return false
    let newGeometry = new THREE[data.geometry](1)

    const material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    })
    obj = new THREE.Mesh(newGeometry, material)
    obj.scale.set(data.scale, data.scale, data.scale)
    obj.position.set(0, 0, 100)
    obj.position.set(...randomPosition())
    obj.rotation.set(...randomPosition())

    renderUuid(obj.uuid)
    removeMesh()

    return obj
  }
  function takeValueFromForm() {
    const form = document.querySelector('#config-mesh')

    return {
      geometry: form.figure.value,
      scale: +form.scale.value,
    }
  }
  function randomPosition() {
    let width = window.innerWidth / 2
    let height = window.innerHeight / 2

    let x = randomInteger(-width, width)
    let y = randomInteger(-height, height)
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
  function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand)
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
