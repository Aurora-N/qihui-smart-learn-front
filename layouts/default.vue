<script setup lang="ts">
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';

const footerColumns = [
  {
    title: 'MDN',
    links: [
      { text: 'About', url: '#' },
      { text: 'Blog', url: '#' },
      { text: 'Careers', url: '#' },
      { text: 'Advertise with us', url: '#' }
    ]
  },
  {
    title: 'Support',
    links: [
      { text: 'Product help', url: '#' },
      { text: 'Report an issue', url: '#' }
    ]
  },
  {
    title: 'Our communities',
    links: [
      { text: 'MDN Community', url: '#' },
      { text: 'MDN Forum', url: '#' },
      { text: 'MDN Chat', url: '#' }
    ]
  },
  {
    title: 'Developers',
    links: [
      { text: 'Web Technologies', url: '#' },
      { text: 'Learn Web Development', url: '#' },
      { text: 'MDN Plus', url: '#' },
      { text: 'Hacks Blog', url: '#' }
    ]
  }
]
</script>

<template>
  <div>
    <Navbar />
    <NuxtPage />
    <Footer :columns="footerColumns" />
  </div>
</template>