# TripNxt Navigation Flow

## Navigation Structure

### Stack Organization:

- **AccomodationStack**: Main accommodation flow (Home → Filter → Results → Details → Booking)
- **ProfileStack**: User profile and related screens (Profile, MyBookings, Wishlists, Notifications, Chat)
- **AppStack**: Shared screens accessible from anywhere
- **BottomStack**: Tab navigation (Hotel, Food, Car Hire, Profile)

## Main Booking Flow

### 1. **AccomodationHome** (Home Screen)

**Navigation From:**

- Initial screen when app opens
- From bottom tab "Hotel"

**Navigate To:**

- `AdvancedFilter` - When user clicks search/filter
- `Recommended` - When user searches
- `Wishlists` - When user clicks wishlist icon
- `MyBookings` - When user clicks bookings icon
- `Profile` - When user clicks profile icon
- `Notifications` - When user clicks notification icon

**Implementation:**

```typescript
// To AdvancedFilter
navigation.navigate('AdvancedFilter');

// To Recommended
navigation.navigate('Recommended');

// To Wishlists
navigation.navigate('Wishlists');

// To MyBookings
navigation.navigate('MyBookings');

// To Profile
navigation.navigate('Profile');

// To Notifications
navigation.navigate('Notifications');
```

### 2. **AdvancedFilter** (Filter Screen)

**Navigation From:**

- `AccomodationHome` (search/filter button)

**Navigate To:**

- `Recommended` - After applying filters and clicking "Search Now"
- Back to `AccomodationHome`

**Implementation:**

```typescript
// After search
navigation.navigate('Recommended', { filters: filterData });
```

### 3. **Recommended** (Search Results)

**Navigation From:**

- `AccomodationHome` (search results)
- `AdvancedFilter` (after filter search)

**Navigate To:**

- `HotelDetails` - When user clicks on a hotel card
- Back to `AccomodationHome` or `AdvancedFilter`

**Implementation:**

```typescript
// To HotelDetails
navigation.navigate('HotelDetails', { hotelId: hotel.id });
```

### 4. **HotelDetails** (Hotel Details Screen)

**Navigation From:**

- `Recommended` (hotel card click)
- `MyBookings` (booking card click)
- `Wishlists` (wishlist card click)

**Navigate To:**

- `CalenderBooking` - When user clicks "Book Now" button
- `RealtorProfile` - When user clicks host/realtor profile
- `Wishlists` - When user adds to wishlist
- `Chat` - When user wants to message host
- Back to `Recommended`, `MyBookings`, or `Wishlists`

**Implementation:**

```typescript
// To CalenderBooking
navigation.navigate('CalenderBooking', { hotelId: hotel.id });

// To RealtorProfile
navigation.navigate('RealtorProfile', { realtorId: hotel.realtorId });

// To Chat
navigation.navigate('Chat', {
  contactName: hotel.realtorName,
  contactId: hotel.realtorId,
});
```

### 5. **CalenderBooking** (Date Selection)

**Navigation From:**

- `HotelDetails` (Book Now button)

**Navigate To:**

- `Checkout` - When user clicks "Check Availability" button
- Back to `HotelDetails`

**Implementation:**

```typescript
// To Checkout
navigation.navigate('Checkout', {
  hotelId: hotelId,
  checkIn: selectedCheckIn,
  checkOut: selectedCheckOut,
});
```

### 6. **Checkout** (Booking Checkout)

**Navigation From:**

- `CalenderBooking` (Check Availability button)

**Navigate To:**

- `TripDetails` - When user clicks "Complete Booking" button
- Back to `CalenderBooking`

**Implementation:**

```typescript
// To TripDetails
navigation.navigate('TripDetails', { bookingId: booking.id });
```

### 7. **TripDetails** (Trip Confirmation)

**Navigation From:**

- `Checkout` (Complete Booking button)
- `MyBookings` (booking card click)

**Navigate To:**

- `ThankYouScreen` - After booking confirmation
- `MyBookings` - View all bookings
- Back to `Checkout` or `MyBookings`

**Implementation:**

```typescript
// To ThankYouScreen
navigation.navigate('ThankYouScreen', { bookingId: booking.id });

// To MyBookings
navigation.navigate('MyBookings');
```

### 8. **ThankYouScreen** (Thank You Screen)

**Navigation From:**

- `TripDetails` (after confirmation)

**Navigate To:**

- `AccomodationHome` - Continue browsing
- `MyBookings` - View bookings
- Back to `TripDetails`

## Side Navigation Flows

### Profile Flow

- **Profile** (User Profile)
  - Navigate to: `MyBookings`, `Wishlists`, `Notifications`, `Chat`
  - Back to: `AccomodationHome`

### Messages Flow

- **Chat** (Messages Screen)
  - Navigate from: `Profile`, `RealtorProfile`, `HotelDetails`
  - Back to: Previous screen

### Bookings Flow

- **MyBookings** (My Bookings)
  - Navigate to: `TripDetails` (on booking card press)
  - Navigate to: `HotelDetails` (on hotel card press)
  - Back to: `AccomodationHome` or `Profile`

### Wishlist Flow

- **Wishlists** (Wishlist Screen)
  - Navigate to: `HotelDetails` (on card press)
  - Back to: `AccomodationHome` or `Profile`

### Realtor Profile Flow

- **RealtorProfile** (Host/Realtor Profile)
  - Navigate to: `Chat` (Message button)
  - Navigate to: `HotelDetails` (on property card)
  - Back to: `HotelDetails`

### Notifications Flow

- **Notifications** (Notifications Screen)
  - Navigate to: `HotelDetails`, `MyBookings`, `Chat` (from notification)
  - Back to: `AccomodationHome` or `Profile`

## Navigation Implementation

### Screen Navigation Examples:

```typescript
// From Home to AdvancedFilter
navigation.navigate('AdvancedFilter');

// From HotelDetails to CalenderBooking
navigation.navigate('CalenderBooking', { hotelId: '123' });

// From CalenderBooking to Checkout
navigation.navigate('Checkout', {
  checkIn: '2024-01-15',
  checkOut: '2024-01-17',
  hotelId: '123',
});

// From Checkout to TripDetails
navigation.navigate('TripDetails', { bookingId: '456' });

// From Profile to Chat
navigation.navigate('Chat', {
  contactName: 'Henry Willson',
  contactId: '789',
});
```

## Tab Navigation

- **Hotel** tab → AccomodationStack (Home, Hotels, Bookings, Filter, Details, Checkout)
- **Food** tab → FoodStack
- **Car Hire** tab → CarStack
- **Profile** tab → ProfileStack (Profile, MyBookings, Wishlists, Notifications, Chat)

## Complete Navigation Map

### AccomodationStack Screens:

1. AccomodationHome (initial)
2. AdvancedFilter
3. Recommended
4. HotelDetails
5. CalenderBooking
6. Checkout
7. TripDetails
8. ThankYouScreen
9. Wishlists
10. MyBookings
11. RealtorProfile
12. Profile (shared)
13. Chat (shared)

### ProfileStack Screens:

1. Profile (initial)
2. MyBookings
3. Wishlists
4. Notifications
5. Chat

### AppStack Screens (Shared):

- All screens from AccomodationStack
- Profile
- Chat
- Notifications
- Checkout
- And more...

## Navigation Best Practices

1. **Use navigate() for forward navigation**

   ```typescript
   navigation.navigate('ScreenName', { params });
   ```

2. **Use goBack() for backward navigation**

   ```typescript
   navigation.goBack();
   ```

3. **Use reset() to clear navigation stack**

   ```typescript
   navigation.reset({
     index: 0,
     routes: [{ name: 'AccomodationHome' }],
   });
   ```

4. **Pass parameters between screens**

   ```typescript
   // Navigate with params
   navigation.navigate('HotelDetails', {
     hotelId: '123',
     hotelName: 'Lux Hotel',
   });

   // Access params in destination screen
   const { hotelId, hotelName } = route.params;
   ```

## Flow Summary

**Main Booking Flow:**
Home → Filter → Results → Hotel Details → Calendar → Checkout → Trip Details → Thank You

**Quick Access:**

- Home → Wishlists
- Home → My Bookings
- Home → Profile
- Home → Notifications
- Profile → Chat
- Hotel Details → Chat (with host)
