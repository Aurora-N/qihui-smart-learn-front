<template>
  <header :class="['site-header', isScrolled ? 'scrolled' : '']">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <NuxtLink to="/" class="logo-link">
            <span class="logo-primary">Stream</span>
            <span class="logo-secondary">Line</span>
          </NuxtLink>
        </div>
        <nav class="desktop-nav">
          <NuxtLink v-for="item in menuItems" :key="item.href" :to="item.href" class="nav-link">
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
        <div class="header-actions">
          <button @click="toggleTheme" class="theme-toggle">
            <span v-if="colorMode.value === 'dark'" class="sr-only">Switch to light mode</span>
            <span v-else class="sr-only">Switch to dark mode</span>
            <svg v-if="colorMode.value === 'dark'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
          <NuxtLink to="/login" class="login-btn">Log in</NuxtLink>
          <NuxtLink to="/signup" class="signup-btn">Sign up</NuxtLink>
          <button @click="toggleMenu" class="mobile-menu-btn">
            <span v-if="isMenuOpen" class="sr-only">Close menu</span>
            <span v-else class="sr-only">Open menu</span>
            <svg v-if="isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </div>
    </div>
    <Transition name="fade">
      <div v-if="isMenuOpen" class="mobile-menu">
        <div class="container">
          <div class="mobile-menu-content">
            <NuxtLink 
              v-for="item in menuItems" 
              :key="item.href" 
              :to="item.href" 
              class="mobile-nav-link"
              @click="isMenuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
            <div class="mobile-menu-actions">
              <NuxtLink to="/login" class="mobile-login-btn" @click="isMenuOpen = false">Log in</NuxtLink>
              <NuxtLink to="/signup" class="mobile-signup-btn" @click="isMenuOpen = false">
                Sign up
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useColorMode } from '@nuxtjs/color-mode';

const colorMode = useColorMode();
const isMenuOpen = ref(false);
const isScrolled = ref(false);

const menuItems = [
  { href: '#features', label: 'Features' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#pricing', label: 'Pricing' },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 0.3s ease-in-out;
  background-color: transparent;
}

.site-header.scrolled {
  background-color: var(--background-color-translucent);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo-link {
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
}

.logo-primary {
  color: var(--primary-color);
}

.logo-secondary {
  color: var(--text-color);
}

.desktop-nav {
  display: none;
}

.nav-link {
  position: relative;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.2s ease-in-out;
}

.nav-link:hover {
  color: var(--text-color);
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: var(--primary-color);
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.nav-link:hover::after {
  transform: scaleX(1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--accent-color);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background-color: var(--accent-hover);
}

.login-btn {
  display: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s;
}

.login-btn:hover {
  color: var(--primary-color);
}

.signup-btn {
  display: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary-color);
  background-color: rgba(var(--primary-rgb), 0.1);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.signup-btn:hover {
  background-color: rgba(var(--primary-rgb), 0.2);
}

.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--accent-color);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mobile-menu-btn:hover {
  background-color: var(--accent-hover);
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

.mobile-menu-content {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.mobile-nav-link {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.75rem 1rem;
  transition: color 0.2s;
}

.mobile-nav-link:hover {
  color: var(--text-color);
}

.mobile-menu-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

.mobile-login-btn {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
  text-decoration: none;
  padding: 0.75rem 1rem;
  transition: color 0.2s;
}

.mobile-login-btn:hover {
  color: var(--primary-color);
}

.mobile-signup-btn {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  color: var(--primary-color);
  background-color: rgba(var(--primary-rgb), 0.1);
  padding: 0.75rem 1rem;
  margin: 0 1rem;
  border-radius: 9999px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.mobile-signup-btn:hover {
  background-color: rgba(var(--primary-rgb), 0.2);
}

.mobile-signup-btn .icon {
  margin-left: 0.25rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
    gap: 0.25rem;
  }

  .login-btn,
  .signup-btn {
    display: inline-flex;
  }

  .mobile-menu-btn {
    display: none;
  }
}
</style>

