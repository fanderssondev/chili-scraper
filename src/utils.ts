export const cleanHTML = (html: string): string => {
  // Remove all attributes and inline styles
  return html.replace(/<(\w+)(?:\s[^>]*)?>/g, '<$1>');
};
