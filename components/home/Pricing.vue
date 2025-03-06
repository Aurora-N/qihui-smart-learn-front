<template>
  <div id="pricing" class="pricing-section">
    <div class="container">
      <div class="pricing-header">
        <h2 class="pricing-title">Simple, transparent pricing</h2>
        <p class="pricing-description">Choose the plan that's right for your business</p>
      </div>

      <div class="pricing-grid">
        <div v-for="(plan, index) in plans" :key="plan.name" class="pricing-card">
          <div class="pricing-card-header">
            <h3 class="plan-name">{{ plan.name }}</h3>
            <p class="plan-price">{{ plan.price }}</p>
            <p class="plan-billing">
              {{ plan.name === "Enterprise" ? "Contact us for pricing" : "per month" }}
            </p>
            <button class="btn btn-primary btn-full">
              {{ plan.name === "Enterprise" ? "Contact sales" : "Get started" }}
            </button>
          </div>
          <div class="pricing-card-features">
            <h4 class="features-heading">What's included</h4>
            <ul class="features-list">
              <li v-for="feature in plan.features" :key="feature" class="feature">
                <span class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span class="feature-text">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Background elements -->
    <div class="pricing-background">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
    </div>
  </div>
</template>

<script setup>
const plans = [
  {
    name: "Starter",
    price: "$29",
    features: ["5 team members", "Basic analytics", "24/7 support", "10GB storage"],
  },
  {
    name: "Professional",
    price: "$99",
    features: [
      "Unlimited team members",
      "Advanced analytics",
      "Priority support",
      "100GB storage",
      "Custom integrations",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited everything",
      "Dedicated account manager",
      "Custom feature development",
      "On-premise deployment option",
    ],
  },
];
</script>

<style scoped>
.pricing-section {
  position: relative;
  padding: 4rem 0;
  background-color: var(--background-color);
  overflow: hidden;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 10;
}

.pricing-header {
  text-align: center;
  margin-bottom: 4rem;
}

.pricing-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.pricing-description {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.pricing-card {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--background-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.pricing-card-header {
  padding: 1.5rem;
}

.plan-name {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-color);
}

.plan-price {
  margin-top: 1rem;
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-color);
}

.plan-billing {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--primary-foreground);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-full {
  width: 100%;
  margin-top: 1.5rem;
}

.pricing-card-features {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.features-heading {
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1rem;
}

.feature {
  display: flex;
  align-items: flex-start;
}

.feature-icon {
  flex-shrink: 0;
  color: #10b981; /* Green color for check icons */
  width: 1.5rem;
  height: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.feature-icon .icon {
  width: 1.25rem;
  height: 1.25rem;
}

.feature-text {
  margin-left: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.pricing-background {
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
  top: -25%;
  left: -25%;
  width: 50%;
  height: 50%;
  background-color: rgba(var(--primary-rgb), 0.1);
  animation: rotate 15s linear infinite, scale 15s ease-in-out infinite;
}

.bg-circle-2 {
  bottom: -25%;
  right: -25%;
  width: 50%;
  height: 50%;
  background-color: rgba(var(--secondary-rgb), 0.1);
  animation: rotate-reverse 20s linear infinite, scale 20s ease-in-out infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate-reverse {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@media (min-width: 768px) {
  .pricing-section {
    padding: 6rem 0;
  }
  
  .pricing-title {
    font-size: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .pricing-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

