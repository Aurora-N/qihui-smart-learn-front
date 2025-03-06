<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <h3 class="footer-heading">Product</h3>
          <ul class="footer-links">
            <li v-for="link in productLinks" :key="link.label">
              <NuxtLink :to="link.href" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="footer-column">
          <h3 class="footer-heading">Company</h3>
          <ul class="footer-links">
            <li v-for="link in companyLinks" :key="link.label">
              <NuxtLink :to="link.href" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="footer-column">
          <h3 class="footer-heading">Legal</h3>
          <ul class="footer-links">
            <li v-for="link in legalLinks" :key="link.label">
              <NuxtLink :to="link.href" class="footer-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="social-links">
          <NuxtLink v-for="social in socialLinks" :key="social.label" :to="social.href" class="social-link" :aria-label="social.label">
            <component :is="social.icon" />
          </NuxtLink>
        </div>
        <p class="copyright">
          &copy; {{ new Date().getFullYear() }} StreamLine, Inc. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { h } from 'vue';

// Define icon components
const FacebookIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', { d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' })
]);

const TwitterIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', { d: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' })
]);

const InstagramIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('rect', { x: '2', y: '2', width: '20', height: '20', rx: '5', ry: '5' }),
  h('path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' }),
  h('line', { x1: '17.5', y1: '6.5', x2: '17.51', y2: '6.5' })
]);

const LinkedinIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' }),
  h('rect', { x: '2', y: '9', width: '4', height: '12' }),
  h('circle', { cx: '4', cy: '4', r: '2' })
]);

const productLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#', label: 'Integrations' },
  { href: '#', label: 'API' },
];

const companyLinks = [
  { href: '#', label: 'About' },
  { href: '#', label: 'Blog' },
  { href: '#', label: 'Careers' },
  { href: '#', label: 'Press' },
];

const legalLinks = [
  { href: '#', label: 'Privacy' },
  { href: '#', label: 'Terms' },
  { href: '#', label: 'Cookie Policy' },
];

const socialLinks = [
  { href: '#', label: 'Facebook', icon: FacebookIcon },
  { href: '#', label: 'Twitter', icon: TwitterIcon },
  { href: '#', label: 'Instagram', icon: InstagramIcon },
  { href: '#', label: 'LinkedIn', icon: LinkedinIcon },
];
</script>

<style scoped>
.footer {
  background-color: var(--background-color);
  border-top: 1px solid var(--border-color);
  padding: 3rem 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.footer-heading {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  display: block;
  font-size: 1rem;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.5rem 0;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--text-color);
}

.footer-bottom {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.social-links {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.social-link {
  color: var(--text-muted);
  transition: color 0.2s;
}

.social-link:hover {
  color: var(--text-color);
}

.copyright {
  font-size: 0.875rem;
  color: var(--text-muted);
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .social-links {
    margin-bottom: 0;
    order: 2;
  }
  
  .copyright {
    order: 1;
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>

