// app.d.ts
import 'expo-router';

declare module 'expo-router' {
  interface RootStackParamList {
    // Each file in your app folder becomes a route.
    // For example:
    "/": undefined;         // Home (app/index.tsx)
    "/signin": undefined;   // Sign In (app/signin.tsx)
    "/signup": undefined;   // Sign Up (app/signup.tsx)
    // Add additional routes as needed:
    "/product/[id]": { id: string }; // Product details screen with a dynamic id parameter
    "/cart": undefined;
    "/profile": undefined;
  }
}
