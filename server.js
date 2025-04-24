require("dotenv").config()

const express = require("express")
const path = require("path")
const nodemailer = require("nodemailer")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.post("/send-email", async (req, res) => {
  const { nome, email, mensagem } = req.body

  // Verificar se os dados necessários foram fornecidos
  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios" })
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Formatar os dados para o email
  let dadosFormatados = ""
  try {
    // Verificar se mensagem é um JSON string
    const dadosCompletos = JSON.parse(mensagem)

    // Formatar todos os dados do formulário para o email
    for (const [chave, valor] of Object.entries(dadosCompletos)) {
      if (Array.isArray(valor)) {
        dadosFormatados += `${chave}: ${valor.join(", ")}\n`
      } else {
        dadosFormatados += `${chave}: ${valor}\n`
      }
    }
  } catch (e) {
    // Se não for um JSON válido, usar a mensagem como está
    dadosFormatados = mensagem
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "juremapreta.ia@gmail.com",
    subject: "Nova inscrição: Nova Era Digital",
    text: `
Nome: ${nome}
Email: ${email}

Dados completos do formulário:
${dadosFormatados}
        `,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: "Email enviado com sucesso!" })
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    res.status(500).json({ error: "Erro ao enviar email", details: error.message })
  }
})

app.post("/send-email-avaliacao", async (req, res) => {
  const mensagem = req.body.mensagem; // Alterado para pegar apenas a mensagem

  const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  },
  });

  const mailOptions = {
  from: process.env.EMAIL_USER,
  to: "juremapreta.ia@gmail.com", // Mesmo email ou outro, se desejar
  subject: "Nova Avaliação: Nova Era Digital",
  text: `
  Dados da Avaliação:
  ${mensagem}
  `,
  };

  try {
  await transporter.sendMail(mailOptions);
  res.status(200).json({ message: "Email de avaliação enviado com sucesso!" });
  } catch (error) {
  console.error("Erro ao enviar email de avaliação:", error);
  res.status(500).json({ error: "Erro ao enviar email de avaliação", details: error.message });
  }
 });

// Rota do quiz
app.get("/quiz", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "quiz.html"))
})

// Rota para a avaliação
app.get("/avaliacao", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "avaliacao.html"))
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
