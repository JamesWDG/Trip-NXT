import images from "../config/images"
import labels from "../config/labels"

export interface IconList {
    id: string,
    icon: string,
    title: string
}

export interface HotelFeature {
    id: number,
    name: string,
    image: string,
    isActive: boolean,
    type: string,
    createdAt: string,
    updatedAt: string,
    HotelFeature: {
        id: number,
        featureId: number,
        hotelId: number,
        createdAt: string,
        updatedAt: string
    }
}

export interface owner {
    email: string;
    name: string;
    phoneNumber: string;
    profilePicture: string;
    createdAt: string;
}

export interface AccomodationCard {
    checkInTime: string;
    checkOutTime: string;
    createdAt: string;
    description: string
    features: HotelFeature[]
    hotelType: 'standard' | 'luxury' | 'budget';
    id: number;
    images: string[];
    isActive: boolean;
    location: {
        id: number,
        city: string,
        state: string,
        country: string,
        latitude: number,
        longitude: number,
        street: string,
        createdAt: string,
        updatedAt: string
    };
    locationId: number;
    name: string;
    numberOfBathrooms: number;
    numberOfBeds: number;
    numberOfGuests: number;
    numberOfRooms: number;
    ownerId: number;
    owner: owner;
    phoneNumber: string;
    rentPerDay: number;
    rentPerHour: number
    updatedAt: string;
    website: string;
}

export const IconListArray: IconList[] = [
    {
        id: "1",
        icon: images.single_room,
        title: labels.singleRoom
    },
    {
        id: "2",
        icon: images.studios,
        title: labels.studios
    },
    {
        id: "3",
        icon: images.appartment,
        title: labels.appartment
    },
    {
        id: "4",
        icon: images.condos,
        title: labels.condos
    },
    {
        id: "5",
        icon: images.hotel_room,
        title: labels.hotelRoom,
    },

]





export interface CarouselData {
    id: string,
    image: string,
    title: string,
    description: string
}
export const CarouselData: CarouselData[] = [
    {
        id: "1",
        image: images.slider_accomodation,
        title: "Journey Starts with a Great Stay",
        description: "Get Extra 25% Off On 1st Booking"
    },
    {
        id: "2",
        image: images.slider_accomodation,
        title: "Journey Starts with a Great Stay",
        description: "Get Extra 25% Off On 1st Booking"
    },
    {
        id: "3",
        image: images.slider_accomodation,
        title: "Journey Starts with a Great Stay",
        description: "Get Extra 25% Off On 1st Booking"
    },
    {
        id: "4",
        image: images.slider_accomodation,
        title: "Journey Starts with a Great Stay",
        description: "Get Extra 25% Off On 1st Booking"
    },
    {
        id: "5",
        image: images.slider_accomodation,
        title: "Journey Starts with a Great Stay",
        description: "Get Extra 25% Off On 1st Booking"
    },
]

export interface RealtorProfileCardType {
    id: string,
    title: string,
}

export const RealtorProfileCard: RealtorProfileCardType[] = [
    {
        id: "1",
        title: "My work: Entrepreneur",
    },
    {
        id: "2",
        title: "I spend too much time: watching reels",
    },
    {
        id: "3",
        title: "For guests, I always: make them feel",
    },
    {
        id: "4",
        title: "What makes my home unique: Cozy.",
    },
    {
        id: "5",
        title: "Most useless skill: Eat - sleep - Netflix.",
    },
    {
        id: "6",
        title: "I'm obsessed with: exploring new places",
    },
    {
        id: "7",
        title: "Speaks English and German",
    },
    {
        id: "8",
        title: "Identity verified",
    }
]
