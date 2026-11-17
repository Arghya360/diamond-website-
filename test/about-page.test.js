import assert from 'node:assert/strict';
import test from 'node:test';
import { getSiteDocument, findFirst, findAll } from '../lib/source-page.js';

test('Header and Navigation contain About Us and Home links', () => {
  const site = getSiteDocument();
  const headerNode = findFirst(site.body.children, (node) => node.name === 'header' && node.attribs?.id === 'pt-header');
  assert.ok(headerNode, 'Header node should be found');

  const links = findAll(headerNode.children, (node) => node.name === 'a');
  const aboutLink = links.find((l) => (l.children || []).some((c) => c.data?.includes('About Us')));
  assert.ok(aboutLink, 'About Us link should exist in Header');

  const navNode = findFirst(site.body.children, (node) => node.attribs?.id === 'mega-menu-wrap-primary');
  assert.ok(navNode, 'Mega menu wrap primary should be found');
});

test('Footer contains About Us link', () => {
  const site = getSiteDocument();
  const footerNode = findFirst(site.body.children, (node) => node.name === 'footer' && node.attribs?.id === 'pt-footer');
  assert.ok(footerNode, 'Footer node should be found');

  const links = findAll(footerNode.children, (node) => node.name === 'a');
  const aboutLink = links.find((l) => (l.children || []).some((c) => c.data?.includes('About Us')));
  assert.ok(aboutLink, 'About Us link should exist in Footer');
});
