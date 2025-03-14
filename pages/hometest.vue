<template>
  <div class="knowledge-graph-app">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <div class="logo-icon-wrapper">
            <Network class="logo-icon" />
          </div>
          <h1>KnowledgeGraph</h1>
        </div>
        <nav class="nav">
          <a href="#features" class="nav-link">Features</a>
          <a href="#use-cases" class="nav-link">Use Cases</a>
          <a href="#explore" class="nav-link">Explore</a>
          <a href="#contact" class="nav-link">Contact</a>
          <button class="btn-outline">Log In</button>
          <button class="btn-primary">Sign Up</button>
        </nav>
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <Menu v-if="!mobileMenuOpen" />
          <X v-else />
        </button>
        <div class="mobile-menu" :class="{ 'open': mobileMenuOpen }">
          <a href="#features" class="mobile-nav-link" @click="closeMobileMenu">Features</a>
          <a href="#use-cases" class="mobile-nav-link" @click="closeMobileMenu">Use Cases</a>
          <a href="#explore" class="mobile-nav-link" @click="closeMobileMenu">Explore</a>
          <a href="#contact" class="mobile-nav-link" @click="closeMobileMenu">Contact</a>
          <div class="mobile-nav-buttons">
            <button class="btn-outline">Log In</button>
            <button class="btn-primary">Sign Up</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="hero-gradient"></div>
        <div class="hero-particles">
          <div v-for="i in 20" :key="i" class="particle" :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            opacity: Math.random() * 0.5 + 0.1
          }">
          </div>
        </div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span>Next Generation Data Intelligence</span>
          </div>
          <h1 class="hero-title">Unlock the Power of <span class="text-gradient">Knowledge Graphs</span></h1>
          <p class="hero-subtitle">Transform complex data into actionable insights with our advanced knowledge graph
            platform. Connect, visualize, and explore relationships to gain deeper understanding.</p>
          <div class="hero-buttons">
            <button class="btn-primary btn-large">
              <span>Get Started</span>
              <ArrowRight class="btn-icon" />
            </button>
            <button class="btn-secondary btn-large">
              <Play class="btn-icon" />
              <span>Watch Demo</span>
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <h4>500+</h4>
              <p>Enterprise Clients</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <h4>99.9%</h4>
              <p>Uptime SLA</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <h4>24/7</h4>
              <p>Expert Support</p>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="graph-visualization">
            <div class="graph-card">
              <div class="graph-card-header">
                <h3>Knowledge Network</h3>
                <div class="graph-controls">
                  <button class="graph-control-btn">
                    <ZoomIn />
                  </button>
                  <button class="graph-control-btn">
                    <ZoomOut />
                  </button>
                  <button class="graph-control-btn">
                    <RefreshCw />
                  </button>
                </div>
              </div>
              <div class="graph-card-content">
                <div v-for="(node, index) in nodes" :key="index" class="node" :class="{ 'node-pulse': index % 3 === 0 }"
                  :style="{ left: node.x + 'px', top: node.y + 'px', backgroundColor: node.color }">
                  <span class="node-label">{{ node.label }}</span>
                </div>
                <svg class="connections">
                  <line v-for="(connection, index) in connections" :key="index" :x1="connection.source.x + 20"
                    :y1="connection.source.y + 20" :x2="connection.target.x + 20" :y2="connection.target.y + 20"
                    class="connection-line" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-companies">
        <div class="container">
          <p>Trusted by innovative companies worldwide</p>
          <div class="company-logos">
            <div class="company-logo">
              <img src="/soyo.png?height=30&width=120" alt="Company Logo" />
            </div>
            <div class="company-logo">
              <img src="/soyo.png?height=30&width=120" alt="Company Logo" />
            </div>
            <div class="company-logo">
              <img src="/soyo.png?height=30&width=120" alt="Company Logo" />
            </div>
            <div class="company-logo">
              <img src="/soyo.png?height=30&width=120" alt="Company Logo" />
            </div>
            <div class="company-logo">
              <img src="/soyo.png?height=30&width=120" alt="Company Logo" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Powerful Features</h2>
          <p class="section-subtitle">Our platform provides everything you need to build, manage, and leverage knowledge
            graphs</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon-wrapper" :style="{ backgroundColor: feature.bgColor }">
              <component :is="feature.icon" class="feature-icon" />
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle">A simple three-step process to transform your data into actionable insights</p>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Connect Your Data</h3>
              <p>Integrate with your existing data sources through our simple API or use our data connectors for popular
                platforms.</p>
            </div>
          </div>
          <div class="step-arrow">
            <ArrowRight />
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Build Relationships</h3>
              <p>Our AI-powered system automatically identifies and establishes meaningful connections between your data
                entities.</p>
            </div>
          </div>
          <div class="step-arrow">
            <ArrowRight />
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Discover Insights</h3>
              <p>Use our advanced visualization and query tools to explore your knowledge graph and uncover valuable
                insights.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Use Cases Section -->
    <section id="use-cases" class="use-cases">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Industry Applications</h2>
          <p class="section-subtitle">Knowledge graphs are transforming how organizations across industries leverage
            their data</p>
        </div>
        <div class="use-cases-tabs">
          <div class="tabs-header">
            <button v-for="(tab, index) in useCaseTabs" :key="index" class="tab-button"
              :class="{ 'active': activeTab === index }" @click="activeTab = index">
              <component :is="tab.icon" class="tab-icon" />
              <span>{{ tab.title }}</span>
            </button>
          </div>
          <div class="tabs-content">
            <div class="tab-panel" v-for="(tab, index) in useCaseTabs" :key="index" v-show="activeTab === index">
              <div class="tab-content">
                <h3>{{ tab.title }}</h3>
                <p>{{ tab.description }}</p>
                <ul class="tab-benefits">
                  <li v-for="(benefit, i) in tab.benefits" :key="i">
                    <Check class="benefit-icon" />
                    <span>{{ benefit }}</span>
                  </li>
                </ul>
                <button class="btn-outline">Learn More</button>
              </div>
              <div class="tab-image">
                <img :src="tab.image" :alt="tab.title" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">What Our Clients Say</h2>
          <p class="section-subtitle">Hear from organizations that have transformed their data strategy with our
            platform</p>
        </div>
        <div class="testimonials-slider">
          <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
            <div class="testimonial-content">
              <div class="testimonial-quote">
                <Quote class="quote-icon" />
                <p>{{ testimonial.quote }}</p>
              </div>
              <div class="testimonial-author">
                <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar" />
                <div class="author-info">
                  <h4>{{ testimonial.name }}</h4>
                  <p>{{ testimonial.title }}, {{ testimonial.company }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="testimonial-dots">
          <button v-for="(_, index) in testimonials" :key="index" class="dot"
            :class="{ 'active': currentTestimonial === index }" @click="currentTestimonial = index"></button>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-background">
        <div class="cta-gradient"></div>
      </div>
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Transform Your Data Strategy?</h2>
          <p>Start building your knowledge graph today and unlock the hidden potential in your data.</p>
          <div class="cta-buttons">
            <button class="btn-primary btn-large">Start Free Trial</button>
            <button class="btn-outline btn-large btn-white">Schedule Demo</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-logo">
            <div class="logo-icon-wrapper">
              <Network class="logo-icon" />
            </div>
            <h3>KnowledgeGraph</h3>
          </div>
          <div class="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Subscribe to our newsletter for the latest updates and insights.</p>
            <div class="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button class="btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
        <div class="footer-content">
          <div class="footer-links">
            <div class="footer-links-column">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Documentation</a>
              <a href="#">API</a>
              <a href="#">Integrations</a>
            </div>
            <div class="footer-links-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Press</a>
              <a href="#">Contact</a>
            </div>
            <div class="footer-links-column">
              <h4>Resources</h4>
              <a href="#">Community</a>
              <a href="#">Tutorials</a>
              <a href="#">Webinars</a>
              <a href="#">Case Studies</a>
              <a href="#">Knowledge Base</a>
            </div>
            <div class="footer-links-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
              <a href="#">GDPR Compliance</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} KnowledgeGraph. All rights reserved.</p>
          <div class="social-links">
            <a href="#" aria-label="Twitter">
              <Twitter />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin />
            </a>
            <a href="#" aria-label="GitHub">
              <Github />
            </a>
            <a href="#" aria-label="YouTube">
              <Youtube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  Network, Menu, X, Database, Search, Zap, GitMerge,
  TrendingUp, Shield, BookOpen, ShoppingBag, Activity,
  Globe, Twitter, Linkedin, Github, Youtube, ArrowRight,
  Play, ZoomIn, ZoomOut, RefreshCw, Check, Quote
} from 'lucide-vue-next';

// Mobile menu state
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

// Knowledge graph visualization data
const nodes = ref([
  { id: 1, label: 'Data', x: 50, y: 50, color: '#0060DF' },
  { id: 2, label: 'Insights', x: 200, y: 30, color: '#0090ED' },
  { id: 3, label: 'Analysis', x: 150, y: 120, color: '#00539F' },
  { id: 4, label: 'Patterns', x: 280, y: 100, color: '#0052c2' },
  { id: 5, label: 'Connections', x: 100, y: 180, color: '#0060DF' },
  { id: 6, label: 'Knowledge', x: 230, y: 200, color: '#0090ED' },
  { id: 7, label: 'Entities', x: 180, y: 250, color: '#00539F' },
  { id: 8, label: 'Relations', x: 300, y: 220, color: '#0052c2' }
]);

const connections = ref([
  { source: nodes.value[0], target: nodes.value[1] },
  { source: nodes.value[0], target: nodes.value[2] },
  { source: nodes.value[2], target: nodes.value[3] },
  { source: nodes.value[0], target: nodes.value[4] },
  { source: nodes.value[4], target: nodes.value[5] },
  { source: nodes.value[1], target: nodes.value[5] },
  { source: nodes.value[3], target: nodes.value[5] },
  { source: nodes.value[5], target: nodes.value[6] },
  { source: nodes.value[5], target: nodes.value[7] },
  { source: nodes.value[6], target: nodes.value[7] }
]);

// Features data
const features = ref([
  {
    icon: Database,
    title: 'Semantic Relationships',
    description: 'Connect data points with meaningful relationships that represent real-world connections and context.',
    bgColor: 'rgba(0, 96, 223, 0.1)'
  },
  {
    icon: Search,
    title: 'Advanced Querying',
    description: 'Perform complex queries across interconnected data to discover hidden patterns and insights.',
    bgColor: 'rgba(0, 144, 237, 0.1)'
  },
  {
    icon: Zap,
    title: 'Real-time Analysis',
    description: 'Analyze and visualize data relationships in real-time to make informed decisions quickly.',
    bgColor: 'rgba(0, 83, 159, 0.1)'
  },
  {
    icon: GitMerge,
    title: 'Flexible Integration',
    description: 'Easily integrate with existing data sources and systems to create a unified knowledge base.',
    bgColor: 'rgba(0, 96, 223, 0.1)'
  },
  {
    icon: TrendingUp,
    title: 'Predictive Insights',
    description: 'Leverage graph algorithms to predict trends and make data-driven forecasts.',
    bgColor: 'rgba(0, 144, 237, 0.1)'
  },
  {
    icon: Shield,
    title: 'Data Governance',
    description: 'Maintain data quality and lineage with built-in governance and security features.',
    bgColor: 'rgba(0, 83, 159, 0.1)'
  }
]);

// Use cases tabs
const activeTab = ref(0);
const useCaseTabs = ref([
  {
    icon: BookOpen,
    title: 'Research & Academia',
    description: 'Knowledge graphs are revolutionizing how researchers connect and discover information across disciplines, enabling breakthrough discoveries and collaborations.',
    benefits: [
      'Connect research papers, authors, and concepts',
      'Discover cross-disciplinary insights',
      'Accelerate literature reviews and meta-analyses',
      'Identify emerging research trends'
    ],
    image: '/soyo.png?height=300&width=400'
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce',
    description: 'Transform your customer experience with intelligent product recommendations and personalized shopping journeys powered by knowledge graphs.',
    benefits: [
      'Enhance product recommendations',
      'Create personalized shopping experiences',
      'Optimize inventory management',
      'Improve search relevance and discovery'
    ],
    image: '/soyo.png?height=300&width=400'
  },
  {
    icon: Activity,
    title: 'Healthcare',
    description: 'Knowledge graphs are helping healthcare providers deliver better patient outcomes by connecting medical data across systems and providing comprehensive insights.',
    benefits: [
      'Link patient data, treatments, and outcomes',
      'Improve diagnosis accuracy',
      'Accelerate drug discovery',
      'Enable personalized treatment plans'
    ],
    image: '/soyo.png?height=300&width=400'
  },
  {
    icon: Globe,
    title: 'Enterprise Knowledge',
    description: 'Unify your organization\'s knowledge assets and enable smarter decision-making with enterprise-wide knowledge graphs.',
    benefits: [
      'Create a unified view of organizational knowledge',
      'Break down data silos between departments',
      'Improve knowledge discovery and sharing',
      'Enhance employee onboarding and training'
    ],
    image: '/soyo.png?height=300&width=400'
  }
]);

// Testimonials
const currentTestimonial = ref(0);
const testimonials = ref([
  {
    quote: "Implementing KnowledgeGraph's platform transformed how we understand our research data. We've discovered connections that were previously invisible and accelerated our innovation pipeline by 40%.",
    name: "Dr. Sarah Chen",
    title: "Chief Research Officer",
    company: "BioTech Innovations",
    avatar: "/soyo.png?height=60&width=60"
  },
  {
    quote: "The insights we've gained from our knowledge graph have directly contributed to a 28% increase in customer engagement and a 15% boost in average order value. The ROI has been exceptional.",
    name: "Michael Rodriguez",
    title: "VP of Digital Strategy",
    company: "Global Retail Inc.",
    avatar: "/soyo.png?height=60&width=60"
  },
  {
    quote: "Knowledge graphs have become the backbone of our data strategy. The platform's intuitive interface and powerful capabilities have made it accessible to teams across our organization.",
    name: "Jennifer Park",
    title: "Chief Data Officer",
    company: "Enterprise Solutions",
    avatar: "/soyo.png?height=60&width=60"
  }
]);

// Animation for the knowledge graph visualization
let animationFrame = null;

const animateNodes = () => {
  nodes.value = nodes.value.map(node => {
    return {
      ...node,
      x: node.x + Math.sin(Date.now() * 0.001 + node.id) * 0.5,
      y: node.y + Math.cos(Date.now() * 0.001 + node.id) * 0.5
    };
  });
  animationFrame = requestAnimationFrame(animateNodes);
};

onMounted(() => {
  animationFrame = requestAnimationFrame(animateNodes);

  // Auto-rotate testimonials
  const testimonialInterval = setInterval(() => {
    currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.value.length;
  }, 5000);

  // Cleanup function
  onUnmounted(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    clearInterval(testimonialInterval);
  });
});
</script>

<style scoped>
/* Base styles */
:root {
  --primary-color: #0060DF;
  --primary-light: #0090ED;
  --primary-dark: #00539F;
  --primary-gradient: linear-gradient(135deg, #0060DF, #0090ED);
  --secondary-color: #0052c2;
  --accent-color: #00B3F4;
  --text-color: #1A2B42;
  --text-light: #4A5568;
  --text-lighter: #718096;
  --background-color: #ffffff;
  --background-alt: #F8FAFC;
  --background-dark: #1A2B42;
  --border-color: #E2E8F0;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --radius-sm: 0.25rem;
  --radius: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: var(--background-color);
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

a {
  text-decoration: none;
  color: var(--text-color);
  transition: color 0.3s ease;
}

a:hover {
  color: var(--primary-color);
}

button {
  cursor: pointer;
  font-family: inherit;
}

.btn-primary,
.btn-secondary,
.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: var(--radius);
  transition: all 0.3s ease;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  border: none;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: white;
  color: var(--primary-color);
  border: none;
  box-shadow: var(--shadow);
}

.btn-secondary:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.btn-outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-outline:hover {
  background-color: rgba(0, 96, 223, 0.05);
}

.btn-white {
  color: white;
  border-color: white;
}

.btn-white:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--text-light);
  max-width: 700px;
  margin: 0 auto;
}

.text-gradient {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Header styles */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: var(--shadow);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow);
}

.logo-icon {
  color: white;
  width: 1.5rem;
  height: 1.5rem;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-weight: 500;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-gradient);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 5rem;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  flex-direction: column;
  transform: translateY(-1rem);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  border-radius: 0 0 var(--radius) var(--radius);
  z-index: 1000;
}

.mobile-menu.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-nav-link {
  display: block;
  padding: 1rem;
  font-weight: 500;
  border-radius: var(--radius);
  transition: all 0.3s ease;
}

.mobile-nav-link:hover {
  background-color: var(--background-alt);
  color: var(--primary-color);
}

.mobile-nav-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Hero section styles */
.hero {
  padding: 10rem 0 5rem;
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 10% 10%, rgba(0, 96, 223, 0.05), transparent 30%),
    radial-gradient(circle at 90% 90%, rgba(0, 144, 237, 0.05), transparent 30%);
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background-color: var(--primary-color);
  animation: float 15s infinite ease-in-out;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0) translateX(0);
  }

  25% {
    transform: translateY(-20px) translateX(10px);
  }

  50% {
    transform: translateY(0) translateX(20px);
  }

  75% {
    transform: translateY(20px) translateX(10px);
  }
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content {
  max-width: 36rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgba(0, 96, 223, 0.1);
  border-radius: var(--radius-full);
  margin-bottom: 1.5rem;
}

.hero-badge span {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-color);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-light);
  margin-bottom: 2.5rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.hero-stats {
  display: flex;
  align-items: center;
}

.stat {
  text-align: center;
}

.stat h4 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.stat p {
  font-size: 0.875rem;
  color: var(--text-light);
}

.stat-divider {
  width: 1px;
  height: 2.5rem;
  background-color: var(--border-color);
  margin: 0 1.5rem;
}

.hero-visual {
  position: relative;
}

.graph-visualization {
  position: relative;
  width: 100%;
  height: 100%;
}

.graph-card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.graph-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.graph-card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

.graph-controls {
  display: flex;
  gap: 0.5rem;
}

.graph-control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background-color: white;
  color: var(--text-light);
  transition: all 0.3s ease;
}

.graph-control-btn:hover {
  background-color: var(--background-alt);
  color: var(--primary-color);
}

.graph-card-content {
  position: relative;
  height: 400px;
  padding: 1.5rem;
  background-color: var(--background-alt);
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.connection-line {
  stroke: var(--primary-color);
  stroke-width: 2;
  stroke-dasharray: 5, 5;
  opacity: 0.6;
}

.node {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  z-index: 2;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.node-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 96, 223, 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(0, 96, 223, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(0, 96, 223, 0);
  }
}

.node-label {
  position: absolute;
  white-space: nowrap;
  top: -25px;
  font-size: 0.75rem;
  color: var(--text-color);
  font-weight: 500;
  background-color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.hero-companies {
  margin-top: 5rem;
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
}

.hero-companies p {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-lighter);
  margin-bottom: 2rem;
}

.company-logos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.company-logo {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.company-logo:hover {
  opacity: 1;
}

/* Features section styles */
.features {
  padding: 8rem 0;
  background-color: var(--background-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.feature-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
}

.feature-icon {
  color: var(--primary-color);
  width: 1.75rem;
  height: 1.75rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--text-light);
}

/* How It Works section */
.how-it-works {
  padding: 8rem 0;
  background-color: var(--background-alt);
}

.steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1000px;
  margin: 0 auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 250px;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: var(--primary-gradient);
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: var(--radius-full);
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.step-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.step-content p {
  color: var(--text-light);
}

.step-arrow {
  color: var(--primary-color);
}

/* Use Cases section */
.use-cases {
  padding: 8rem 0;
  background-color: var(--background-color);
}

.use-cases-tabs {
  max-width: 1000px;
  margin: 0 auto;
}

.tabs-header {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-weight: 500;
  color: var(--text-light);
  transition: all 0.3s ease;
}

.tab-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: var(--shadow);
}

.tab-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.tab-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.tab-content h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.tab-content p {
  color: var(--text-light);
  margin-bottom: 2rem;
}

.tab-benefits {
  list-style: none;
  margin-bottom: 2rem;
}

.tab-benefits li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.benefit-icon {
  color: var(--primary-color);
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.tab-image img {
  width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

/* Testimonials section */
.testimonials {
  padding: 8rem 0;
  background-color: var(--background-alt);
}

.testimonials-slider {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  overflow-x: hidden;
}

.testimonial-card {
  flex: 0 0 100%;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease;
}

.testimonial-content {
  padding: 2.5rem;
}

.testimonial-quote {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 2rem;
}

.quote-icon {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--primary-color);
  opacity: 0.3;
}

.testimonial-quote p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--text-color);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.author-info h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.author-info p {
  font-size: 0.875rem;
  color: var(--text-light);
}

.testimonial-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: var(--radius-full);
  background-color: var(--border-color);
  border: none;
  transition: all 0.3s ease;
}

.dot.active {
  background-color: var(--primary-color);
  transform: scale(1.2);
}

/* CTA section */
.cta {
  padding: 8rem 0;
  position: relative;
  overflow: hidden;
}

.cta-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.cta-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary-gradient);
}

.cta-content {
  text-align: center;
  color: white;
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.cta-content p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Footer styles */
.footer {
  padding: 5rem 0 2rem;
  background-color: var(--background-dark);
  color: white;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-logo h3 {
  font-size: 1.5rem;
  font-weight: 700;
}

.footer-newsletter {
  max-width: 400px;
}

.footer-newsletter h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-newsletter p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: inherit;
}

.newsletter-form input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.footer-content {
  margin-bottom: 3rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.footer-links-column h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.footer-links-column a {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.footer-links-column a:hover {
  color: white;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.7);
}

.social-links {
  display: flex;
  gap: 1.5rem;
}

.social-links a {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: white;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .hero-title {
    font-size: 3rem;
  }

  .steps {
    flex-direction: column;
    gap: 3rem;
  }

  .step-arrow {
    transform: rotate(90deg);
    margin: 1rem 0;
  }
}

@media (max-width: 1024px) {
  .hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-content {
    margin: 0 auto;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-visual {
    margin-top: 3rem;
  }

  .footer-top {
    flex-direction: column;
    gap: 3rem;
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }

  .tab-panel {
    grid-template-columns: 1fr;
  }

  .tab-image {
    order: -1;
  }
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-menu {
    display: flex;
  }

  .section-title {
    font-size: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .cta-content h2 {
    font-size: 2.5rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .hero-buttons {
    flex-direction: column;
    width: 100%;
  }

  .hero-stats {
    flex-direction: column;
    gap: 2rem;
  }

  .stat-divider {
    display: none;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .footer-links {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .tabs-header {
    flex-direction: column;
  }
}
</style>