import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getSiteDocument,
  normalizeSourceMarkup,
  readSiteSource
} from '../lib/source-page.js';

test('extracts all homepage sections and preserves source metadata', () => {
  const site = getSiteDocument();

  assert.equal(site.lang, 'en-US');
  assert.equal(site.title, 'Gemzie – Just another WordPress site');
  assert.equal(site.sections.length, 10);
  assert.ok(site.bodyClass.includes('elementor-page-8'));
  assert.equal(site.headScripts.length, 13);
});

test('keeps original scripts in order and maps local WordPress assets locally', () => {
  const site = getSiteDocument();

  assert.equal(site.scripts.length, 55);
  assert.equal(site.scripts.filter((script) => script.src).length, 37);
  assert.ok(site.stylesheets
    .filter((stylesheet) => stylesheet.name === 'link')
    .every((stylesheet) => !stylesheet.attribs.href.includes('fonts.googleapis.com')));
  assert.ok(site.scripts
    .filter((script) => script.src)
    .every((script) => script.src.startsWith('/wp-content/') || script.src.startsWith('/wp-includes/')));
});

test('normalizes only site asset URLs and keeps page destinations intact', () => {
  const result = normalizeSourceMarkup([
    'https://gemzie.peacefulqode.in/wp-content/uploads/logo.png',
    'https://gemzie.peacefulqode.in/about-us/',
    '<a href="javascript:void(0)">Open</a>'
  ].join(' '));

  assert.equal(
    result,
    '/wp-content/uploads/logo.png https://gemzie.peacefulqode.in/about-us/ <a href="#">Open</a>'
  );
  assert.ok(readSiteSource().includes('/wp-content/uploads/2024/02/home-banner-h1-01.jpg'));
});
