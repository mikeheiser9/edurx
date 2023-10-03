import React, { HtmlHTMLAttributes } from "react";

interface RenderHTMLProps {
  htmlString: string;
  sanitize?: boolean;
}

const sanitizeHTML = (htmlString: string) => {
  const div = document.createElement("div");
  div.innerHTML = htmlString;

  // Removing any potentially harmful elements and attributes
  const elementsToKeep = ["a", "b", "strong", "i", "em", "u", "p", "br"];
  const attributesToKeep = ["href", "class"];

  function isElementAllowed(node: { tagName: string }) {
    return elementsToKeep.includes(node.tagName.toLowerCase());
  }

  function isAttributeAllowed(attr: { name: string }) {
    return attributesToKeep.includes(attr.name.toLowerCase());
  }

  function cleanNode(node: any) {
    if (!isElementAllowed(node)) {
      node.parentNode.removeChild(node);
    } else {
      for (const attr of node.attributes) {
        if (!isAttributeAllowed(attr)) {
          node.removeAttribute(attr.name);
        }
      }
    }
  }

  const walker = document.createTreeWalker(div, NodeFilter.SHOW_ELEMENT);

  while (walker.nextNode()) {
    cleanNode(walker.currentNode);
  }

  return div.innerHTML;
};

export const RenderHTML: React.FC<RenderHTMLProps> = ({
  htmlString,
  sanitize = false,
}) => {
  const htmlContent = {
    __html: sanitize ? sanitizeHTML(htmlString) : htmlString,
  };

  return <div dangerouslySetInnerHTML={htmlContent} />;
};
