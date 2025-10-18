# GetPayInStore

A modern React Native e-commerce mobile application built with Expo, featuring biometric authentication, custom delete alerts, and a clean medical-themed UI design.

## 🚀 Setup Steps and How to Run

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)
- Physical device or emulator/simulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohamed-khaled-xv/GetPayIn.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on specific platforms**
   ```bash
   # Android
   npm run android
   # or
   npx expo run:android

   # iOS
   npm run ios
   # or
   npx expo run:ios

   # Web
   npm run web
   # or
   npx expo start --web
   ```

### Additional Commands

- **Clear cache and restart**: `npx expo start --clear`
- **Reset project**: `npm run reset-project`
- **Lint code**: `npm run lint`

### Environment Setup
- The app uses DummyJSON API for product data and fake API operations
- No additional environment variables required for basic functionality
- Biometric authentication requires physical device with biometric sensors

## 📱 Category Screen Functionality

**Dynamic Category Selection Screen**

The category screen is designed as a flexible, user-driven interface that allows users to:
- Browse and select from all available product categories
- View real-time product counts for each category
- See filtered products immediately upon category selection
- Switch between different categories seamlessly on the same screen

**Key Features:**
- **Dynamic Category Loading**: Fetches all available categories from DummyJSON API
- **Interactive Selection**: Users can tap any category to filter products
- **Live Product Filtering**: Products update instantly based on selected category
- **Product Count Display**: Shows number of available products per category
- **Unified Interface**: Category selection and product display on single screen
- **Responsive Grid Layout**: Optimized product card display for different screen sizes
- **Optimistic UI Updates**: Smooth deletion experience with immediate visual feedback
- **Custom Delete Alerts**: Professional styling for confirmation dialogs



## 👤 Superadmin User Configuration

**Superadmin Username: `emmaj`**
**Superadmin Username: `emmajpass`**



## ⚖️ Trade-offs and "If I Had More Time"

### Current Trade-offs

#### 1. **Authentication System**
- **Current**: Simulated authentication with local storage
- **Trade-off**: No real backend authentication or JWT tokens
- **Impact**: Simplified development but not production-ready

#### 2. **API Integration**
- **Current**: DummyJSON fake API for demonstrations
- **Trade-off**: Limited real-world data operations
- **Impact**: Perfect for prototyping but needs real backend

#### 3. **State Management**
- **Current**: Redux Toolkit + React Query combination
- **Trade-off**: Slightly complex setup for simple operations
- **Impact**: Robust but potentially over-engineered for current scope

#### 4. **Delete Functionality**
- **Current**: Multiple delete handler implementations (fake, local, optimistic)
- **Trade-off**: Complex architecture for simple operations
- **Impact**: Highly flexible but requires maintenance

### "If I Had More Time" Improvements

#### **Performance Optimizations**
- Implement virtual scrolling for large product lists
- Add image lazy loading and caching
- Optimize bundle size with code splitting
- Add offline-first architecture with sync capabilities
- Implement progressive web app (PWA) features

#### **UI/UX Enhancements**
- Add dark/light theme toggle with system preference detection
- Implement advanced animations with Reanimated 3
- Add skeleton loading states for all components
- Create custom loading indicators matching brand
- Add accessibility features (screen reader support, high contrast)

#### **Testing & Quality**
- Comprehensive unit tests with Jest and React Native Testing Library
- Integration tests for critical user flows
- E2E testing with Detox
- Performance testing and monitoring
- Automated accessibility testing

#### **Backend Integration**
- Real REST API with proper error handling
- GraphQL implementation for efficient data fetching
- File upload functionality for product images
- Real-time data synchronization
- Proper database schema design



## Technology Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **State Management**: Redux Toolkit + React Query
- **Navigation**: React Navigation 7
- **UI Components**: Custom components with Expo Vector Icons
- **Authentication**: Expo Local Authentication (biometric)
- **Storage**: MMKV for high-performance storage
- **API**: Axios with DummyJSON integration
- **Styling**: StyleSheet with custom design system

## 📝 Key Features

- ✅ **Custom Splash Screen** with medical cross branding
- ✅ **Biometric Authentication** with auto-lock functionality
- ✅ **Custom Delete Alerts** with professional styling
- ✅ **Optimistic UI Updates** for smooth user experience
- ✅ **Fake API Integration** with proper error handling
- ✅ **Category-based Product Browsing**
- ✅ **Superadmin Role Management**
- ✅ **Auto-lock Security Feature**
- ✅ **Toast Notifications** for user feedback
- ✅ **Responsive Design** for different screen sizes


