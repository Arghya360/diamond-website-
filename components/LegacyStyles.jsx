import { createElement } from 'react';
import { attributesToProps } from 'html-react-parser';

function getTextContent(node) {
  return (node.children ?? []).map((child) => child.data ?? '').join('');
}

export default function LegacyStyles({ resources }) {
  return resources.map((node, index) => {
    const props = attributesToProps(node.attribs ?? {});
    const key = `legacy-style-${index}`;

    if (node.type === 'style') {
      return createElement('style', {
        ...props,
        key,
        dangerouslySetInnerHTML: { __html: getTextContent(node) }
      });
    }

    return createElement('link', { ...props, key });
  });
}
