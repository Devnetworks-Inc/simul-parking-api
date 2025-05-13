const APP_MESSAGES = {
  MONGO_CONNECTED: 'Connected to MongoDB database',
  MONGO_DISCONNECTED: 'Disconnected from MongoDB database',
  MONGO_CONNECTION_FAILED: 'Failed to connect to MongoDB database',
  MONGO_DISCONNECTION_FAILED: 'Error disconnecting from MongoDB database:',
  BOOKING_NOT_FOUND: 'Booking not found',
  INVALID_EMAIL: 'Invalid email',
  PASSWORD_UPDATED_SUCCESSFULLY: 'Password updated successfully',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_NOT_FOUND: "User Not Found",
  PARKING_NOT_FOUND: 'Parking not found',
};

Object.freeze(APP_MESSAGES);

module.exports = APP_MESSAGES;
