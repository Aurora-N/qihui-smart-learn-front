<template>
  <div id="testimonials" class="testimonials-section">
    <div class="container">
      <div class="testimonials-header">
        <h2 class="testimonials-title">热门文章</h2>
        <p class="testimonials-description">
          来看看大家都在看哪些文章
        </p>
      </div>

      <div class="testimonials-grid">
        <div v-for="(testimonial, index) in testimonials" :key="testimonial.name" class="testimonial-card">
          <div class="testimonial-header">
            <img :src="testimonial.image" :alt="testimonial.name" class="testimonial-image" />
            <div class="testimonial-meta">
              <div class="testimonial-name">{{ testimonial.name }}</div>
              <div class="testimonial-role">{{ testimonial.role }}</div>
            </div>
          </div>
          <p class="testimonial-quote">"{{ testimonial.quote }}"</p>
        </div>
      </div>
    </div>

    <!-- Background elements -->
    <div class="testimonials-background">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
    </div>
  </div>
</template>

<script setup>
const testimonials = [
  {
    name: "Sarah Thompson",
    role: "CEO at TechCorp",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "StreamLine has revolutionized our workflow. It's intuitive, powerful, and has significantly boosted our team's productivity.",
  },
  {
    name: "John Davis",
    role: "Marketing Director at GrowthHub",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "The analytics features in StreamLine have provided us with invaluable insights. It's been a game-changer for our marketing strategies.",
  },
  {
    name: "Emily Chen",
    role: "Product Manager at InnovateCo",
    image: "/placeholder.svg?height=400&width=400",
    quote:
      "The collaboration tools in StreamLine have made remote work seamless for our team. It's an essential part of our daily operations now.",
  },
];
</script>

<style scoped>
.testimonials-section {
  position: relative;
  padding: 4rem 0;
  background-color: var(--secondary-color);
  overflow: hidden;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 10;
}

.testimonials-header {
  text-align: center;
  margin-bottom: 4rem;
}

.testimonials-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.testimonials-description {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.testimonial-card {
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.testimonial-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.testimonial-image {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  object-fit: cover;
}

.testimonial-meta {
  margin-left: 1rem;
}

.testimonial-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.testimonial-role {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.testimonial-quote {
  font-style: italic;
  color: var(--text-muted);
}

.testimonials-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
}

.bg-circle-1 {
  top: 25%;
  right: -4rem;
  width: 8rem;
  height: 8rem;
  background-color: rgba(var(--primary-rgb), 0.1);
  animation: float 5s ease-in-out infinite;
}

.bg-circle-2 {
  bottom: 25%;
  left: -4rem;
  width: 6rem;
  height: 6rem;
  background-color: rgba(var(--secondary-rgb), 0.1);
  animation: float-alt 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(1.25rem, -1.25rem);
  }
}

@keyframes float-alt {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-1.875rem, 1.875rem);
  }
}

@media (min-width: 768px) {
  .testimonials-section {
    padding: 6rem 0;
  }
  
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .testimonials-title {
    font-size: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .testimonials-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

