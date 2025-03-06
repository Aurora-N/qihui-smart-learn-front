<template>
  <div class="cta-section">
    <div class="container">
      <h2 class="cta-title">
        <span class="cta-title-line">Ready to streamline your workflow?</span>
        <span class="cta-title-line">Start your free trial today.</span>
      </h2>
      <p class="cta-description">
        Join thousands of satisfied customers who have transformed their business with StreamLine.
      </p>
      <button class="cta-button">
        Get started for free
      </button>
    </div>
  </div>
</template>

<script setup>
// No additional script needed for this component
</script>

<style scoped>
.cta-section {
  background-color: var(--primary-color);
  padding: 4rem 0;
}

.container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}

.cta-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--primary-foreground);
  margin-bottom: 1rem;
}

.cta-title-line {
  display: block;
}

.cta-title-line:last-child {
  margin-top: 0.5rem;
}

.cta-description {
  font-size: 1.125rem;
  color: rgba(var(--primary-foreground-rgb), 0.9);
  max-width: 36rem;
  margin: 1rem auto 2rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  background-color: var(--background-color);
  color: var(--primary-color);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.cta-button:hover {
  background-color: var(--secondary-color);
}

@media (min-width: 640px) {
  .cta-title {
    font-size: 2.25rem;
  }
  
  .cta-button {
    padding: 0.875rem 2rem;
    font-size: 1.125rem;
  }
}

@media (min-width: 768px) {
  .cta-section {
    padding: 5rem 0;
  }
  
  .cta-title {
    font-size: 2.5rem;
  }
}
</style>

