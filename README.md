# LUXE - Premium Fashion E-commerce Website

A fully functional, modern e-commerce website built with Next.js and TypeScript. Features a beautiful, premium design inspired by Flipkart with local storage as the database.

## ✨ Features

### 🛍️ Shopping Experience
- **Product Catalog**: Browse through a curated collection of premium clothing
- **Advanced Filtering**: Filter by category, price range, and sort by various criteria
- **Search Functionality**: Quick search across all products
- **Product Details**: Comprehensive product pages with size/color selection
- **Wishlist**: Save favorite items for later
- **Shopping Cart**: Full cart management with quantity controls

### 💳 Checkout & Orders
- **Multi-step Checkout**: Contact info, shipping address, and payment method selection
- **Order Management**: View order history and track status
- **Multiple Payment Options**: Cash on Delivery, Card, and UPI
- **Order Confirmation**: Success page with order details

### 🎨 Design Features
- **Premium UI**: Modern gradient designs and smooth animations
- **Responsive**: Fully responsive design for all devices
- **Micro-interactions**: Hover effects and smooth transitions
- **Glassmorphism**: Modern UI effects throughout
- **Custom Scrollbars**: Styled scrollbars matching the theme

### 💾 Data Management
- **Local Storage**: All data persisted in browser local storage
- **12 Sample Products**: Pre-loaded with diverse product catalog
- **Persistent Cart**: Cart items saved across sessions
- **Order History**: Complete order tracking

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
ecommerce/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Footer component
│   └── ProductCard.tsx # Product card component
├── pages/              # Next.js pages
│   ├── index.tsx       # Home page
│   ├── products.tsx    # Products listing
│   ├── cart.tsx        # Shopping cart
│   ├── checkout.tsx    # Checkout page
│   ├── wishlist.tsx    # Wishlist page
│   ├── account.tsx     # User account
│   ├── search.tsx      # Search results
│   ├── order-success.tsx # Order confirmation
│   └── product/
│       └── [id].tsx    # Product detail page
├── styles/             # CSS modules
│   ├── globals.css     # Global styles
│   └── *.module.css    # Component styles
├── utils/              # Utility functions
│   └── storage.ts      # Local storage management
└── public/             # Static assets

```

## 🎯 Key Pages

### Home Page (`/`)
- Hero section with call-to-action
- Featured products grid
- Category cards
- Features showcase
- Newsletter signup

### Products Page (`/products`)
- Filterable product grid
- Category filters
- Price range slider
- Sort options
- Search integration

### Product Detail (`/product/[id]`)
- Large product images
- Size and color selection
- Quantity controls
- Add to cart/wishlist
- Product specifications

### Shopping Cart (`/cart`)
- Cart items with images
- Quantity management
- Price calculations
- Shipping information
- Checkout button

### Checkout (`/checkout`)
- Contact information form
- Shipping address
- Payment method selection
- Order summary
- Order placement

### Account (`/account`)
- Order history
- Order status tracking
- Profile information
- Quick navigation

## 🛠️ Technologies Used

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules with Custom Properties
- **State Management**: React Hooks
- **Data Storage**: Browser Local Storage
- **Fonts**: Google Fonts (Inter)

## 🎨 Design System

### Color Palette
- Primary: Purple gradient (#667eea → #764ba2)
- Secondary: Pink gradient (#f093fb → #f5576c)
- Accent: Cyan gradient (#4facfe → #00f2fe)
- Success: Green gradient (#11998e → #38ef7d)

### Typography
- Font Family: Inter
- Headings: 700-800 weight
- Body: 400-600 weight

### Spacing
- Base unit: 0.5rem (8px)
- Container max-width: 1400px
- Border radius: 8px, 12px, 16px, 24px

## 📱 Responsive Breakpoints

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

## 🔧 Local Storage Schema

### Products
```typescript
Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  description: string
  rating: number
  reviews: number
  inStock: boolean
  sizes: string[]
  colors: string[]
  discount?: number
}
```

### Cart Items
```typescript
CartItem extends Product {
  quantity: number
  selectedSize: string
  selectedColor: string
}
```

### Orders
```typescript
Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  address: Address
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  paymentMethod: string
}
```

## 🌟 Features Highlights

1. **Persistent Shopping Cart**: Cart items are saved in local storage
2. **Real-time Updates**: Cart and wishlist counts update instantly
3. **Smart Filtering**: Multiple filter options with instant results
4. **Smooth Animations**: CSS animations and transitions throughout
5. **SEO Optimized**: Proper meta tags and semantic HTML
6. **Accessibility**: Keyboard navigation and ARIA labels
7. **Performance**: Optimized images and lazy loading

## 🎯 Future Enhancements

- User authentication
- Product reviews and ratings
- Advanced search with autocomplete
- Product recommendations
- Multiple product images
- Size guide
- Live chat support
- Email notifications
- Payment gateway integration
- Admin dashboard

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ using Next.js and TypeScript

---

**Note**: This is a demo e-commerce website using local storage. For production use, implement a proper backend with database and authentication.
