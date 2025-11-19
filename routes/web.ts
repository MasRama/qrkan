import AuthController from "../app/controllers/AuthController"; 
import Auth from "../app/middlewares/auth"
import EventController from "../app/controllers/EventController";
import DashboardController from "../app/controllers/DashboardController";
import ParticipantController from "../app/controllers/ParticipantController";
import TicketController from "../app/controllers/TicketController";
import ScanController from "../app/controllers/ScanController";
import Role from "../app/middlewares/role";
import HomeController from "../app/controllers/HomeController";
import AssetController from "../app/controllers/AssetController";
import S3Controller from "../app/controllers/S3Controller";
import LegalController from "../app/controllers/LegalController";
import HyperExpress from 'hyper-express';
import SeatController from "../app/controllers/SeatController";
import CheckoutController from "../app/controllers/CheckoutController";
import PaymentController from "../app/controllers/PaymentController";

const Route = new HyperExpress.Router();

/**
 * Public Routes
 * These routes are accessible without authentication
 * ------------------------------------------------
 * GET  / - Home page
 */
Route.get("/", HomeController.index);

// Legal pages (used for compliance & payment gateway review)
Route.get("/privacy-policy", LegalController.privacy);
Route.get("/terms-of-service", LegalController.terms);

// Public checkout (dummy payment) routes
Route.get("/events/:id/checkout", CheckoutController.form);
Route.post("/events/:id/checkout", CheckoutController.submit);
Route.get("/checkout/:token/success", CheckoutController.success);

// Tripay payment callback (sandbox/production)
Route.post("/payment/tripay/callback", PaymentController.tripayCallback);

/**
 * S3 Routes
 * Routes for handling S3 operations
 * ------------------------------------------------
 * POST /api/s3/signed-url - Generate signed URL for file upload
 * POST /api/s3/product-image-url - Generate signed URL for product images
 * GET  /api/s3/public-url/:fileKey - Get public URL for existing file
 * GET  /api/s3/health - S3 service health check
 */
Route.post("/api/s3/signed-url", [Auth], S3Controller.getSignedUrl); 
Route.get("/api/s3/public-url/:fileKey", S3Controller.getPublicUrl);
Route.get("/api/s3/health", S3Controller.health);
/**
 * Authentication Routes
 * Routes for handling user authentication
 * ------------------------------------------------
 * GET   /login - Login page
 * POST  /login - Process login
 * GET   /register - Registration page
 * POST  /register - Process registration
 * POST  /logout - Logout user
 * GET   /google/redirect - Google OAuth redirect
 * GET   /google/callback - Google OAuth callback
 */
Route.get("/login", AuthController.loginPage);
Route.post("/login", AuthController.processLogin);
Route.get("/register", AuthController.registerPage);
Route.post("/register", AuthController.processRegister);
Route.post("/logout", AuthController.logout);
Route.get("/google/redirect", AuthController.redirect);
Route.get("/google/callback", AuthController.googleCallback);

/**
 * Password Reset Routes
 * Routes for handling password reset
 * ------------------------------------------------
 * GET   /forgot-password - Forgot password page
 * POST  /forgot-password - Send reset password link
 * GET   /reset-password/:id - Reset password page
 * POST  /reset-password - Process password reset
 */
Route.get("/forgot-password", AuthController.forgotPasswordPage);
Route.post("/forgot-password", AuthController.sendResetPassword);
Route.get("/reset-password/:id", AuthController.resetPasswordPage);
Route.post("/reset-password", AuthController.resetPassword);

Route.get("/tickets/:token", TicketController.download);
Route.post("/scan/verify", [Auth, Role(["gate_operator", "super_admin"])] , TicketController.verify);

/**
 * Protected Routes
 * These routes require authentication
 * ------------------------------------------------
 * GET   /dashboard - Main dashboard (events overview)
 * GET   /home - Legacy user listing dashboard
 * GET   /profile - User profile
 * POST  /change-profile - Update profile
 * POST  /change-password - Change password
 * DELETE /users - Delete users (admin only)
 */
Route.get("/dashboard", [Auth, Role(["super_admin", "organizer"])] , DashboardController.index);
Route.get("/home", [Auth], AuthController.homePage);
Route.get("/profile", [Auth], AuthController.profilePage);
Route.post("/change-profile", [Auth], AuthController.changeProfile);
Route.post("/change-password", [Auth], AuthController.changePassword);
Route.delete("/users", [Auth], AuthController.deleteUsers);

Route.get("/events", [Auth, Role(["super_admin", "organizer"])] , EventController.index);
Route.get("/events/create", [Auth, Role(["super_admin", "organizer"])] , EventController.create);
Route.post("/events", [Auth, Role(["super_admin", "organizer"])] , EventController.store);
Route.get("/events/:id/edit", [Auth, Role(["super_admin", "organizer"])] , EventController.edit);
Route.post("/events/:id", [Auth, Role(["super_admin", "organizer"])] , EventController.update);
Route.post("/events/:id/status", [Auth, Role(["super_admin", "organizer"])] , EventController.changeStatus);
Route.delete("/events/:id", [Auth, Role(["super_admin", "organizer"])] , EventController.destroy);

Route.get("/events/:id/report", [Auth, Role(["super_admin", "organizer"])] , EventController.report);

Route.get("/events/:eventId/participants", [Auth, Role(["super_admin", "organizer"])] , ParticipantController.index);
Route.get("/events/:eventId/participants/create", [Auth, Role(["super_admin", "organizer"])] , ParticipantController.create);
Route.post("/events/:eventId/participants", [Auth, Role(["super_admin", "organizer"])] , ParticipantController.store);
Route.delete("/events/:eventId/participants/:participantId", [Auth, Role(["super_admin", "organizer"])] , ParticipantController.destroy);

Route.get("/events/:eventId/seats", [Auth, Role(["super_admin", "organizer"])] , SeatController.index);
Route.get("/events/:eventId/seats/create", [Auth, Role(["super_admin", "organizer"])] , SeatController.create);
Route.post("/events/:eventId/seats", [Auth, Role(["super_admin", "organizer"])] , SeatController.store);
Route.get("/events/:eventId/seats/:seatId/edit", [Auth, Role(["super_admin", "organizer"])] , SeatController.edit);
Route.post("/events/:eventId/seats/:seatId", [Auth, Role(["super_admin", "organizer"])] , SeatController.update);
Route.delete("/events/:eventId/seats/:seatId", [Auth, Role(["super_admin", "organizer"])] , SeatController.destroy);

Route.get("/events/:eventId/scan", [Auth, Role(["gate_operator", "super_admin"])] , ScanController.page);

/**
 * Static Asset Handling Routes
 * 
 * 1. Dist Assets (/assets/:file)
 * Serves compiled and bundled assets from the dist/assets directory
 * - Handles JavaScript files (*.js) with proper content type
 * - Handles CSS files (*.css) with proper content type
 * - Implements in-memory caching for better performance
 * - Sets long-term browser cache headers (1 year)
 * Example URLs:
 * - /assets/app.1234abc.js
 * - /assets/main.5678def.css
 */
Route.get("/assets/:file", AssetController.distFolder);

/**
 * 2. Public Assets (/*) - Catch-all Route
 * Serves static files from the public directory
 * - Must be the LAST route in the file
 * - Only serves files with allowed extensions
 * - Returns 404 for paths without extensions
 * - Implements security checks against unauthorized access
 * 
 * Allowed file types:
 * - Images: .ico, .png, .jpeg, .jpg, .gif, .svg
 * - Documents: .txt, .pdf
 * - Fonts: .woff, .woff2, .ttf, .eot
 * - Media: .mp4, .webm, .mp3, .wav
 * - Web: .css, .js
 * 
 * Example URLs:
 * - /images/logo.png
 * - /documents/terms.pdf
 * - /fonts/roboto.woff2
 */
Route.get("/public/*", AssetController.publicFolder);

export default Route;