# Gift Card Wallet App - Installation Guide

## Complete Package List

Here's the complete list of packages you need to install for the Gift Card Wallet app:

### Production Dependencies

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler @reduxjs/toolkit react-redux @react-native-async-storage/async-storage react-native-vector-icons react-native-paper react-native-linear-gradient react-native-svg
```

### Development Dependencies

```bash
npm install --save-dev typescript @types/react @types/react-native @types/jest @testing-library/react-native @testing-library/jest-native
```

## Step-by-Step Installation

### 1. Create React Native Project

```bash
npx @react-native-community/cli@latest init GiftCardWallet
cd GiftCardWallet
```

### 2. Install All Dependencies

```bash
# Install production dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler @reduxjs/toolkit react-redux @react-native-async-storage/async-storage react-native-vector-icons react-native-paper react-native-linear-gradient react-native-svg

# Install development dependencies
npm install --save-dev typescript @types/react @types/react-native @types/jest @testing-library/react-native @testing-library/jest-native
```

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Android Setup

For Android, you may need to add the following to `android/app/build.gradle`:

```gradle
dependencies {
    implementation "com.facebook.react:react-native:+"
    implementation "androidx.swiperefreshlayout:swiperefreshlayout:1.1.0"
}
```

### 5. Run the Application

**For iOS:**
```bash
npx react-native run-ios
```

**For Android:**
```bash
npx react-native run-android
```

## Package Descriptions

### Navigation
- `@react-navigation/native` - Core navigation library
- `@react-navigation/stack` - Stack navigator for screen transitions
- `@react-navigation/bottom-tabs` - Bottom tab navigator
- `react-native-screens` - Native screen components for better performance
- `react-native-safe-area-context` - Safe area handling for different devices
- `react-native-gesture-handler` - Native gesture handling

### State Management
- `@reduxjs/toolkit` - Modern Redux with simplified setup
- `react-redux` - React bindings for Redux

### Storage
- `@react-native-async-storage/async-storage` - Offline data storage

### UI Components
- `react-native-paper` - Material Design components
- `react-native-linear-gradient` - Gradient effects
- `react-native-svg` - SVG support
- `react-native-vector-icons` - Icon library

### Development Tools
- `typescript` - TypeScript support
- `@types/react` - React type definitions
- `@types/react-native` - React Native type definitions
- `@types/jest` - Jest type definitions
- `@testing-library/react-native` - Testing utilities
- `@testing-library/jest-native` - Jest matchers for React Native

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **iOS build issues**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   ```

3. **Android build issues**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

4. **TypeScript errors**
   ```bash
   npx tsc --noEmit
   ```

### Platform-Specific Setup

#### iOS
- Requires Xcode 12 or later
- iOS 12.4 or later
- CocoaPods for dependency management

#### Android
- Android SDK 31 or later
- Android Studio for development
- Java 11 or later

## Verification

After installation, you can verify everything is working by:

1. Running the app on both platforms
2. Running tests: `npm test`
3. Checking TypeScript: `npx tsc --noEmit`

## Next Steps

Once installation is complete:

1. Copy all the source files from the `src/` directory
2. Update the main `App.tsx` file
3. Run the application
4. Test all features

The app should now be fully functional with all features working as expected! 