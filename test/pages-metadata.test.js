import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const pages = [
  { file: '.next/server/app/index.html', route: '/' },
  { file: '.next/server/app/about-us.html', route: '/about-us' },
  { file: '.next/server/app/contact.html', route: '/contact' },
  { file: '.next/server/app/create-your-own.html', route: '/create-your-own' },
  { file: '.next/server/app/delivery.html', route: '/delivery' },
  { file: '.next/server/app/diamond-guide.html', route: '/diamond-guide' },
  { file: '.next/server/app/diamonds.html', route: '/diamonds' },
  { file: '.next/server/app/diamonds/pink.html', route: '/diamonds/pink' },
  { file: '.next/server/app/diamonds/white.html', route: '/diamonds/white' },
  { file: '.next/server/app/privacy.html', route: '/privacy' },
  { file: '.next/server/app/returns.html', route: '/returns' },
  { file: '.next/server/app/sourcing.html', route: '/sourcing' },
  { file: '.next/server/app/terms.html', route: '/terms' },
  { file: '.next/server/app/why-lab-grown.html', route: '/why-lab-grown' },
];

test('every page title and description says "lab-grown diamonds"', () => {
  for (const { file, route } of pages) {
    assert.ok(fs.existsSync(file), `Page HTML should exist for ${route}`);
    const html = fs.readFileSync(file, 'utf8');

    // Extract title tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    assert.ok(titleMatch, `Title tag should exist in ${route}`);
    const titleText = titleMatch[1].toLowerCase();
    assert.ok(
      titleText.includes('lab-grown diamond') || titleText.includes('lab-grown diamonds'),
      `Title in ${route} ("${titleMatch[1]}") must say "lab-grown diamonds"`
    );

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    assert.ok(descMatch, `Meta description should exist in ${route}`);
    const descText = descMatch[1].toLowerCase();
    assert.ok(
      descText.includes('lab-grown diamond') || descText.includes('lab-grown diamonds'),
      `Description in ${route} ("${descMatch[1]}") must say "lab-grown diamonds"`
    );
  }
});

test('header contains "Get In Touch" button linking to /contact', () => {
  const html = fs.readFileSync('.next/server/app/index.html', 'utf8');
  assert.ok(html.includes('Get In Touch'), 'Header should contain "Get In Touch" button');
  assert.ok(html.includes('href="/contact"'), 'Header button should link to /contact');
});

test('footer contains Delivery, Returns, Privacy, Terms links', () => {
  const html = fs.readFileSync('.next/server/app/index.html', 'utf8');
  assert.ok(html.includes('href="/delivery"'), 'Footer should contain /delivery link');
  assert.ok(html.includes('href="/returns"'), 'Footer should contain /returns link');
  assert.ok(html.includes('href="/privacy"'), 'Footer should contain /privacy link');
  assert.ok(html.includes('href="/terms"'), 'Footer should contain /terms link');
});

test('navigation contains the 6 required top-level items and dropdowns', () => {
  const html = fs.readFileSync('.next/server/app/index.html', 'utf8');
  assert.ok(html.includes('All Diamonds'), 'Nav should contain All Diamonds');
  assert.ok(html.includes('Pink Diamonds'), 'Nav should contain Pink Diamonds');
  assert.ok(html.includes('White Diamonds'), 'Nav should contain White Diamonds');
  assert.ok(html.includes('Create Your Own'), 'Nav should contain Create Your Own');
  assert.ok(html.includes('Why Lab Grown'), 'Nav should contain Why Lab Grown');
  assert.ok(html.includes('Diamond Guide'), 'Nav should contain Diamond Guide');
  assert.ok(html.includes('Sourcing'), 'Nav should contain Sourcing');
  assert.ok(html.includes('About Us'), 'Nav should contain About Us');
  assert.ok(html.includes('Contact'), 'Nav should contain Contact');
});
