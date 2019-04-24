export default function (translations) {
  return function (key, vars) {
    return (typeof translations[key] === 'function')
      ? translations[key](vars)
      : translations[key];
  };
}
