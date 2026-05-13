const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = 3002
const JWT_SECRET = 'mon-secret-super-secret-a-changer-en-prod'

app.use(cors())
app.use(express.json())

const users = [
  { id: 1, login: 'admin', password: bcrypt.hashSync('admin', 10) },
]
let nextUserId = 2

const contacts = [
  { id: 1, nom: 'Jean Dupont', email: 'jean.dupont@mail.com', telephone: '0612345678' },
  { id: 2, nom: 'Marie Martin', email: 'marie.martin@mail.com', telephone: '0623456789' },
  { id: 3, nom: 'Paul Bernard', email: 'paul.bernard@mail.com', telephone: '0634567890' },
  { id: 4, nom: 'Sophie Petit', email: 'sophie.petit@mail.com', telephone: '0645678901' },
  { id: 5, nom: 'Luc Moreau', email: 'luc.moreau@mail.com', telephone: '0656789012' },
]
let nextId = 6

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' })
  }
}

app.post('/register', async (req, res) => {
  const { login, password } = req.body
  if (!login || !password) {
    return res.status(400).json({ error: 'Login et mot de passe requis' })
  }
  if (users.find((u) => u.login === login)) {
    return res.status(400).json({ error: 'Login déjà utilisé' })
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = { id: nextUserId++, login, password: hashedPassword }
  users.push(newUser)
  res.status(201).json({ id: newUser.id, login: newUser.login })
})

app.post('/login', async (req, res) => {
  const { login, password } = req.body
  const user = users.find((u) => u.login === login)
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides' })
  }
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return res.status(401).json({ error: 'Identifiants invalides' })
  }
  const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, {
    expiresIn: '24h',
  })
  res.json({ token, user: { id: user.id, login: user.login } })
})

app.get('/contacts', authMiddleware, (req, res) => {
  res.json(contacts)
})

app.post('/contacts', authMiddleware, (req, res) => {
  const newContact = { id: nextId++, ...req.body }
  contacts.push(newContact)
  res.status(201).json(newContact)
})

app.put('/contacts/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id)
  const index = contacts.findIndex((c) => c.id === id)
  if (index === -1) return res.status(404).json({ error: 'Contact not found' })
  contacts[index] = { ...contacts[index], ...req.body }
  res.json(contacts[index])
})

app.delete('/contacts/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id)
  const index = contacts.findIndex((c) => c.id === id)
  if (index === -1) return res.status(404).json({ error: 'Contact not found' })
  contacts.splice(index, 1)
  res.status(204).send()
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
