export default function getLang() {
  let lang = navigator.language || navigator.userLanguage

  return lang
}
