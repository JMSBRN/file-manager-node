export const toCapitalizeText = (text) => {
  return text.toLowerCase().charAt(0).toUpperCase()+(text.slice(1).toLowerCase());
}
export const greeting  = (username) => console.log(`Welcome to the File Manager, ${toCapitalizeText(username)} !`);
export const goodbye  = (username) => console.log(`Thank you for using File Manager, ${toCapitalizeText(username)} goodbye!`);
export const completer = (line) =>  {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  return [hits.length ? hits : completions, line];
}
