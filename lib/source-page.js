import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseDocument } from 'htmlparser2';

const sourcePath = resolve(process.cwd(), 'content', 'homepage.html');
const sourceHost = 'gemzie.peacefulqode.in';

export function normalizeSourceMarkup(markup) {
  return markup
    .replaceAll(`https://${sourceHost}/wp-content/`, '/wp-content/')
    .replaceAll(`http://${sourceHost}/wp-content/`, '/wp-content/')
    .replaceAll(`//${sourceHost}/wp-content/`, '/wp-content/')
    .replaceAll(`https://${sourceHost}/wp-includes/`, '/wp-includes/')
    .replaceAll(`http://${sourceHost}/wp-includes/`, '/wp-includes/')
    .replaceAll(`//${sourceHost}/wp-includes/`, '/wp-includes/')
    .replace(/href=(["'])javascript:void\(0\)\1/gi, 'href="#"');
}

export function readSiteSource() {
  return normalizeSourceMarkup(readFileSync(sourcePath, 'utf8'));
}

export function parseSiteSource(markup = readSiteSource()) {
  return parseDocument(markup, { decodeEntities: true });
}

export function findFirst(nodes, predicate) {
  for (const node of nodes ?? []) {
    if (predicate(node)) {
      return node;
    }

    const nested = findFirst(node.children, predicate);
    if (nested) {
      return nested;
    }
  }

  return null;
}

export function findAll(nodes, predicate, matches = []) {
  for (const node of nodes ?? []) {
    if (predicate(node)) {
      matches.push(node);
    }

    findAll(node.children, predicate, matches);
  }

  return matches;
}

function isTag(node, name) {
  return node?.type === 'tag' && node.name === name;
}

function isTopLevelElementorSection(node) {
  return isTag(node, 'div')
    && node.attribs?.class?.split(/\s+/).includes('elementor-top-section');
}

function getStyleText(node) {
  return (node.children ?? []).map((child) => child.data ?? '').join('');
}

function getScriptEntry(node) {
  return {
    id: node.attribs?.id ?? '',
    type: node.attribs?.type ?? 'text/javascript',
    src: node.attribs?.src ?? '',
    code: getStyleText(node),
    attribs: node.attribs ?? {}
  };
}

function isStylesheetLink(node) {
  return isTag(node, 'link')
    && node.attribs?.rel?.split(/\s+/).includes('stylesheet');
}

function shouldKeepStylesheet(node) {
  const href = node.attribs?.href ?? '';
  return !/^(?:https?:)?\/\/fonts\.googleapis\.com\//.test(href)
    && !href.includes('/themes/gemzie/assets/css/test-data.css');
}

export function getSiteDocument(markup = readSiteSource()) {
  const document = parseSiteSource(markup);
  const html = findFirst(document.children, (node) => isTag(node, 'html'));
  const head = findFirst(document.children, (node) => isTag(node, 'head'));
  const body = findFirst(document.children, (node) => isTag(node, 'body'));

  if (!html || !head || !body) {
    throw new Error('The source homepage must contain html, head, and body elements.');
  }

  const titleNode = findFirst(head.children, (node) => isTag(node, 'title'));
  const stylesheets = findAll(head.children, (node) => (
    node.type === 'style' || (isStylesheetLink(node) && shouldKeepStylesheet(node))
  ));
  const headScripts = findAll(head.children, (node) => node.type === 'script').map(getScriptEntry);
  const scripts = findAll(document.children, (node) => node.type === 'script').map(getScriptEntry);
  const sections = findAll(body.children, isTopLevelElementorSection);

  return {
    document,
    html,
    head,
    body,
    lang: html.attribs?.lang ?? 'en',
    bodyClass: body.attribs?.class ?? '',
    title: titleNode ? getStyleText(titleNode) : '',
    stylesheets,
    headScripts,
    scripts,
    sections
  };
}
