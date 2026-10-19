const NUMBER = '5585991799221'
const MESSAGE = 'Olá, Carlos! Vim pelo seu portfólio. Vamos conversar?'

export function whatsappLink() {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE)}`
}
