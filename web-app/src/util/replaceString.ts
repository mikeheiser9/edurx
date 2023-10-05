
function replaceStringWithComponents(inputString, pattern, replacements) {
  const parts = inputString.split(pattern);

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      const key = `replacement-${index}`;
      const componentName = part;

      if (replacements[componentName]) {
        const Component = replacements[componentName];
        return <Component/>;
      }

      // If a replacement is not found, return the original part
      return part;
    } else {
      return part;
    }
  });
}

export default replaceStringWithComponents;
